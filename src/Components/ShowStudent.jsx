import { useSelector } from "react-redux";
import { statusCode } from "../utils/statusFile.mjs";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUserGraduate, faEnvelope, faIdCard, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default ({ student }) => {
    const { status: studentStatus } = useSelector(state => state.student);
    const navigate = useNavigate();

    if (!student) return (
        <div className="flex items-center justify-center p-16 text-gray-400 text-sm">
            Something went wrong
        </div>
    );

    const fields = [
        { icon: faUserGraduate, label: "First Name",  value: student.studentName?.firstName },
        { icon: faUserGraduate, label: "Last Name",   value: student.studentName?.lastName },
        { icon: faEnvelope,     label: "Email",       value: student.studentEmail },
        { icon: faIdCard,       label: "Student ID",  value: student.studentId },
        { icon: faBirthdayCake, label: "Date of Birth", value: student.studentDOB },
    ];

    const initials = `${student.studentName?.firstName?.[0] || ""}${student.studentName?.lastName?.[0] || ""}`.toUpperCase();

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blush to-rose
                                   flex items-center justify-center text-white text-2xl font-extrabold
                                   shadow-luxury mb-4 font-outfit"
                    >
                        {initials}
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                        {student.studentName?.firstName} {student.studentName?.lastName}
                    </h2>
                    <span className="badge badge-primary mt-2">Student Account</span>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fields.map(({ icon, label, value }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={icon} className="text-rose text-xs" />
                                        <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
                                            {label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                        {value || "—"}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        {studentStatus === statusCode.IDLE && (
                            <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
                                <HoverButton
                                    type="button"
                                    onClick={() => navigate("/changePassword", {
                                        state: { userType: "student", userId: student._id, isOtpSent: false }
                                    })}
                                    className="btn-info btn-sm gap-2"
                                >
                                    <FontAwesomeIcon icon={faLock} /> Change Password
                                </HoverButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};
