import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addStudent_dept, removeStudent_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useDispatch, useSelector } from "react-redux";
import { addOneStudent_batch, addStudentInfos, modifyStudent_batch, removeStudentInfo_batch } from "../Redux_Components/Features/batchSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useConfidentialContext } from "../Context_API/Confidential";
import FormPopUp from "./Others/FormPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faSpinner, faTrashCan, faSearch, faUsers, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";
import { motion } from "framer-motion";
import { AnimatedPage, StaggerContainer, StaggerItem, HoverButton } from "./Others/AnimatedPage";

export default ({ studentList, deptId, batchName }) => {
    const { confidentialPassword } = useConfidentialContext();
    const [studentData, setStudentData] = useState(null);
    const { data: instiData } = useSelector(state => state.institute);
    const { studentData: studentInfos } = useSelector(state => state.batch);
    const { data: departmentData } = useSelector(state => state.department);
    const { data: admin } = useSelector(state => state.admin);

    const [canAddStudent, setCanAddStudent] = useState(false);
    const [removeStudent_id, setRemoveStudent_id] = useState(null);
    const [canModifyStudent, setCanModifyStudent] = useState(false);
    const [search, setSearch] = useState("");

    const dispatch = useDispatch();
    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext();

    useEffect(() => {
        axios.post(`admin/getStudentInfos`, { studentList })
            .then(res => {
                const { status, message } = res.data;
                if (status) dispatch(addStudentInfos(message));
            })
            .catch(() => toast("Network connection error"));
    }, []);

    const queryParams = {
        instituteId: instiData?.instituteId,
        instituteName: instiData?.instituteName,
        institutePass: confidentialPassword,
        departmentId: departmentData?._id,
        departmentName: departmentData?.departmentName,
        headOfDepartment: departmentData?.headOfDepartment,
        batchName,
    };
    const queryString = new URLSearchParams(queryParams).toString();

    const removeStudent = (sid) => {
        setIsRemoving(true);
        axios.delete(`admin/handleStudentAccount/?${queryString}&studentId=${sid}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) {
                    dispatch(removeStudent_dept({ batchName, sid }));
                    dispatch(removeStudentInfo_batch(sid));
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => { setIsRemoving(false); setRemoveStudent_id(null); });
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    const saveModifiedStudentData = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.put(`admin/handleStudentAccount/?${queryString}`, studentData)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                dispatch(modifyStudent_batch(studentData));
                setStudentData(null);
                setCanModifyStudent(false);
                toast("Student updated successfully");
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const requestUpdate = (student) => {
        setStudentData({
            _id: student?._id,
            firstName: student?.studentName?.firstName,
            lastName: student?.studentName?.lastName,
            studentEmail: student?.studentEmail,
            studentId: student?.studentId,
            studentDOB: student?.studentDOB,
        });
    };

    const formElems = [
        { type: "text",  name: "firstName",          label: "First Name",   placeholder: "Enter first name",   onChange: handleChanges, defaultValue: studentData?.firstName },
        { type: "text",  name: "lastName",            label: "Last Name",    placeholder: "Enter last name",    onChange: handleChanges, defaultValue: studentData?.lastName },
        { type: "email", name: "studentEmail",        label: "Student Email",placeholder: "Enter email",        onChange: handleChanges, defaultValue: studentData?.studentEmail },
        { type: "text",  name: "studentId",           label: "Student ID",   placeholder: "Enter student ID",   onChange: handleChanges, defaultValue: studentData?.studentId },
        { type: "date",  name: "studentDOB",          label: "Date of Birth",placeholder: "Enter DOB",          onChange: handleChanges, defaultValue: studentData?.studentDOB },
        { type: "text",  name: "studentRFIDUniqueId", label: "RFID Tag",     placeholder: "Enter RFID",         onChange: handleChanges, defaultValue: studentData?.studentRFIDUniqueId },
    ];

    const createStudent = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.post(`admin/createStudentAccount/?${queryString}`, studentData)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                setCanAddStudent(false);
                dispatch(addStudent_dept({ batchName, studentId: message._id }));
                dispatch(addOneStudent_batch(message));
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const filtered = (studentInfos || []).filter(s =>
        `${s.studentName?.firstName} ${s.studentName?.lastName} ${s.studentId} ${s.studentEmail}`
            .toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (s) =>
        `${s.studentName?.firstName?.[0] || ""}${s.studentName?.lastName?.[0] || ""}`.toUpperCase();

    return (
        <AnimatedPage>
            {canAddStudent && <FormPopUp onClose={() => { setCanAddStudent(false); setStudentData(null); }} onSubmit={createStudent} formElems={formElems} />}
            {canModifyStudent && <FormPopUp onClose={() => setCanModifyStudent(false)} onSubmit={saveModifiedStudentData} formElems={formElems} />}
            {removeStudent_id && <PopWindow userType="Student" onClose={() => setRemoveStudent_id(null)} onProceed={() => removeStudent(removeStudent_id)} />}

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-rose
                                flex items-center justify-center text-white text-2xl shadow-luxury mb-4">
                    <FontAwesomeIcon icon={faUsers} />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Student List</h2>
                <p className="text-sm text-gray-500 mt-1">{studentInfos?.length || 0} students enrolled</p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-luxury pl-10 py-2.5 text-sm"
                    />
                </div>
                {admin && (
                    <HoverButton
                        onClick={() => { requestUpdate(null); setCanAddStudent(true); }}
                        disabled={isloading || isRemoving}
                        className="btn-primary btn-sm gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Student
                    </HoverButton>
                )}
            </div>

            {/* Table */}
            {filtered.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table-luxury">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>DOB</th>
                                    {admin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(({ _id, studentId, studentName, studentDOB, studentEmail }, index) => (
                                    <motion.tr
                                        key={_id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <td className="text-gray-400 font-medium">{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-rose
                                                                flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {getInitials({ studentName })}
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    {studentName?.firstName} {studentName?.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{studentId}</span>
                                        </td>
                                        <td className="text-gray-500 text-xs">{studentEmail}</td>
                                        <td className="text-gray-500 text-xs">{studentDOB}</td>
                                        {admin && (
                                            <td>
                                                <div className="flex gap-2">
                                                    <HoverButton
                                                        onClick={() => { requestUpdate({ _id, studentName, studentEmail, studentId, studentDOB }); setCanModifyStudent(true); }}
                                                        disabled={isloading || isRemoving}
                                                        className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border-none cursor-pointer
                                                                   flex items-center justify-center text-xs transition-all duration-200
                                                                   hover:bg-sky-100"
                                                    >
                                                        <FontAwesomeIcon icon={isloading ? faSpinner : faPenToSquare} spin={isloading} />
                                                    </HoverButton>
                                                    <HoverButton
                                                        onClick={() => setRemoveStudent_id(_id)}
                                                        disabled={isloading || isRemoving}
                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 border-none cursor-pointer
                                                                   flex items-center justify-center text-xs transition-all duration-200
                                                                   hover:bg-red-100"
                                                    >
                                                        <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                                    </HoverButton>
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-4">
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <p className="text-gray-400 font-medium">
                        {search ? "No students match your search" : "No students enrolled yet"}
                    </p>
                </div>
            )}
        </AnimatedPage>
    );
};
