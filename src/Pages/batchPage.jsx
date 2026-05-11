import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { removeBatch, updateSemester } from "../Redux_Components/Features/batchSlice.mjs";
import { removeBatch_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useLocation, useNavigate } from "react-router-dom";
import Announcement from "../Components/Announcement";
import StudentList from "../Components/StudentList";
import ShowAssignments from "../Components/ShowAssignments";
import ShowExams from "../Components/ShowExams";
import ShowBatch from "../Components/ShowBatch";
import TakeAttendance from "../Components/Faculty/TakeAttendance";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLayerGroup, faUsers, faBullhorn, faClipboardList, faFileAlt,
    faCalendarCheck, faArrowLeft, faTrash, faRefresh, faPlus, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../Components/Others/PopWindow";
import ShowAttendance from "../Components/ShowAttendance";
import FormPopUp from "../Components/Others/FormPopUp";
import DashboardLayout from "../Components/Others/DashboardLayout";
import { HoverButton } from "../Components/Others/AnimatedPage";

const BatchPage = () => {
    const loc = useLocation();
    const deptId = loc?.state;

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext();
    const { data: batchData } = useSelector(state => state.batch);
    const { data: instiData } = useSelector(state => state.institute);
    const { data: admin } = useSelector(state => state.admin);
    const { data: deptData } = useSelector(state => state.department);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [showField, setShowField] = useState("account");
    const [canRemoveBatch, setCanRemoveBatch] = useState(false);
    const [canUpdateBatch, setCanUpdateBatch] = useState(false);
    const [canCreateAttendance, setCanCreateAttendance] = useState(false);
    const [attendanceInfo, setAttendanceInfo] = useState({ info: [{ year: "", month: "" }] });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i);

    useEffect(() => {
        const temp = [];
        deptData?.papers?.forEach(paper => { if (paper.semester === batchData?.semester) temp.push(paper.name); });
        setSubjects(temp);
    }, [deptData]);

    const remove = () => {
        setIsRemoving(true);
        axios.delete(`admin/handleBatch/${deptId}/?batchName=${batchData.batchName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) { dispatch(removeBatch_dept(batchData.batchName)); dispatch(removeBatch()); navigate(-1); }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsRemoving(false));
    };

    const update = () => {
        setIsloading(true);
        axios.patch(`admin/handleBatch/${deptId}/?batchName=${batchData?.batchName}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                dispatch(updateSemester(message));
                setCanUpdateBatch(false);
                toast("Batch updated");
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const addAttendance = () => setAttendanceInfo(prev => ({ ...prev, info: [...prev.info, { year: "", month: "" }] }));

    const handleAttendance = (year, month, index) => {
        setAttendanceInfo(prev => {
            const temp = [...prev.info];
            temp[index] = { year: year || temp[index].year, month: month || temp[index].month };
            return { ...prev, info: temp };
        });
    };

    const removeAttendance = (index) => {
        const temp = [...attendanceInfo.info];
        temp.splice(index, 1);
        setAttendanceInfo({ ...attendanceInfo, info: temp });
    };

    const createAttendance = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.post(`admin/createAttendance`, { instituteId: instiData.instituteId, departmentId: deptData._id, semester: batchData.semester, data: attendanceInfo.info })
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) { setCanCreateAttendance(false); setAttendanceInfo({ info: [{ year: "", month: "" }] }); }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const navItems = [
        { key: "account", label: "Batch Account", icon: faLayerGroup, onClick: () => setShowField("account"), disabled: isloading || isRemoving },
        { key: "student", label: "Student List", icon: faUsers, onClick: () => setShowField("student"), disabled: isloading || isRemoving },
        { key: "announcement", label: "Announcements", icon: faBullhorn, onClick: () => setShowField("announcement"), disabled: isloading || isRemoving },
        { key: "punchStatus", label: "Punch Status", icon: faCalendarCheck, onClick: () => setShowField("punchStatus"), disabled: isloading || isRemoving },
        ...(admin ? [
            { key: "createAtt", label: "Create Attendance", icon: faPlus, onClick: () => setCanCreateAttendance(true), disabled: isloading || isRemoving },
            { key: "assignments", label: "Assignments", icon: faClipboardList, onClick: () => setShowField("assignments"), disabled: isloading || isRemoving },
            { key: "exams", label: "Exams", icon: faFileAlt, onClick: () => setShowField("exams"), disabled: isloading || isRemoving },
            { key: "studentAttendance", label: "Student Attendance", icon: faFileAlt, onClick: () => setShowField("studentAttendance"), disabled: isloading || isRemoving },
        ] : []),
    ];

    const bottomItems = [
        ...(admin ? [
            { key: "updateSem", label: "Update Semester", icon: faRefresh, onClick: () => setCanUpdateBatch(true), disabled: isloading || isRemoving },
            { key: "removeBatch", label: "Remove Batch", icon: faTrash, onClick: () => setCanRemoveBatch(true), danger: true, disabled: isloading || isRemoving },
        ] : []),
        { key: "back", label: "Go Back", icon: faArrowLeft, onClick: () => navigate(-1), disabled: isloading || isRemoving },
    ];

    return (
        <>
            {canRemoveBatch && <PopWindow userType="Batch" onClose={() => setCanRemoveBatch(false)} onProceed={remove} />}
            {canUpdateBatch && <PopWindow userType="Batch Update" onClose={() => setCanUpdateBatch(false)} onProceed={update} />}
            {canCreateAttendance && (
                <FormPopUp onClose={() => { setCanCreateAttendance(false); setAttendanceInfo({ info: [{ year: "", month: "" }] }); }} onSubmit={createAttendance} formElems={[]}>
                    <div className="form-group-luxury">
                        <label className="form-label-luxury">Create Attendance Records</label>
                        {attendanceInfo.info.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 mb-3">
                                <select
                                    onChange={(e) => handleAttendance(e.target.value, "", index)}
                                    value={item.year}
                                    className="input-luxury flex-1 py-2"
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select
                                    onChange={(e) => handleAttendance("", e.target.value, index)}
                                    value={item.month}
                                    className="input-luxury flex-1 py-2"
                                >
                                    <option value="" disabled>Month</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <HoverButton
                                    type="button"
                                    onClick={() => removeAttendance(index)}
                                    disabled={isloading}
                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-500 border-none cursor-pointer
                                               flex items-center justify-center text-xs hover:bg-red-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </HoverButton>
                            </div>
                        ))}
                        <HoverButton
                            type="button"
                            onClick={addAttendance}
                            disabled={isloading}
                            className="btn-primary btn-sm gap-2 mt-2"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Field
                        </HoverButton>
                    </div>
                </FormPopUp>
            )}

            <DashboardLayout
                title="Batch Dashboard"
                subtitle={batchData?.batchName}
                icon={faLayerGroup}
                navItems={navItems}
                bottomItems={bottomItems}
                activeKey={showField}
                pageTitle="Batch Dashboard"
            >
                {showField === "account" && <ShowBatch />}
                {showField === "student" && <StudentList batchName={batchData?.batchName} deptId={deptId} studentList={batchData?.studentList} />}
                {showField === "assignments" && <ShowAssignments deptId={deptId} subjects={subjects} teacherName={null} type="faculty" isVisiting={true} />}
                {showField === "exams" && admin && <ShowExams instituteId={instiData.instituteId} deptName={deptData.departmentName} deptId={deptId} subjects={subjects} />}
                {showField === "announcement" && <Announcement deptId={deptId} announcements={batchData?.batchAnnouncements} batchName={batchData?.batchName} type="Batch" />}
                {showField === "punchStatus" && <ShowAttendance batchName={batchData?.batchName} deptId={deptId} studentList={batchData?.studentList} />}
                {showField === "studentAttendance" && <TakeAttendance instituteId={instiData.instituteId} deptName={deptData.departmentName} deptId={deptData._id} subjects={subjects} />}
            </DashboardLayout>
        </>
    );
};

export default BatchPage;
