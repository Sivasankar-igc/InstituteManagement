import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { modifyFaculty_dept, removeFaculty_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBan, faCheck, faXmark, faLock, faPenToSquare,
    faPlus, faSpinner, faTrashCan, faChalkboardTeacher, faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default ({ deptId, faculty_id, faculty, goBack }) => {
    const [facultyInfo, setFacultyInfo] = useState(faculty);
    const { data: deptData } = useSelector(state => state.department);
    const { data: instituteInfo } = useSelector(state => state.institute);
    const { data: admin } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext();

    const [facultyData, setFacultyData] = useState(facultyInfo);
    const [canUpdate, setCanUpdate] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    useEffect(() => {
        if (faculty_id) {
            axios.get(`admin/getFaculty/${faculty_id}`)
                .then(res => {
                    const { status, message } = res.data;
                    if (!status) return toast(message);
                    setFacultyInfo(message);
                    setFacultyData(message);
                })
                .catch(() => toast("Network connection error"));
        }
    }, [faculty_id]);

    const deleteFaculty = () => {
        setIsRemoving(true);
        axios.delete(`admin/handleFacultyAccount/?departmentId=${deptId}&facultyId=${faculty_id}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) { dispatch(removeFaculty_dept(faculty_id)); goBack(); }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsRemoving(false));
    };

    const modifyFaculty = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.patch(`admin/handleFacultyAccount/?instituteId=${instituteInfo.instituteId}&departmentId=${deptId}`, facultyData)
            .then(res => {
                const { status, message } = res.data;
                if (!status) { setFacultyData(facultyInfo); return toast(message); }
                setCanUpdate(false);
                setFacultyInfo(message);
                setFacultyData(message);
                dispatch(modifyFaculty_dept({ facultyId: faculty_id, facultyDeptId: facultyData.facultyId }));
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacultyData(prev => ({ ...prev, [name]: value }));
    };

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setFacultyData(prev => ({ ...prev, facultyName: { ...prev.facultyName, [name]: value } }));
    };

    const removeSubject = (index) => {
        const temp = [...facultyData.subjects];
        temp.splice(index, 1);
        setFacultyData(prev => ({ ...prev, subjects: temp }));
    };

    const addSubject = () => setFacultyData(prev => ({ ...prev, subjects: [...prev.subjects, ""] }));

    const handleSubjects = (val, index) => {
        const temp = [...facultyData.subjects];
        temp[index] = val;
        setFacultyData(prev => ({ ...prev, subjects: temp }));
    };

    const formFields = [
        { type: "text",  name: "facultyId",    label: "Faculty ID",    value: facultyInfo?.facultyId,           onChange: handleChange },
        { type: "text",  name: "firstName",     label: "First Name",    value: facultyInfo?.facultyName?.firstName, onChange: handleNameChange },
        { type: "text",  name: "lastName",      label: "Last Name",     value: facultyInfo?.facultyName?.lastName,  onChange: handleNameChange },
        { type: "email", name: "facultyEmail",  label: "Email",         value: facultyInfo?.facultyEmail,        onChange: handleChange },
        { type: "text",  name: "designation",   label: "Designation",   value: facultyInfo?.designation,         onChange: handleChange },
    ];

    if (!facultyInfo) return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-8 h-8 border-2 border-blush border-t-rose rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading Faculty Info...</p>
            {goBack && (
                <HoverButton onClick={goBack} className="btn-ghost btn-sm gap-2">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </HoverButton>
            )}
        </div>
    );

    return (
        <AnimatedPage>
            {canDelete && <PopWindow userType="Faculty" onClose={() => setCanDelete(false)} onProceed={deleteFaculty} />}

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blush to-rose
                                   flex items-center justify-center text-white text-3xl shadow-luxury mb-4"
                    >
                        <FontAwesomeIcon icon={faChalkboardTeacher} />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Faculty Account</h2>
                    <span className="badge badge-primary mt-2">{facultyInfo?.facultyId}</span>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <form onSubmit={modifyFaculty} className="p-8">
                        {/* Back button for admin view */}
                        {!faculty && goBack && (
                            <div className="flex justify-end mb-4">
                                <HoverButton type="button" onClick={goBack} className="btn-ghost btn-sm gap-2">
                                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                                </HoverButton>
                            </div>
                        )}

                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                            {formFields.map(({ type, name, label, value, onChange }, i) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className={name === "facultyEmail" ? "sm:col-span-2" : ""}
                                >
                                    <label className="form-label-luxury">{label}</label>
                                    {canUpdate ? (
                                        <input type={type} name={name} defaultValue={value} onChange={onChange} className="input-luxury" />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Subjects */}
                        {facultyData?.subjects?.length > 0 && (
                            <div className="mb-6">
                                <label className="form-label-luxury">Subjects</label>
                                <div className="flex flex-col gap-2">
                                    {facultyData.subjects.map((sub, index) => (
                                        <div key={`${sub}-${index}`} className="flex items-center gap-2">
                                            <select
                                                name="subjects"
                                                value={sub}
                                                disabled={!canUpdate}
                                                onChange={(e) => handleSubjects(e.target.value, index)}
                                                className="input-luxury flex-1"
                                            >
                                                <option value="" disabled>Choose subject</option>
                                                {deptData?.papers?.map(({ name }) => (
                                                    <option key={`${name}-${index}`} value={name}>{name.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            {canUpdate && (
                                                <HoverButton
                                                    type="button"
                                                    onClick={() => removeSubject(index)}
                                                    disabled={isloading || isRemoving}
                                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-500 border-none cursor-pointer
                                                               flex items-center justify-center text-xs hover:bg-red-100 transition-colors flex-shrink-0"
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </HoverButton>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {canUpdate && (
                                    <HoverButton
                                        type="button"
                                        onClick={addSubject}
                                        disabled={isloading || isRemoving}
                                        className="btn-primary btn-sm gap-2 mt-3"
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Subject
                                    </HoverButton>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 flex-wrap">
                            {!faculty ? (
                                canUpdate ? (
                                    <>
                                        <HoverButton
                                            type="button"
                                            onClick={modifyFaculty}
                                            disabled={isloading || isRemoving}
                                            className="btn-success btn-sm gap-2"
                                        >
                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                            {isloading ? "Saving..." : "Save Changes"}
                                        </HoverButton>
                                        <HoverButton
                                            type="button"
                                            onClick={() => { setFacultyData(facultyInfo); setCanUpdate(false); }}
                                            disabled={isloading || isRemoving}
                                            className="btn-danger btn-sm gap-2"
                                        >
                                            <FontAwesomeIcon icon={faBan} /> Cancel
                                        </HoverButton>
                                    </>
                                ) : admin && (
                                    <>
                                        <HoverButton
                                            type="button"
                                            onClick={() => setCanUpdate(true)}
                                            disabled={isloading || isRemoving}
                                            className="btn-violet btn-sm gap-2"
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} /> Modify
                                        </HoverButton>
                                        <HoverButton
                                            type="button"
                                            onClick={() => setCanDelete(true)}
                                            disabled={isloading || isRemoving}
                                            className="btn-danger btn-sm gap-2"
                                        >
                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                            {isRemoving ? "Removing..." : "Remove Faculty"}
                                        </HoverButton>
                                    </>
                                )
                            ) : (
                                <HoverButton
                                    type="button"
                                    disabled={isloading || isRemoving}
                                    onClick={() => navigate("/changePassword", { state: { userType: "faculty", userId: faculty._id, isOtpSent: false } })}
                                    className="btn-info btn-sm gap-2"
                                >
                                    <FontAwesomeIcon icon={faLock} /> Change Password
                                </HoverButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};
