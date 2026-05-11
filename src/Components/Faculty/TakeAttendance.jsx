import ShowSubjects from "../ShowSubjects"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong, faPlus } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { useState, useMemo, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

export default ({ instituteId, deptName, deptId, subjects }) => {

    const [canTakeAttendance, setCanTakeAttendance] = useState(false)
    const { data: admin } = useSelector(state => state.admin)
    const [students, setStudents] = useState([])
    const [paper, setPaper] = useState("")

    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0 = Jan
    const todayDate = now.getDate(); // 1..31

    // Attendance can be taken only until 1 hour after page load/current time.
    // Example: if opened at 10:00 AM, checkbox is enabled until 11:00 AM.

    const [currentTime, setCurrentTime] = useState(new Date());
    // Store the time when the component first loads
    const [attendanceStartTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // update every 1 minute

        return () => clearInterval(interval);
    }, []);

    const attendanceDeadline = new Date(attendanceStartTime);
    attendanceDeadline.setHours(attendanceDeadline.getHours() + 1);

    // ✅ Total days in current month (handles leap year too)
    const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // ✅ Filter values (default to current)
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectedMonth, setSelectedMonth] = useState(monthIndex);

    // ✅ Show columns only till today
    const visibleDays = useMemo(() => {
        const days = [];
        for (let d = 1; d <= Math.min(todayDate, totalDaysInMonth); d++) {
            days.push(d);
        }
        return days;
    }, [todayDate, totalDaysInMonth]);

    const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const getAttendanceInfo = (subject) => {
        const encodedPaperName = encodeURIComponent(subject)
        setCanTakeAttendance(true)
        setPaper(subject)

        axios.get(`attendance/getAttendanceInfo/${instituteId}/${deptId}/${encodedPaperName}/${year}/${months[selectedMonth]}`)
            .then(res => {
                const { status, message } = res.data;

                if (!status) return toast
                setStudents(message)
            })
            .catch(err => {
                console.error(`Retrieving Student Attendance --> ${err}`)
                toast("Network connection error")
            })
    }


    // ✅ tick present/absent for a date
    const toggleAttendance = (studentId, day) => {
        setStudents((prev) =>
            prev.map((st) => {
                if (st.studentId !== studentId) return st;

                const attendanceArr = st.studentAttendance ?? [];

                const idx = attendanceArr.findIndex((a) => a.day === day);

                // ✅ If day already exists -> toggle present
                if (idx !== -1) {
                    const updated = [...attendanceArr];
                    updated[idx] = {
                        ...updated[idx],
                        present: !updated[idx].present,
                    };

                    return {
                        ...st,
                        studentAttendance: updated,
                    };
                }

                // ✅ If day doesn't exist -> add new as present
                return {
                    ...st,
                    studentAttendance: [...attendanceArr, { day, present: true }],
                };
            })
        );
    };

    const handleSubmit = () => {
        const payload = {
            instituteId,
            deptId,
            paperName: paper,   // or selected paper
            year,
            month: months[monthIndex], // because schema month is String

            attendanceList: students.map((st) => ({
                studentId: st.studentId,
                studentName: st.studentName,
                studentAttendance: st.studentAttendance || [],
            })),
        };

        axios.post("attendance/takeAttendance", payload)
            .then(res => {
                const { status, message } = res.data;
                return toast(message)
            })
            .catch(err => {
                console.error(`Taking Student Attendance Error --> ${err}`)
                toast("Network connection error")
            })

        // axios.post("/saveAttendance", payload)
    };


    return (
        <div className="departmentList-wrapper">
            <div className="header">
                <h2>Take Attendance</h2>
            </div>
            <div className="content">
                {
                    canTakeAttendance && <div className="btn-container">
                        <button
                            onClick={() => setCanTakeAttendance(false)}
                            className="close-btn blue-btn"
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </button>
                    </div>
                }
                <div className="departmentList-container">
                    {
                        !canTakeAttendance
                            ? <ShowSubjects subjects={subjects} onClick={getAttendanceInfo} />
                            : <div className="monthlyAttendancePage">
                                {/* ✅ Filter Section */}
                                <div className="attendanceFilterBar">
                                    <div>
                                        <label>Year</label>
                                        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                            {years.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label>Month</label>
                                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                                            {months.map((m, idx) => (
                                                <option key={m} value={idx}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button className="tiny-btn" onClick={getAttendanceInfo}>
                                        View Attendance
                                    </button>
                                </div>

                                <h2 className="monthlyTitle">
                                    Monthly Attendance ({selectedYear} - {months[selectedMonth]})
                                </h2>

                                <div className="monthlyTableWrap">
                                    <table className="monthlyTable">
                                        <thead>
                                            <tr>
                                                <th>Roll</th>
                                                <th>Name</th>
                                                {visibleDays.map((d) => (
                                                    <th key={d}>{d}</th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {students.map((st) => (
                                                <tr key={st.studentId}>
                                                    <td>{st.studentId}</td>
                                                    <td>{st.studentName}</td>

                                                    {visibleDays.map((d) => {
                                                        const isPresent =
                                                            st.studentAttendance?.find((a) => a.day === d)?.present ?? false;

                                                        // ✅ checkbox enabled only if user selected current year + month AND day is today
                                                        const isCurrentMonth =
                                                            selectedYear === year && selectedMonth === monthIndex;

                                                        const shouldEnableCheckbox = !admin && isCurrentMonth && d === todayDate && currentTime <= attendanceDeadline;

                                                        return (
                                                            <td
                                                                key={`${st.studentId}-day-${d}`}
                                                                className={`tickCell ${isPresent ? "presentCell" : "absentCell"}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isPresent}
                                                                    onChange={() => toggleAttendance(st.studentId, d)}
                                                                    disabled={!shouldEnableCheckbox}
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {
                                    admin
                                        ? <></>
                                        : <button className="submitMonthlyBtn" onClick={handleSubmit} disabled={currentTime > attendanceDeadline}>
                                            Submit Attendance ✅
                                        </button>
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}