import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { modifyInstitute } from "../Redux_Components/Features/instituteSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faSpinner, faLock, faPenToSquare, faBuilding, faIdCard, faEnvelope, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default () => {
    const { data: instiData } = useSelector(state => state.institute);
    const { isSuperAdmin } = useSelector(state => state.admin);
    const { isloading, setIsloading, isRemoving } = useLoadingContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [canModify, setCanModify] = useState(false);
    const [instituteName, setInstituteName] = useState("");

    const modify = () => {
        setIsloading(true);
        axios.patch(`admin/modifyInstitute/${instiData._id}`, { instituteName })
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) {
                    setCanModify(false);
                    dispatch(modifyInstitute(instituteName));
                    setInstituteName("");
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const fields = [
        { icon: faIdCard,    label: "Institute ID",    value: instiData.instituteId,                  editable: false },
        { icon: faBuilding,  label: "Institute Name",  value: instiData.instituteName,                editable: true  },
        { icon: faEnvelope,  label: "Admin Email",     value: instiData.superAdminMail,               editable: false },
        { icon: faCalendar,  label: "Creation Date",   value: instiData.creationDateAndTime?.date,    editable: false },
        { icon: faClock,     label: "Creation Time",   value: instiData.creationDateAndTime?.time,    editable: false },
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
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Institute Account</h2>
                    <span className="badge badge-primary mt-2">{instiData.instituteId}</span>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {fields.map(({ icon, label, value, editable }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className={label === "Institute Name" ? "sm:col-span-2" : ""}
                                >
                                    <label className="form-label-luxury flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={icon} className="text-rose" />
                                        {label}
                                    </label>
                                    {canModify && editable ? (
                                        <input
                                            type="text"
                                            defaultValue={value}
                                            onChange={(e) => setInstituteName(e.target.value)}
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
                            {canModify ? (
                                <>
                                    <HoverButton
                                        type="button"
                                        onClick={modify}
                                        disabled={isloading}
                                        className="btn-success btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                        {isloading ? "Saving..." : "Save Changes"}
                                    </HoverButton>
                                    <HoverButton
                                        type="button"
                                        onClick={() => { setCanModify(false); setInstituteName(""); }}
                                        disabled={isloading}
                                        className="btn-danger btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBan} /> Cancel
                                    </HoverButton>
                                </>
                            ) : isSuperAdmin && (
                                <>
                                    <HoverButton
                                        type="button"
                                        onClick={() => { setCanModify(true); setInstituteName(instiData.instituteName); }}
                                        disabled={isRemoving || isloading}
                                        className="btn-violet btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} /> Modify
                                    </HoverButton>
                                    <HoverButton
                                        type="button"
                                        onClick={() => navigate("/changePassword", {
                                            state: { userType: "institute", userId: instiData.instituteId, isOtpSent: false }
                                        })}
                                        disabled={isRemoving || isloading}
                                        className="btn-info btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faLock} /> Change Password
                                    </HoverButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};
