import { faBan, faClock, faPaperPlane, faRefresh, faSpinner, faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";
import { ScaleIn, HoverButton } from "../Components/Others/AnimatedPage";

export default () => {
    const navigate = useNavigate();
    const userType = useParams().userType;
    const { isloading, setIsloading } = useLoadingContext();
    const { data: instiData } = useSelector(state => state.institute);

    const [mail, setMail] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [actualOtp, setActualOtp] = useState("");
    const [timer, setTimer] = useState(9);
    const intervalRef = useRef(null);

    const timerFunction = () => {
        clearInterval(intervalRef.current);
        setTimer(9);
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const sendOtp = () => {
        setIsloading(true);
        axios.post("sendOtp", { mail, instituteName: instiData.instituteName, userType })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    toast("OTP sent successfully");
                    setActualOtp(message);
                    setIsOtpSent(true);
                    timerFunction();
                } else toast(message);
            })
            .catch(err => {
                if (err.response?.status === 400) return toast(err.response.data);
                toast("Network connection error");
            })
            .finally(() => setIsloading(false));
    };

    const proceed = () => {
        if (actualOtp !== otp) return toast("OTP doesn't match");
        navigate("/changePassword", { state: { userType: `${userType}_mail`, userId: mail, isOtpSent } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center
                        bg-gradient-to-br from-peach via-cream to-blush-light
                        px-4 py-12 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush/20 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-nude/15 pointer-events-none" />

            <AnimatePresence mode="wait">
                {!isOtpSent ? (
                    <ScaleIn key="email" className="w-full max-w-[420px] relative z-10">
                        <div className="bg-white rounded-3xl shadow-luxury-xl border border-gray-100 overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-blush to-rose" />
                            <div className="p-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush to-rose
                                               flex items-center justify-center text-white text-xl shadow-luxury mb-6"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </motion.div>

                                <p className="text-xs font-semibold tracking-widest uppercase text-rose mb-1">
                                    Password Recovery
                                </p>
                                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
                                    Forgot Password?
                                </h2>
                                <p className="text-sm text-gray-500 mb-8">
                                    Enter your registered email to receive a one-time password.
                                </p>

                                <div className="form-group-luxury">
                                    <label className="form-label-luxury">Registered Email</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </span>
                                        <input
                                            type="email"
                                            onChange={(e) => setMail(e.target.value)}
                                            placeholder="Enter your registered email"
                                            className="input-luxury pl-11"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <HoverButton
                                        onClick={sendOtp}
                                        disabled={isloading}
                                        className="flex-1 py-3 rounded-full font-outfit font-bold text-sm text-white
                                                   bg-gradient-to-r from-blush to-rose border-none cursor-pointer
                                                   shadow-luxury flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={isloading ? faSpinner : faPaperPlane} spin={isloading} />
                                        {isloading ? "Sending..." : "Send OTP"}
                                    </HoverButton>
                                    <HoverButton
                                        onClick={() => navigate(-1)}
                                        className="flex-1 py-3 rounded-full font-outfit font-semibold text-sm text-gray-600
                                                   bg-white border border-gray-200 cursor-pointer
                                                   flex items-center justify-center gap-2
                                                   hover:border-blush hover:text-rose transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faBan} /> Cancel
                                    </HoverButton>
                                </div>
                            </div>
                        </div>
                    </ScaleIn>
                ) : (
                    <ScaleIn key="otp" className="w-full max-w-[420px] relative z-10">
                        <div className="bg-white rounded-3xl shadow-luxury-xl border border-gray-100 overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-blush to-rose" />
                            <div className="p-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush to-rose
                                               flex items-center justify-center text-white text-xl shadow-luxury mb-6"
                                >
                                    <FontAwesomeIcon icon={faKey} />
                                </motion.div>

                                <p className="text-xs font-semibold tracking-widest uppercase text-rose mb-1">
                                    Verification
                                </p>
                                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
                                    Enter OTP
                                </h2>
                                <p className="text-sm text-gray-500 mb-8">
                                    We sent a code to <span className="font-semibold text-gray-700">{mail}</span>
                                </p>

                                <div className="form-group-luxury">
                                    <label className="form-label-luxury">One-Time Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            <FontAwesomeIcon icon={faKey} />
                                        </span>
                                        <input
                                            type="text"
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter the OTP"
                                            className="input-luxury pl-11 text-center tracking-[0.3em] font-bold text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-6">
                                    <HoverButton
                                        onClick={proceed}
                                        className="w-full py-3 rounded-full font-outfit font-bold text-sm text-white
                                                   bg-gradient-to-r from-emerald-400 to-emerald-600 border-none cursor-pointer
                                                   shadow-luxury flex items-center justify-center gap-2"
                                    >
                                        Verify & Proceed
                                    </HoverButton>
                                    <div className="flex gap-3">
                                        <HoverButton
                                            onClick={sendOtp}
                                            disabled={timer > 0}
                                            className="flex-1 py-2.5 rounded-full font-outfit font-semibold text-sm
                                                       bg-white border border-gray-200 cursor-pointer
                                                       flex items-center justify-center gap-2 transition-all duration-200
                                                       disabled:opacity-50 disabled:cursor-not-allowed
                                                       hover:border-blush hover:text-rose text-gray-600"
                                        >
                                            <FontAwesomeIcon icon={timer > 0 ? faClock : faRefresh} />
                                            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                        </HoverButton>
                                        <HoverButton
                                            onClick={() => navigate(-1)}
                                            className="flex-1 py-2.5 rounded-full font-outfit font-semibold text-sm text-gray-600
                                                       bg-white border border-gray-200 cursor-pointer
                                                       flex items-center justify-center gap-2
                                                       hover:border-rose hover:text-rose transition-all duration-200"
                                        >
                                            <FontAwesomeIcon icon={faBan} /> Cancel
                                        </HoverButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScaleIn>
                )}
            </AnimatePresence>
        </div>
    );
};
