import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoadingContext } from "../../Context_API/LoadingContext";
import { faBan, faSpinner, faTriangleExclamation, faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HoverButton } from "./AnimatedPage";

export default ({ children, onClose, onProceed, userType }) => {
    const { isloading, isRemoving, setIsRemoving } = useLoadingContext();
    const { data: admin } = useSelector(state => state.admin);

    const [password, setPassword] = useState("");
    const passRef = useRef();

    const isSimple = ["Exam", "Assignment", "Paper", "Announcement", "submitExam"].includes(userType);

    const checkAdminPassword = () => {
        if (password.trim() === "") {
            passRef.current?.focus();
            return toast("Please enter admin password");
        }
        const encodedPass = encodeURIComponent(password.trim());
        setIsRemoving(true);
        axios.get(`admin/checkPassword/?adminEmail=${admin.adminEmail}&adminPassword=${encodedPass}`)
            .then(res => {
                if (res.data === true) onProceed();
                else toast("Wrong Admin Password");
            })
            .catch(err => {
                if (err.response?.status === 404) return toast(err.response.data);
                toast("Network connection error");
            })
            .finally(() => setIsRemoving(false));
    };

    const handleProceed = () => {
        if (isSimple) onProceed();
        else checkAdminPassword();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                    onClick={() => !isloading && !isRemoving && onClose()}
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative bg-white rounded-3xl shadow-luxury-xl border border-gray-100
                               w-full max-w-md overflow-hidden z-10"
                >
                    {/* Top bar */}
                    <div className={`h-1.5 ${isSimple ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-red-400 to-red-600"}`} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        disabled={isloading || isRemoving}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 border-none
                                   flex items-center justify-center text-gray-500 cursor-pointer
                                   hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-sm" />
                    </button>

                    <div className="p-8">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5
                                        ${isSimple
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-500"}`}>
                            <FontAwesomeIcon icon={isSimple ? faCheckCircle : faTriangleExclamation} />
                        </div>

                        {isSimple ? (
                            <>
                                <h3 className="text-xl font-extrabold text-gray-800 mb-2 tracking-tight">
                                    {userType === "submitExam" ? "Confirm Submission?" : "Are You Sure?"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    {userType === "submitExam"
                                        ? "Once submitted, you cannot change your answers."
                                        : `This action will permanently delete the ${userType}.`}
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-extrabold text-gray-800 mb-2 tracking-tight">
                                    {userType} {userType !== "Batch Update" && "Account Deletion"}
                                </h3>
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
                                    <p className="text-sm text-red-700 leading-relaxed">
                                        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
                                        {userType === "Batch Update"
                                            ? "Batch semester will be updated and all related exams, assignments, and announcements will be deleted."
                                            : `All details related to the ${userType} will be permanently deleted. This action cannot be undone.`}
                                    </p>
                                </div>
                                <div className="form-group-luxury">
                                    <label className="form-label-luxury">Admin Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter admin password to confirm"
                                        onChange={(e) => setPassword(e.target.value)}
                                        ref={passRef}
                                        className="input-luxury"
                                    />
                                </div>
                            </>
                        )}

                        {children}

                        <div className="flex gap-3 mt-2">
                            <HoverButton
                                onClick={handleProceed}
                                disabled={isRemoving || isloading}
                                className={`flex-1 py-3 rounded-full font-outfit font-bold text-sm text-white border-none cursor-pointer
                                            flex items-center justify-center gap-2 shadow-luxury transition-all duration-300
                                            ${isSimple
                                                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                : "bg-gradient-to-r from-red-400 to-red-600"}`}
                            >
                                <FontAwesomeIcon icon={(isRemoving || isloading) ? faSpinner : (isSimple ? faCheckCircle : faTriangleExclamation)}
                                                spin={isRemoving || isloading} />
                                {isRemoving ? "Processing..." : "Proceed"}
                            </HoverButton>
                            <HoverButton
                                onClick={onClose}
                                disabled={isloading || isRemoving}
                                className="flex-1 py-3 rounded-full font-outfit font-semibold text-sm text-gray-600
                                           bg-white border border-gray-200 cursor-pointer
                                           flex items-center justify-center gap-2
                                           hover:border-blush hover:text-rose transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faBan} /> Cancel
                            </HoverButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
