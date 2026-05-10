import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faRotate, faSpinner, faLock, faEye, faEyeSlash, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { ScaleIn, HoverButton } from "../Components/Others/AnimatedPage";

const PasswordInput = ({ placeholder, onChange, label }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="form-group-luxury">
            <label className="form-label-luxury">{label}</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="input-luxury pl-11 pr-11"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-rose transition-colors bg-transparent border-none cursor-pointer"
                >
                    <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                </button>
            </div>
        </div>
    );
};

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    const { isloading, setIsloading } = useLoadingContext();

    const userType = loc?.state?.userType;
    const userId = loc?.state?.userId;
    const isOtpSent = loc?.state?.isOtpSent;

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [againPassword, setAgainPassword] = useState("");

    const savePassword = () => {
        if (!isOtpSent && oldPassword.trim() === "") return toast("Please enter old password");
        if (newPassword.trim() === "") return toast("Please enter new password");
        if (newPassword !== againPassword) return toast("Passwords do not match");

        setIsloading(true);
        axios.patch(`changePassword/?userType=${userType}&userId=${userId}`, { oldPassword, newPassword })
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) navigate(-1);
            })
            .catch(err => {
                if (err.response?.status === 400) return toast(err.response.data);
                toast("Network connection error");
            })
            .finally(() => setIsloading(false));
    };

    return (
        <div className="min-h-screen flex items-center justify-center
                        bg-gradient-to-br from-peach via-cream to-blush-light
                        px-4 py-12 relative overflow-hidden">
            {/* Orbs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush/20 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-nude/15 pointer-events-none" />

            <ScaleIn className="w-full max-w-[440px] relative z-10">
                <div className="bg-white rounded-3xl shadow-luxury-xl border border-gray-100 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blush to-rose" />
                    <div className="p-10">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush to-rose
                                       flex items-center justify-center text-white text-xl shadow-luxury mb-6"
                        >
                            <FontAwesomeIcon icon={faShieldHalved} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <p className="text-xs font-semibold tracking-widest uppercase text-rose mb-1">
                                Security
                            </p>
                            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
                                Change Password
                            </h2>
                            <p className="text-sm text-gray-500 mb-8">
                                Update your account password securely.
                            </p>
                        </motion.div>

                        <div className="space-y-1">
                            {!isOtpSent && (
                                <PasswordInput
                                    label="Current Password"
                                    placeholder="Enter your current password"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            )}
                            <PasswordInput
                                label="New Password"
                                placeholder="Enter your new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                placeholder="Confirm your new password"
                                onChange={(e) => setAgainPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <HoverButton
                                onClick={savePassword}
                                disabled={isloading}
                                className="flex-1 py-3 rounded-full font-outfit font-bold text-sm text-white
                                           bg-gradient-to-r from-emerald-400 to-emerald-600 border-none cursor-pointer
                                           shadow-luxury flex items-center justify-center gap-2 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={isloading ? faSpinner : faRotate} spin={isloading} />
                                {isloading ? "Saving..." : "Save Password"}
                            </HoverButton>
                            <HoverButton
                                onClick={() => navigate(-1)}
                                disabled={isloading}
                                className="flex-1 py-3 rounded-full font-outfit font-semibold text-sm text-gray-600
                                           bg-white border border-gray-200 cursor-pointer
                                           flex items-center justify-center gap-2 transition-all duration-300
                                           hover:border-blush hover:text-rose"
                            >
                                <FontAwesomeIcon icon={faBan} /> Cancel
                            </HoverButton>
                        </div>
                    </div>
                </div>
            </ScaleIn>
        </div>
    );
};

export default ChangePasswordPage;
