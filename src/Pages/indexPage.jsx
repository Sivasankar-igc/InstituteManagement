import { useNavigate } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faBrain, faBuilding, faGraduationCap,
    faChartLine, faShieldHalved, faStar
} from "@fortawesome/free-solid-svg-icons";
import { StaggerContainer, StaggerItem, SlideInLeft, SlideInRight, HoverCard, HoverButton } from "../Components/Others/AnimatedPage";

// Animated counter component
const Counter = ({ target, suffix = "", prefix = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, target, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return controls.stop;
    }, [inView, target]);

    return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
};

const IndexPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: faBuilding,
            img: "/admin.jpg",
            title: "Efficient Admin Tools",
            desc: "Centralized management of departments, accounts, and announcements — all from one elegant dashboard.",
            color: "from-blush/20 to-peach/30"
        },
        {
            icon: faBrain,
            img: "/ai.jpg",
            title: "AI-Powered Faculty Features",
            desc: "Create exams, assignments, and reports seamlessly with intelligent AI support that saves hours of work.",
            color: "from-violet-100 to-purple-50"
        },
        {
            icon: faGraduationCap,
            img: "/student.jpg",
            title: "Empowered Students",
            desc: "Access assignments, attend exams, and stay updated on announcements — all in a clean, intuitive portal.",
            color: "from-sky-100 to-blue-50"
        },
    ];

    const steps = [
        { n: "01", title: "Create Your Institute", desc: "Set up your institute account and configure departments, batches, and administrative roles in minutes." },
        { n: "02", title: "Onboard Your Team", desc: "Admins, faculty, and students access their personalized dashboards with role-based permissions." },
        { n: "03", title: "Manage & Grow", desc: "Faculty create assignments and exams while students complete and submit them — all tracked in real-time." },
    ];

    const testimonials = [
        { quote: "Insti360 has revolutionized how we handle institute operations. The tools are intuitive and save us so much time every single day!", author: "Dr. Kavita Rao", role: "Principal" },
        { quote: "The AI-powered exam creation is a standout feature. Our faculty and students absolutely love the seamless experience it provides.", author: "Mr. Ramesh Nair", role: "Head of Department" },
        { quote: "Having all my assignments, exams, and announcements in one place has made my academic life so much more organized.", author: "Priya Kapoor", role: "Final Year Student" },
    ];

    return (
        <div className="overflow-x-hidden">

            {/* ── Hero ── */}
            <section className="relative min-h-[90vh] flex items-center justify-between gap-12 px-8 md:px-16 py-20
                                bg-gradient-to-br from-peach via-cream to-blush-light overflow-hidden">
                {/* Background orbs */}
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                                bg-gradient-radial from-blush/25 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full
                                bg-gradient-radial from-nude/20 to-transparent pointer-events-none" />

                <SlideInLeft className="flex-1 max-w-[580px] relative z-10" delay={0.1}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase
                                   text-rose bg-white/70 backdrop-blur-sm border border-blush/40
                                   px-4 py-2 rounded-full mb-6 shadow-luxury-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
                        Trusted by 500+ Institutions
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-[1.1] tracking-tight mb-6">
                        The Future of{" "}
                        <span className="bg-gradient-to-r from-blush to-rose bg-clip-text text-transparent">
                            Institute
                        </span>{" "}
                        Management
                    </h1>

                    <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-[480px]">
                        Streamline your institution's operations with elegant tools for
                        administrators, faculty, and students — all in one beautifully designed platform.
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                        <HoverButton
                            onClick={() => navigate("/login/Institute")}
                            className="btn-primary btn-lg gap-2 btn-cta-shine animate-pulse-glow"
                        >
                            Get Started Free <FontAwesomeIcon icon={faArrowRight} />
                        </HoverButton>
                        <HoverButton
                            onClick={() => navigate("/about")}
                            className="btn-secondary btn-lg"
                        >
                            Learn More
                        </HoverButton>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-10 mt-10 pt-8 border-t border-gray-200/60">
                        {[
                            { target: 500, suffix: "+", label: "Institutions" },
                            { target: 50000, suffix: "+", label: "Students" },
                            { target: 99, suffix: ".9%", label: "Uptime" },
                        ].map(({ target, suffix, label }) => (
                            <div key={label} className="flex flex-col">
                                <span className="font-outfit text-3xl font-extrabold text-rose leading-none">
                                    <Counter target={target} suffix={suffix} />
                                </span>
                                <span className="text-xs text-gray-500 mt-1 tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>
                </SlideInLeft>

                <SlideInRight className="flex-1 max-w-[520px] relative z-10 hidden md:block" delay={0.2}>
                    <div className="relative rounded-3xl overflow-hidden shadow-luxury-xl">
                        <img src="/heroSection.webp" alt="Institute Management" className="w-full h-auto block" />
                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-xl border border-white/60
                                       rounded-2xl px-4 py-3 flex items-center gap-3 shadow-luxury"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush to-rose
                                            flex items-center justify-center text-white text-base">
                                <FontAwesomeIcon icon={faBrain} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 leading-none">AI-Powered</p>
                                <p className="text-xs text-gray-500 mt-0.5">Exam Generation</p>
                            </div>
                        </motion.div>
                    </div>
                </SlideInRight>
            </section>

            {/* ── Features ── */}
            <section className="py-24 px-8 md:px-16 bg-white">
                <div className="text-center mb-14">
                    <span className="section-label">Why Insti360?</span>
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
                        Everything Your Institution Needs
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
                        A complete ecosystem designed to simplify administration, empower faculty,
                        and elevate the student experience.
                    </p>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map(({ icon, img, title, desc, color }) => (
                        <StaggerItem key={title}>
                            <HoverCard className="card-luxury p-0 cursor-default">
                                <div className={`h-2 bg-gradient-to-r from-blush to-rose`} />
                                <div className="p-7">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color}
                                                    flex items-center justify-center text-rose text-xl mb-5
                                                    transition-all duration-300`}>
                                        <FontAwesomeIcon icon={icon} />
                                    </div>
                                    <img src={img} alt={title}
                                         className="w-full h-40 object-cover rounded-xl mb-5" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 px-8 md:px-16 bg-gradient-to-br from-peach via-cream to-blush-light/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-blush/10" />
                </div>
                <div className="text-center mb-14 relative z-10">
                    <span className="section-label">Simple Process</span>
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
                        How Insti360 Works
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        Get your institution up and running in minutes with our streamlined onboarding.
                    </p>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
                    {steps.map(({ n, title, desc }) => (
                        <StaggerItem key={n}>
                            <HoverCard className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-luxury-sm cursor-default">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blush to-rose
                                                text-white font-outfit text-xl font-extrabold
                                                flex items-center justify-center mx-auto mb-5 shadow-glow">
                                    {n}
                                </div>
                                <h3 className="text-base font-bold text-gray-800 mb-3">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-24 px-8 md:px-16 bg-white">
                <div className="text-center mb-14">
                    <span className="section-label">Testimonials</span>
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        Trusted by educators and students across the country.
                    </p>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map(({ quote, author, role }) => (
                        <StaggerItem key={author}>
                            <HoverCard className="bg-gray-50 rounded-3xl border border-gray-100 p-8 relative cursor-default">
                                <div className="absolute top-4 left-6 text-6xl font-serif text-blush-light/70 leading-none select-none">
                                    "
                                </div>
                                <div className="flex gap-1 mb-4 mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-xs" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed italic mb-5">{quote}</p>
                                <div>
                                    <p className="text-sm font-bold text-rose">— {author}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{role}</p>
                                </div>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-8 md:px-16 bg-gradient-to-br from-blush via-rose to-blush-dark
                                text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                     style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Ready to Elevate Your Institution?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
                        Join the growing community of institutes using Insti360 today.
                        No setup fees, no complexity.
                    </p>
                    <HoverButton
                        onClick={() => navigate("/login/Institute")}
                        className="inline-flex items-center gap-2 bg-white text-rose font-outfit font-bold
                                   text-base px-10 py-4 rounded-full shadow-luxury-xl cursor-pointer
                                   border-none transition-all duration-300 btn-cta-shine"
                    >
                        Get Started Now <FontAwesomeIcon icon={faArrowRight} />
                    </HoverButton>
                </motion.div>
            </section>

            {/* ── Mini Footer ── */}
            <footer className="py-5 px-8 bg-gray-800 text-gray-400 text-center text-sm">
                &copy; 2024 Insti360. All rights reserved.
            </footer>
        </div>
    );
};

export default IndexPage;
