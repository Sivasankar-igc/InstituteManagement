import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addStudentInfos } from "../Redux_Components/Features/batchSlice.mjs";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage } from "./Others/AnimatedPage";

export default ({ studentList, batchName }) => {
    const dispatch = useDispatch();
    const { studentData: studentInfos } = useSelector(state => state.batch);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

    // Dynamic days based on selected month/year
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const monthFullNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    useEffect(() => {
        axios.post(`admin/getStudentInfos`, { studentList })
            .then(res => {
                const { status, message } = res.data;
                if (status) dispatch(addStudentInfos(message));
            })
            .catch(() => toast("Network connection error"));
    }, []);

    const getStatusColor = (inTime, outTime) => {
        if (inTime === "NA" && outTime === "NA") return "";
        if (inTime !== "NA" && outTime !== "NA") return "bg-emerald-50";
        return "bg-amber-50";
    };

    return (
        <AnimatedPage>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-rose
                               flex items-center justify-center text-white text-2xl shadow-luxury mb-4"
                >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Punch Status</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {monthFullNames[selectedMonth]} {selectedYear} — {daysInMonth} Days
                </p>
            </div>

            {studentInfos.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4 p-5 border-b border-gray-100 flex-wrap">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Month Selector */}
                            <div className="relative">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="input-luxury py-2 pr-8 text-sm appearance-none cursor-pointer min-w-[120px]"
                                >
                                    {months.map((m, idx) => (
                                        <option key={idx} value={idx}>{m}</option>
                                    ))}
                                </select>
                                <FontAwesomeIcon icon={faChevronDown}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                            </div>

                            {/* Year Selector */}
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="input-luxury py-2 pr-8 text-sm appearance-none cursor-pointer min-w-[100px]"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <FontAwesomeIcon icon={faChevronDown}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200" />
                                Present
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200" />
                                Partial
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
                                Absent
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs font-poppins">
                            <thead>
                                <tr className="bg-gradient-to-r from-peach to-blush-light/50">
                                    <th className="sticky left-0 z-20 bg-peach px-4 py-3 text-left text-xs font-bold
                                                   tracking-wider uppercase text-rose border-b-2 border-blush-light
                                                   min-w-[110px] whitespace-nowrap">
                                        Student ID
                                    </th>
                                    <th className="sticky left-[110px] z-20 bg-peach px-4 py-3 text-left text-xs font-bold
                                                   tracking-wider uppercase text-rose border-b-2 border-blush-light
                                                   min-w-[150px] whitespace-nowrap">
                                        Student Name
                                    </th>
                                    {Array.from({ length: daysInMonth }, (_, i) => (
                                        <th key={i + 1}
                                            className="px-2 py-3 text-center text-xs font-bold text-rose
                                                       border-b-2 border-blush-light min-w-[70px]">
                                            {i + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {studentInfos.map(({ _id, studentId, studentName, studentActivity }, rowIndex) => (
                                    <motion.tr
                                        key={_id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: rowIndex * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-peach/20 transition-colors"
                                    >
                                        {/* Sticky Student ID */}
                                        <td className="sticky left-0 z-10 bg-white px-4 py-2.5 font-semibold text-gray-700
                                                       border-r border-gray-100 whitespace-nowrap">
                                            <span className="badge badge-primary text-xs">{studentId}</span>
                                        </td>

                                        {/* Sticky Student Name */}
                                        <td className="sticky left-[110px] z-10 bg-white px-4 py-2.5 font-medium text-gray-800
                                                       border-r border-gray-100 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blush to-rose
                                                                flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {studentName?.firstName?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                {studentName?.firstName} {studentName?.lastName}
                                            </div>
                                        </td>

                                        {/* Day Cells */}
                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                            const day = i + 1;
                                            const record = studentActivity?.find((a) => {
                                                if (!a?.currentDate) return false;
                                                const parts = a.currentDate.split(" ");
                                                return (
                                                    Number(parts[0]) === day &&
                                                    parts[1] === months[selectedMonth] &&
                                                    Number(parts[2]) === selectedYear
                                                );
                                            });

                                            const inTime = record?.entryTime || "NA";
                                            const outTime = record?.exitTime || "NA";
                                            const colorClass = getStatusColor(inTime, outTime);

                                            return (
                                                <td key={day} className={`px-1 py-2 text-center ${colorClass}`}>
                                                    <div className="flex flex-col gap-0.5 min-w-[60px]">
                                                        <span className={`text-[10px] font-semibold leading-tight
                                                            ${inTime !== "NA" ? "text-emerald-700" : "text-gray-300"}`}>
                                                            ↑{inTime}
                                                        </span>
                                                        <span className={`text-[10px] font-semibold leading-tight
                                                            ${outTime !== "NA" ? "text-rose-600" : "text-gray-300"}`}>
                                                            ↓{outTime}
                                                        </span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-4">
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>
                    <p className="text-gray-400 font-medium">No student data available</p>
                </div>
            )}
        </AnimatedPage>
    );
};
