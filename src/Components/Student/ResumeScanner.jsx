import { useState } from "react"
import axios from "axios"

const ResumeScanner = () => {

    const [file, setFile] = useState(null)

    const [loading, setLoading] = useState(false)

    const [result, setResult] = useState(null)

    const handleUpload = async () => {

        if (!file) return

        try {

            setLoading(true)

            const formData = new FormData()

            formData.append("resume", file)

            const response = await axios.post(
                "http://localhost:5000/analyze-resume",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            setResult(response.data)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    return (
        <section className="resume-scanner-container">

            <h1>Resume Scanner</h1>

            <div className="resume-upload-box">

                <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button onClick={handleUpload}>

                    {
                        loading
                            ? "Analyzing..."
                            : "Upload Resume"
                    }

                </button>

            </div>

            {
                result && (

                    <div className="resume-result-container">

                        <div className="ats-card">

                            <h2>ATS Score</h2>

                            <div className="ats-score">

                                {result.ats_score}

                            </div>

                        </div>

                        <div className="analysis-grid">

                            <div className="analysis-card">

                                <h3>Missing Skills</h3>

                                {
                                    result.missing_skills?.map(
                                        (skill, index) => (
                                            <p key={index}>
                                                • {skill}
                                            </p>
                                        )
                                    )
                                }

                            </div>

                            <div className="analysis-card">

                                <h3>Strengths</h3>

                                {
                                    result.strengths?.map(
                                        (item, index) => (
                                            <p key={index}>
                                                • {item}
                                            </p>
                                        )
                                    )
                                }

                            </div>

                            <div className="analysis-card">

                                <h3>Weaknesses</h3>

                                {
                                    result.weaknesses?.map(
                                        (item, index) => (
                                            <p key={index}>
                                                • {item}
                                            </p>
                                        )
                                    )
                                }

                            </div>

                            <div className="analysis-card">

                                <h3>Suggestions</h3>

                                {
                                    result.suggestions?.map(
                                        (item, index) => (
                                            <p key={index}>
                                                • {item}
                                            </p>
                                        )
                                    )
                                }

                            </div>

                        </div>

                    </div>
                )
            }

        </section>
    )
}

export default ResumeScanner