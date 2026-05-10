import { useEffect, useState } from "react"
import axios from "axios"

const MockExamBot = ({subjects}) => {

    const [selectedSubject, setSelectedSubject] = useState("")

    const [questions, setQuestions] = useState([])

    const [answers, setAnswers] = useState([])

    const [result, setResult] = useState(null)

    const [loading, setLoading] = useState(false)

    const [difficulty, setDifficulty] = useState("medium")
    
    const [hasSubmitted, setHasSubmitted] = useState(false) 

    const startExam = async (
        subject,
        examDifficulty = "medium"
    ) => {

        try {

            setLoading(true)

            setResult(null)

            setQuestions([])

            setAnswers([])

            setSelectedSubject(subject)

            setDifficulty(examDifficulty)

            const response = await axios.post(
                "http://127.0.0.1:1000/generate-exam",
                {
                    subject,
                    difficulty: examDifficulty
                }
            )

            setQuestions(response.data.questions)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    const handleAnswer = (index, answer) => {

        const updatedAnswers = [...answers]

        updatedAnswers[index] = answer

        setAnswers(updatedAnswers)
    }

    const submitExam = async () => {

        setHasSubmitted(true)

        try {

            setLoading(true)

            const response = await axios.post(
                "http://127.0.0.1:1000/analyze-result",
                {
                    subject: selectedSubject,
                    questions,
                    answers
                }
            )

            setResult(response.data)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    const reappearExam = () => {

        setHasSubmitted(false)

        let nextDifficulty = "medium"

        if (result.percentage >= 80) {

            nextDifficulty = "hard"

        } else if (result.percentage >= 50) {

            nextDifficulty = "medium"

        } else {

            nextDifficulty = "easy"
        }

        startExam(
            selectedSubject,
            nextDifficulty
        )
    }

    return (

        <section className="mock-exam-container">

            <h1>
                AI Mock Exam Bot
            </h1>

            {
                loading && (

                    <div className="loading-container">

                        <div className="loader"></div>

                        <h2>
                            {hasSubmitted
                            ? "AI is analysing your exam..."
                            : "AI is generating your exam..."}                        
                        </h2>

                        <p>
                            Please wait a few seconds
                        </p>

                    </div>
                )
            }

            {
                !loading &&
                questions.length === 0 && (

                    <div className="subjects-grid">

                        {
                            subjects.map((subject, index) => (

                                <div
                                    key={index}
                                    className="subject-card"
                                    onClick={() =>
                                        startExam(subject)
                                    }
                                >
                                    {subject}
                                </div>
                            ))
                        }

                    </div>
                )
            }

            {
                !loading &&
                questions.length > 0 &&
                !result && (

                    <div>

                        <div className="difficulty-badge">

                            Difficulty:
                            {" "}
                            {difficulty.toUpperCase()}

                        </div>

                        {
                            questions.map((question, index) => (

                                <div
                                    key={index}
                                    className="question-card"
                                >

                                    <h3>
                                        Q{index + 1}.
                                        {" "}
                                        {question.question}
                                    </h3>

                                    {
                                        question.options.map(
                                            (option, i) => (

                                                <button
                                                    key={i}
                                                    className={
                                                        answers[index] === option
                                                            ? "option selected-option"
                                                            : "option"
                                                    }
                                                    onClick={() =>
                                                        handleAnswer(
                                                            index,
                                                            option
                                                        )
                                                    }
                                                >
                                                    {option}
                                                </button>
                                            )
                                        )
                                    }

                                </div>
                            ))
                        }

                        <button
                            className="submit-btn"
                            onClick={submitExam}
                        >
                            Submit Exam
                        </button>

                    </div>
                )
            }

            {
                !loading &&
                result && (

                    <div className="result-card">

                        <div className="score-card">

                            <h1>
                                {result.percentage}%
                            </h1>

                            <h2>
                                Your Score
                            </h2>

                            <p>
                                Level:
                                {" "}
                                {result.student_level}
                            </p>

                        </div>

                        <div className="analysis-section">

                            <h3>
                                Weak Topics
                            </h3>

                            {
                                result.weak_topics?.map(
                                    (topic, index) => (
                                        <p key={index}>
                                            • {topic}
                                        </p>
                                    )
                                )
                            }

                        </div>

                        <div className="analysis-section">

                            <h3>
                                Strong Topics
                            </h3>

                            {
                                result.strong_topics?.map(
                                    (topic, index) => (
                                        <p key={index}>
                                            • {topic}
                                        </p>
                                    )
                                )
                            }

                        </div>

                        <div className="analysis-section">

                            <h3>
                                AI Feedback
                            </h3>

                            {
                                result.ai_feedback?.feedback?.map(
                                    (item, index) => (
                                        <p key={index}>
                                            • {item}
                                        </p>
                                    )
                                )
                            }

                        </div>

                        <div className="analysis-section">

                            <h3>
                                Question Analysis
                            </h3>

                            {
                                questions.map((question, index) => {

                                    const studentAnswer =
                                        answers[index]

                                    const correctAnswer =
                                        question.answer

                                    const isCorrect =
                                        studentAnswer === correctAnswer

                                    return (

                                        <div
                                            key={index}
                                            className="answer-review-card"
                                        >

                                            <h4>
                                                Q{index + 1}.
                                                {" "}
                                                {question.question}
                                            </h4>

                                            <p>

                                                <strong>
                                                    Your Answer:
                                                </strong>

                                                {" "}

                                                <span
                                                    className={
                                                        isCorrect
                                                            ? "correct-answer"
                                                            : "wrong-answer"
                                                    }
                                                >
                                                    {
                                                        studentAnswer
                                                    }
                                                </span>

                                            </p>

                                            <p>

                                                <strong>
                                                    Correct Answer:
                                                </strong>

                                                {" "}

                                                <span className="correct-answer">

                                                    {
                                                        correctAnswer
                                                    }

                                                </span>

                                            </p>

                                            <p>

                                                <strong>
                                                    Topic:
                                                </strong>

                                                {" "}

                                                {question.topic}

                                            </p>

                                            <p>

                                                <strong>
                                                    Difficulty:
                                                </strong>

                                                {" "}

                                                {question.difficulty}

                                            </p>

                                        </div>
                                    )
                                })
                            }

                        </div>

                        <button
                            className="reappear-btn"
                            onClick={reappearExam}
                        >
                            Reappear Adaptive Exam
                        </button>

                    </div>
                )
            }

        </section>
    )
}

export default MockExamBot