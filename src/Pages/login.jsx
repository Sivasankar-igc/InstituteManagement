import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addInstitute } from "../Redux_Components/Features/instituteSlice.mjs";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { addDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { addStudent } from "../Redux_Components/Features/studentSlice.mjs";
import { addBatch } from "../Redux_Components/Features/batchSlice.mjs";
import { addFaculty } from "../Redux_Components/Features/facultySlice.mjs";
import { useConfidentialContext } from "../Context_API/Confidential";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSpinner, faArrowRight, faLock, faEye, faEyeSlash,
    faEnvelope, faIdCard, faBuilding, faUserShield, faChalkboardTeacher, faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import { HoverButton, ScaleIn } from "../Components/Others/AnimatedPage";

const roleConfig = {
    Institute: { icon: faBuilding,          color: "from-blush to-rose",         label: "Institute" },
    Admin:     { icon: faUserShield,         color: "from-violet-400 to-violet-600", label: "Admin" },
    Faculty:   { icon: faChalkboardTeacher,  color: "from-sky-400 to-sky-600",    label: "Faculty" },
    Student:   { icon: faUserGraduate,       color: "from-emerald-400 to-emerald-600", label: "Student" },
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginType = useParams().loginType;

    const { data: instituteInfos } = useSelector(state => state.institute);
    const { setConfidentialPassword, confidentialPassword } = useConfidentialContext();
    const { setAccountUrl, setSuccessAuthentication } = useAuthenticateContext();

    const [loginInfos, setLoginInfos] = useState({ id: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const role = roleConfig[loginType] || roleConfig.Institute;

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setLoginInfos(prev => ({ ...prev, [name]: value }));
    };

    const instituteLogin = () => {
        setIsLoading(true);
        axios.post(`${loginType.toLowerCase()}/login`, loginInfos)
            .then(res => {
                const { status, message } = res.data;
                if (!status) { toast(message); return; }
                dispatch(addInstitute(message));
                setConfidentialPassword(loginInfos.password);
                navigate(`/institute/${message.instituteId}`);
                setAccountUrl(`/institute/${message.instituteId}`);
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsLoading(false));
    };

    const otherLogins = () => {
        setIsLoading(true);
        axios.post(`${loginType.toLowerCase()}/login`, { loginInfos, instituteInfos, confidential: confidentialPassword })
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                setSuccessAuthentication(true);
                if (loginType === "Admin") {
                    const { admin, departmentInfo, isSuperAdmin } = message;
                    dispatch(addAdmin({ admin, isSuperAdmin }));
                    !isSuperAdmin && dispatch(addDepartments(departmentInfo));
                    navigate(`/institute/${instituteInfos.instituteId}/admin`);
                    setAccountUrl(`/institute/${instituteInfos.instituteId}/admin`);
                } else if (loginType === "Student") {
                    const { student, batch, department } = message;
                    dispatch(addStudent(student));
                    dispatch(addBatch(batch));
                    dispatch(addDepartments(department));
                    navigate(`/institute/${instituteInfos.instituteId}/student/${student.studentId}`);
                    setAccountUrl(`/institute/${instituteInfos.instituteId}/student/${student.studentId}`);
                } else {
                    const { faculty, department } = message;
                    dispatch(addFaculty(faculty));
                    dispatch(addDepartments(department));
                    navigate(`/institute/${instituteInfos.instituteId}/department/${department.departmentName}/faculty/${faculty.facultyId}`);
                    setAccountUrl(`/institute/${instituteInfos.instituteId}/department/${department.departmentName}/faculty/${faculty.facultyId}`);
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsLoading(false));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loginType === "Institute") instituteLogin();
        else otherLogins();
    };

    return (
        <div className="min-h-screen flex items-center justify-center
                        bg-gradient-to-br from-peach via-cream to-blush-light
                        px-4 py-12 relative overflow-hidden">
            <Helmet>
                <title>{loginType} Login — Insti360</title>
                <meta name="robots" content="index, follow" />
            </Helmet>

            {/* Background orbs */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blush/20 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-nude/15 pointer-events-none" />

            <div className="w-full max-w-5xl flex items-center gap-12 relative z-10">

                {/* ── Left: Form Card ── */}
                <ScaleIn className="w-full max-w-[440px] mx-auto md:mx-0 relative">
                    {/* Depth layers for Institute login */}
                    {loginType === "Institute" && (
                        <>
                            <div className="absolute -bottom-3 -right-3 w-full h-full bg-blush/20 rounded-3xl -z-10" />
                            <div className="absolute -bottom-6 -right-6 w-full h-full bg-nude/15 rounded-3xl -z-20" />
                        </>
                    )}
                    <div className={`bg-white rounded-3xl shadow-luxury-xl border overflow-hidden relative
                                    ${loginType === "Institute" ? "border-blush/30" : "border-gray-100"}`}
                         style={loginType === "Institute" ? {
                             boxShadow: "0 20px 60px rgba(196,123,114,0.25), 0 0 0 1px rgba(231,169,162,0.2)"
                         } : {}}>
                        {/* Top gradient bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${role.color}`} />

                        <div className="p-10">
                            {/* Brand icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color}
                                            flex items-center justify-center text-white text-xl
                                            shadow-luxury mb-6`}
                            >
                                <FontAwesomeIcon icon={role.icon} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <p className="text-xs font-semibold tracking-widest uppercase text-rose mb-1">
                                    Welcome Back
                                </p>
                                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
                                    {loginType} Login
                                </h2>
                                <p className="text-sm text-gray-500 mb-8">
                                    Login to continue managing your institution smarter.
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* ID Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="form-label-luxury">
                                        {loginType === "Admin" ? "Admin Email" : `${loginType} ID`}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            <FontAwesomeIcon icon={loginType === "Admin" ? faEnvelope : faIdCard} />
                                        </span>
                                        <input
                                            type="text"
                                            name="id"
                                            placeholder={`Enter your ${loginType === "Admin" ? "admin email" : loginType.toLowerCase() + " ID"}`}
                                            onChange={handleUpdate}
                                            required
                                            className="input-luxury pl-11"
                                        />
                                    </div>
                                </motion.div>

                                {/* Password Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <label className="form-label-luxury">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            onChange={handleUpdate}
                                            required
                                            className="input-luxury pl-11 pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                                                       hover:text-rose transition-colors duration-200 bg-transparent border-none cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Submit */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <HoverButton
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3.5 rounded-full font-outfit font-bold text-sm text-white
                                                    bg-gradient-to-r ${role.color} border-none cursor-pointer
                                                    shadow-luxury transition-all duration-300 flex items-center justify-center gap-2`}
                                    >
                                        {isLoading
                                            ? <><FontAwesomeIcon icon={faSpinner} spin /> Signing in...</>
                                            : <>Sign In <FontAwesomeIcon icon={faArrowRight} /></>
                                        }
                                    </HoverButton>
                                </motion.div>

                                {/* Link */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-center text-sm text-gray-500 mt-4"
                                >
                                    {loginType === "Institute"
                                        ? <>Don't have an account?{" "}
                                            <Link to="/createInstitute" className="text-rose font-semibold hover:underline">
                                                Create Institute
                                            </Link></>
                                        : <Link to={`/generateOtp/${loginType.toLowerCase()}`}
                                                className="text-rose font-semibold hover:underline">
                                            Forgot Password?
                                          </Link>
                                    }
                                </motion.p>
                            </form>
                        </div>
                    </div>
                </ScaleIn>

                {/* ── Right: Banner Image ── */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden md:block flex-1 max-w-[480px]"
                >
                    <img src="/banner.png" alt="Insti360"
                         className="w-full rounded-3xl shadow-luxury-xl object-cover" />
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
