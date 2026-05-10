import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSpinner, faMagnifyingGlass, faCloudUploadAlt,
    faCheckCircle, faExclamationTriangle, faLightbulb,
    faShieldAlt, faFileAlt, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { HoverButton } from "../Others/AnimatedPage";

const ScoreRing = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <motion.circle
                    cx="56" cy="56" r={radius}
                    fill="none" stroke={color} strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-extrabold font-outfit"
                    style={{ color }}
                >
                    {score}
                </motion.p>
                <p className="text-xs text-gray-400 font-medium">ATS Score</p>
            </div>
        </div>
    );
};

const ResultSection = ({ icon, title, items, color = "text-gray-600", bgColor = "bg-gray-50" }) => {
    if (!items?.length) return null;
    return (
        <div className={`${bgColor} rounded-2xl border border-gray-100 p-5`}>
            <h4 className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className={color} />
                {title}
            </h4>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className={`${color} mt-0.5 flex-shrink-0`}>•</span>
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
};

const ResumeScanner = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("resume", file);
            const response = await axios.post("http://localhost:5000/analyze-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data);
        } catch {
            // handle error silently
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && (dropped.type === "application/pdf" || dropped.type === "text/plain")) {
            setFile(dropped);
        }
    };

    const scoreLabel = result
        ? result.ats_score >= 70 ? { text: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" }
        : result.ats_score >= 40 ? { text: "Average", color: "text-amber-600", bg: "bg-amber-50" }
        : { text: "Needs Work", color: "text-red-600", bg: "bg-red-50" }
        : null;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600
                                flex items-center justify-center text-white text-xl shadow-luxury flex-shrink-0">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">AI Resume Scanner</h2>
                    <p className="text-xs text-gray-500">Upload your resume to get an ATS score and improvement suggestions</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
                            transition-all duration-300 mb-6
                            ${dragOver
                                ? "border-blush bg-peach/30 scale-[1.01]"
                                : file
                                    ? "border-emerald-300 bg-emerald-50"
                                    : "border-gray-200 bg-gray-50 hover:border-blush hover:bg-peach/20"
                            }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center
                                            text-emerald-600 text-2xl mx-auto mb-3">
                                <FontAwesomeIcon icon={faFileAlt} />
                            </div>
                            <p className="font-bold text-gray-800 text-sm">{file.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                                className="mt-3 text-xs text-red-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center
                                            text-gray-400 text-2xl mx-auto mb-3">
                                <FontAwesomeIcon icon={faCloudUploadAlt} />
                            </div>
                            <p className="font-bold text-gray-700 text-sm">Drop your resume here</p>
                            <p className="text-xs text-gray-400 mt-1">or click to browse — PDF or TXT</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Analyze Button */}
            <HoverButton
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full py-4 rounded-full font-outfit font-bold text-sm text-white
                           bg-gradient-to-r from-sky-400 to-sky-600 border-none cursor-pointer
                           shadow-luxury flex items-center justify-center gap-2 mb-8
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
                <FontAwesomeIcon icon={loading ? faSpinner : faMagnifyingGlass} spin={loading} />
                {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </HoverButton>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-5"
                    >
                        {/* Score Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury p-6 flex items-center gap-6">
                            <ScoreRing score={result.ats_score} />
                            <div>
                                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">ATS Score</p>
                                <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{result.ats_score}</h3>
                                {scoreLabel && (
                                    <span className={`badge ${scoreLabel.bg} ${scoreLabel.color} text-xs font-bold`}>
                                        {scoreLabel.text}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ResultSection
                                icon={faExclamationTriangle}
                                title="Missing Skills"
                                items={result.missing_skills}
                                color="text-amber-500"
                                bgColor="bg-amber-50"
                            />
                            <ResultSection
                                icon={faCheckCircle}
                                title="Strengths"
                                items={result.strengths}
                                color="text-emerald-500"
                                bgColor="bg-emerald-50"
                            />
                            <ResultSection
                                icon={faShieldAlt}
                                title="Weaknesses"
                                items={result.weaknesses}
                                color="text-red-400"
                                bgColor="bg-red-50"
                            />
                            <ResultSection
                                icon={faLightbulb}
                                title="Suggestions"
                                items={result.suggestions}
                                color="text-sky-500"
                                bgColor="bg-sky-50"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeScanner;
