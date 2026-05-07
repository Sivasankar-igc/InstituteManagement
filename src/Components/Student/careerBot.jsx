import { useState } from "react"
import axios from "axios"

const CareerBot = () => {

    const [skills, setSkills] = useState("")

    const [loading, setLoading] = useState(false)

    const [messages, setMessages] = useState([])

    const handleSend = async () => {

        if (!skills.trim()) return

        const userMessage = {
            sender: "user",
            text: skills
        }

        setMessages(prev => [...prev, userMessage])

        try {

            setLoading(true)

            const response = await axios.post(
                "http://127.0.0.1:2000/career-guidance",
                {
                    skills
                }
            )

            const botMessage = {
                sender: "bot",
                data: response.data
            }

            setMessages(prev => [...prev, botMessage])

            setSkills("")

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    return (

        <section className="career-bot-container">

            <div className="chat-header">
                AI Career Guidance Bot
            </div>

            <div className="chat-messages">

                {
                    messages.map((msg, index) => (

                        <div
                            key={index}
                            className={
                                msg.sender === "user"
                                    ? "user-message"
                                    : "bot-message"
                            }
                        >

                            {
                                msg.sender === "user"

                                    ? (
                                        <p>{msg.text}</p>
                                    )

                                    : (

                                        <div>

                                            <div className="recommended-card">

                                                <h2>
                                                    Recommended Career
                                                </h2>

                                                <h1>
                                                    {
                                                        msg.data.selected_best_career
                                                    }
                                                </h1>

                                                <div className="match-score">

                                                    Match Score:
                                                    {
                                                        msg.data.career_match_percentage
                                                    }%

                                                </div>

                                            </div>

                                            <h3>
                                                Other Suitable Career Paths
                                            </h3>

                                            <div className="career-paths">

                                                {
                                                    msg.data.best_career_paths?.map(
                                                        (career, i) => (

                                                            <span
                                                                key={i}
                                                                className="career-badge"
                                                            >
                                                                {career}
                                                            </span>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Missing Skills
                                                </h3>

                                                {
                                                    msg.data.missing_skills?.map(
                                                        (skill, i) => (
                                                            <p key={i}>
                                                                • {skill}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Roadmap
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.roadmap?.map(
                                                        (step, i) => (
                                                            <p key={i}>
                                                                • {step}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Recommended Projects
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.projects?.map(
                                                        (project, i) => (
                                                            <p key={i}>
                                                                • {project}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Certifications
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.certifications?.map(
                                                        (cert, i) => (
                                                            <p key={i}>
                                                                • {cert}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Interview Tips
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.interview_tips?.map(
                                                        (tip, i) => (
                                                            <p key={i}>
                                                                • {tip}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Career Advice
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.career_advice?.map(
                                                        (tip, i) => (
                                                            <p key={i}>
                                                                • {tip}
                                                            </p>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Recommended YouTube Videos
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.youtube_resources?.map(
                                                        (video, i) => (

                                                            <a
                                                                key={i}
                                                                href={video.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="resource-link"
                                                            >
                                                                🎥 {video.title}
                                                            </a>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Documentation & Resources
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.documentation_resources?.map(
                                                        (doc, i) => (

                                                            <a
                                                                key={i}
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="resource-link"
                                                            >
                                                                📘 {doc.title}
                                                            </a>
                                                        )
                                                    )
                                                }

                                            </div>

                                            <div className="section-card">

                                                <h3>
                                                    Recommended Courses
                                                </h3>

                                                {
                                                    msg.data.ai_generated_roadmap?.online_courses?.map(
                                                        (course, i) => (

                                                            <a
                                                                key={i}
                                                                href={course.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="resource-link"
                                                            >
                                                                🎓 {course.title}
                                                                {" "}
                                                                ({course.platform})
                                                            </a>
                                                        )
                                                    )
                                                }

                                            </div>

                                        </div>
                                    )
                            }

                        </div>
                    ))
                }

                {
                    loading && (

                        <div className="bot-message">
                            AI is thinking...
                        </div>
                    )
                }

            </div>

            <div className="chat-input-section">

                <input
                    type="text"
                    placeholder="Enter your skills..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />

                <button onClick={handleSend}>
                    Send
                </button>

            </div>

        </section>
    )
}

export default CareerBot