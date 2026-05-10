import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faEdit, faSpinner, faBuilding, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { modifyDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { modifyDepartment_insti } from "../Redux_Components/Features/instituteSlice.mjs";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default () => {
    const { data: admin } = useSelector(state => state.admin);
    const { data: deptData } = useSelector(state => state.department);
    const { data: instituteInfo } = useSelector(state => state.institute);
    const dispatch = useDispatch();
    const { isloading, setIsloading } = useLoadingContext();

    const [canChange, setCanChange] = useState(false);
    const [modifiableDeptInfo, setModifiableDeptInfo] = useState({
        deptName: deptData?.departmentName,
        hod: deptData?.headOfDepartment,
    });

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setModifiableDeptInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setCanChange(false);
        setModifiableDeptInfo({ deptName: deptData.departmentName, hod: deptData.headOfDepartment });
    };

    const saveChanges = () => {
        setIsloading(true);
        axios.put(`admin/handleDepartment/?departmentId=${deptData._id}&instituteId=${instituteInfo._id}`, modifiableDeptInfo)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyDepartments(modifiableDeptInfo));
                    dispatch(modifyDepartment_insti({ deptId: deptData._id, deptName: modifiableDeptInfo.deptName }));
                    setCanChange(false);
                }
                toast(message);
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const fields = [
        { icon: faBuilding, label: "Department Name", name: "deptName", value: modifiableDeptInfo.deptName, editable: true },
        { icon: faUserTie,  label: "Head of Department", name: "hod",  value: modifiableDeptInfo.hod,      editable: true },
    ];

    return (
        <AnimatedPage>
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
                        <FontAwesomeIcon icon={faBuilding} />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Department Account</h2>
                    <span className="badge badge-primary mt-2">{deptData?.departmentName}</span>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <div className="p-8">
                        <div className="grid grid-cols-1 gap-5 mb-6">
                            {fields.map(({ icon, label, name, value, editable }, i) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <label className="form-label-luxury flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={icon} className="text-rose" />
                                        {label}
                                    </label>
                                    {canChange && editable ? (
                                        <input
                                            type="text"
                                            name={name}
                                            defaultValue={value}
                                            onChange={handleChanges}
                                            className="input-luxury"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 flex-wrap">
                            {canChange ? (
                                <>
                                    <HoverButton
                                        onClick={saveChanges}
                                        disabled={isloading}
                                        className="btn-success btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                        {isloading ? "Saving..." : "Save Changes"}
                                    </HoverButton>
                                    <HoverButton
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isloading}
                                        className="btn-danger btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBan} /> Cancel
                                    </HoverButton>
                                </>
                            ) : admin && (
                                <HoverButton
                                    type="button"
                                    onClick={() => setCanChange(true)}
                                    disabled={isloading}
                                    className="btn-violet btn-sm gap-2"
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Modify
                                </HoverButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};
