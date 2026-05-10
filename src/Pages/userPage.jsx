import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserShield, faChalkboardTeacher, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { StaggerContainer, StaggerItem, HoverCard } from "../Components/Others/AnimatedPage";

const roles = [
    {
        icon: faUserShield,
        img: "/adminIcon.png",
        title: "Admin",
        desc: "Manage departments, faculty, students, and institute-wide announcements",
        to: "/login/Admin",
        gradient: "from-violet-400 to-violet-600",
        bg: "from-violet-50 to-purple-50",
        badge: "Administrator"
    },
    {
        icon: faChalkboardTeacher,
        img: "/teacherIcon.png",
        title: "Faculty",
        desc: "Create assignments, generate AI-powered exams, and track student progress",
        to: "/login/Faculty",
        gradient: "from-sky-400 to-sky-600",
        bg: "from-sky-50 to-blue-50",
        badge: "Educator"
    },
    {
        icon: faUserGraduate,
        img: "/studentIcon.png",
        title: "Student",
        desc: "Access assignments, attend exams, and stay updated on announcements",
        to: "/login/Student",
        gradient: "from-blush to-rose",
        bg: "from-peach to-blush-light/50",
        badge: "Learner"
    },
];

const UserPage = () => {
    return (
        <div className="min-h-[85vh] bg-gradient-to-br from-peach via-cream to-blush-light/60
                        flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
            {/* Background orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[700px] rounded-full bg-blush/10" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 relative z-10"
            >
                <span className="section-label">Welcome Back</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-3">
                    Choose Your Role
                </h1>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                    Select your role to access your personalized dashboard
                </p>
            </motion.div>

            {/* Role Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full relative z-10">
                {roles.map(({ icon, img, title, desc, to, gradient, bg, badge }) => (
                    <StaggerItem key={title}>
                        <HoverCard className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden cursor-default">
                            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                            <div className="p-8 flex flex-col items-center text-center gap-4">
                                {/* Icon wrapper */}
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bg}
                                                flex items-center justify-center transition-all duration-300`}>
                                    <img src={img} alt={title} className="w-12 h-12 object-contain" />
                                </div>

                                {/* Badge */}
                                <span className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full
                                                  bg-gradient-to-r ${gradient} text-white`}>
                                    {badge}
                                </span>

                                <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>

                                <NavLink
                                    to={to}
                                    className={`w-full mt-2 py-3 rounded-full font-outfit font-bold text-sm text-white
                                               bg-gradient-to-r ${gradient} no-underline
                                               flex items-center justify-center gap-2
                                               shadow-luxury transition-all duration-300
                                               hover:-translate-y-0.5 hover:shadow-luxury-lg`}
                                >
                                    Login as {title} <FontAwesomeIcon icon={faArrowRight} />
                                </NavLink>
                            </div>
                        </HoverCard>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </div>
    );
};

export default UserPage;
