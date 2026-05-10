import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaperPlane, faSpinner, faRobot, faUser,
    faChevronDown, faLightbulb, faRoad, faCode,
    faCertificate, faComments, faBook, faGraduationCap, faVideo
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { HoverButton } from "../Others/AnimatedPage";

const SectionCard = ({ icon, title, items, isLink = false }) => {
    if (!items?.length) return null;
    return (
        <div className="bg-white/60 rounded-xl border border-white/80 p-4 mb-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className="text-rose" />
                {title}
            </h4>
            <div className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                    isLink ? (
                        <a key={i} href={item.url} target="_blank" rel="noreferrer"
                           className="text-xs text-sky-600 hover:text-sky-800 hover:underline transition-colors">
                            {item.title} {item.platform && <span className="text-gray-400">({item.platform})</span>}
                        </a>
                    ) : (
                        <p key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-rose mt-0.5 flex-shrink-0">•</span>
                            {item}
                        </p>
                    )
                ))}
            </div>
        </div>
    );
};

const BotMessage = ({ data }) => (
    <div className="space-y-3">
        {/* Career Recommendation */}
        <div className="bg-gradient-to-br from-blush/20 to-peach/30 rounded-2xl p-5 border border-blush/30">
            <p className="text-xs font-bold tracking-widest uppercase text-rose mb-1">Recommended Career</p>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">{data.selected_best_career}</h3>
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blush to-rose rounded-full transition-all duration-1000"
                        style={{ width: `${data.career_match_percentage}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-rose">{data.career_match_percentage}%</span>
            </div>
        </div>

        {/* Career Paths */}
        {data.best_career_paths?.length > 0 && (
            <div>
                <p className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-2">Other Suitable Paths</p>
                <div className="flex flex-wrap gap-2">
                    {data.best_career_paths.map((career, i) => (
                        <span key={i} className="badge badge-primary text-xs">{career}</span>
                    ))}
                </div>
            </div>
        )}

        <SectionCard icon={faLightbulb}    title="Missing Skills"        items={data.missing_skills} />
        <SectionCard icon={faRoad}         title="Roadmap"               items={data.ai_generated_roadmap?.roadmap} />
        <SectionCard icon={faCode}         title="Recommended Projects"  items={data.ai_generated_roadmap?.projects} />
        <SectionCard icon={faCertificate}  title="Certifications"        items={data.ai_generated_roadmap?.certifications} />
        <SectionCard icon={faComments}     title="Interview Tips"        items={data.ai_generated_roadmap?.interview_tips} />
        <SectionCard icon={faComments}     title="Career Advice"         items={data.ai_generated_roadmap?.career_advice} />
        <SectionCard icon={faYoutube}      title="YouTube Resources"     items={data.ai_generated_roadmap?.youtube_resources} isLink />
        <SectionCard icon={faBook}         title="Documentation"         items={data.ai_generated_roadmap?.documentation_resources} isLink />
        <SectionCard icon={faGraduationCap} title="Online Courses"       items={data.ai_generated_roadmap?.online_courses} isLink />
    </div>
);

const CareerBot = () => {
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!skills.trim()) return;
        const userMsg = { sender: "user", text: skills };
        setMessages(prev => [...prev, userMsg]);
        setSkills("");
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:2000/career-guidance", { skills });
            setMessages(prev => [...prev, { sender: "bot", data: response.data }]);
        } catch {
            setMessages(prev => [...prev, { sender: "error", text: "Failed to connect to AI service." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm p-5 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600
                                flex items-center justify-center text-white text-xl shadow-luxury flex-shrink-0">
                    <FontAwesomeIcon icon={faRobot} />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">AI Career Guidance</h2>
                    <p className="text-xs text-gray-500">Enter your skills to get personalized career recommendations</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-gray-400">Online</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-400 text-2xl mb-4">
                            <FontAwesomeIcon icon={faRobot} />
                        </div>
                        <p className="text-gray-400 font-medium">Start by entering your skills below</p>
                        <p className="text-gray-300 text-sm mt-1">e.g. "Python, Machine Learning, Data Analysis"</p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.sender !== "user" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600
                                                flex items-center justify-center text-white text-xs flex-shrink-0 mt-1">
                                    <FontAwesomeIcon icon={faRobot} />
                                </div>
                            )}
                            <div className={`max-w-[85%] ${msg.sender === "user"
                                ? "bg-gradient-to-br from-blush to-rose text-white rounded-2xl rounded-tr-sm px-4 py-3"
                                : msg.sender === "error"
                                    ? "bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-4 py-3 text-red-600 text-sm"
                                    : "bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-luxury-sm w-full"
                            }`}>
                                {msg.sender === "user" && <p className="text-sm">{msg.text}</p>}
                                {msg.sender === "bot" && <BotMessage data={msg.data} />}
                                {msg.sender === "error" && <p className="text-sm">{msg.text}</p>}
                            </div>
                            {msg.sender === "user" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-rose
                                                flex items-center justify-center text-white text-xs flex-shrink-0 mt-1">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600
                                        flex items-center justify-center text-white text-xs flex-shrink-0">
                            <FontAwesomeIcon icon={faRobot} />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-luxury-sm">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <FontAwesomeIcon icon={faSpinner} spin />
                                <span>AI is thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm p-3 flex gap-3 items-end">
                <input
                    type="text"
                    placeholder="Enter your skills (e.g. Python, React, Machine Learning)..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="input-luxury flex-1 py-3 text-sm"
                />
                <HoverButton
                    onClick={handleSend}
                    disabled={loading || !skills.trim()}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white
                               border-none cursor-pointer flex items-center justify-center
                               shadow-luxury transition-all duration-300 flex-shrink-0
                               disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} spin={loading} />
                </HoverButton>
            </div>
        </div>
    );
};

export default CareerBot;
