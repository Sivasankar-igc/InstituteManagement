import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { modifyAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faSpinner, faLock, faPenToSquare, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default () => {
    const { data: admin, isSuperAdmin } = useSelector(state => state.admin);
    const [adminData, setAdminData] = useState(admin);
    const [canModify, setCanModify] = useState(false);
    const navigate = useNavigate();
    const { isloading, setIsloading } = useLoadingContext();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prev => ({ ...prev, [name]: value }));
    };

    const updateAdmin = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.put(`admin/modifyAdminAccount/${admin._id}`, adminData)
            .then(res => {
                const { status, message } = res.data;
                setCanModify(false);
                toast(message);
                if (status) dispatch(modifyAdmin(adminData));
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const fields = [
        { type: "text",  name: "adminFirstName", label: "First Name",   value: admin?.adminFirstName,  disabled: !canModify },
        { type: "text",  name: "adminLastName",  label: "Last Name",    value: admin?.adminLastName,   disabled: !canModify },
        { type: "email", name: "adminEmail",     label: "Email",        value: admin?.adminEmail,      disabled: true },
        { type: "text",  name: "designation",    label: "Designation",  value: admin?.designation,     disabled: !canModify },
        { type: "text",  name: "mobileNumber",   label: "Phone Number", value: admin?.mobileNumber,    disabled: !canModify },
    ];

    if (!admin) return (
        <div className="flex items-center justify-center p-16 text-gray-400 text-sm">
            Something went wrong
        </div>
    );

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blush to-rose
                                    flex items-center justify-center text-white text-3xl shadow-luxury mb-4">
                        <FontAwesomeIcon icon={faUserShield} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Admin Account</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isSuperAdmin ? "Super Administrator" : "Department Administrator"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <form onSubmit={updateAdmin} className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {fields.map(({ type, name, label, value, disabled }) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={name === "adminEmail" ? "sm:col-span-2" : ""}
                                >
                                    <label className="form-label-luxury">{label}</label>
                                    <input
                                        type={type}
                                        id={name}
                                        name={name}
                                        defaultValue={value}
                                        onChange={handleChange}
                                        disabled={disabled || isloading}
                                        className="input-luxury"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 flex-wrap">
                            {isSuperAdmin && (
                                canModify ? (
                                    <>
                                        <HoverButton
                                            type="submit"
                                            disabled={isloading}
                                            className="btn-success btn-sm"
                                        >
                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                            {isloading ? "Saving..." : "Save Changes"}
                                        </HoverButton>
                                        <HoverButton
                                            type="button"
                                            onClick={() => { setCanModify(false); setAdminData(admin); }}
                                            disabled={isloading}
                                            className="btn-danger btn-sm"
                                        >
                                            <FontAwesomeIcon icon={faBan} /> Cancel
                                        </HoverButton>
                                    </>
                                ) : (
                                    <HoverButton
                                        type="button"
                                        onClick={() => setCanModify(true)}
                                        className="btn-violet btn-sm"
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} /> Modify
                                    </HoverButton>
                                )
                            )}
                            {!canModify && (
                                <HoverButton
                                    type="button"
                                    onClick={() => navigate("/changePassword", { state: { userType: "admin", userId: admin._id, isOtpSent: false } })}
                                    className="btn-info btn-sm"
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
