from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import google.generativeai as genai

from dotenv import load_dotenv

import json
import os
import uvicorn

# =====================================================
# LOAD ENV VARIABLES
# =====================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv("GEMINI_MODEL")

# =====================================================
# GEMINI CONFIGURATION
# =====================================================

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(GEMINI_MODEL)

# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI()

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODELS
# =====================================================

class ExamRequest(BaseModel):

    subject: str

    difficulty: str = "medium"

class ResultRequest(BaseModel):

    subject: str

    questions: list

    answers: list

# =====================================================
# HOME ROUTE
# =====================================================

@app.get("/")
def home():

    return {
        "message": "AI Mock Exam API Running"
    }

# =====================================================
# GENERATE EXAM
# =====================================================

@app.post("/generate-exam")
async def generate_exam(data: ExamRequest):

    try:

        prompt = f"""
        Generate 5 MCQ questions for:

        Subject:
        {data.subject}

        Difficulty Level:
        {data.difficulty}

        Rules:
        - Questions should be technical
        - Questions should be suitable for college students
        - Questions should contain 4 options
        - Provide correct answer
        - Mention topic name
        - Mention difficulty level

        Return ONLY valid JSON.

        Format:
        {{
            "questions": [
                {{
                    "question": "",
                    "options": [
                        "",
                        "",
                        "",
                        ""
                    ],
                    "answer": "",
                    "topic": "",
                    "difficulty": "{data.difficulty}"
                }}
            ]
        }}
        """

        response = model.generate_content(
            prompt
        )

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        exam_json = json.loads(
            cleaned_response
        )

        return exam_json

    except Exception as e:

        return {
            "error": str(e)
        }

# =====================================================
# ANALYZE RESULT
# =====================================================

@app.post("/analyze-result")
async def analyze_result(data: ResultRequest):

    try:

        score = 0

        weak_topics = []

        strong_topics = []

        question_analysis = []

        # =====================================================
        # RESULT ANALYSIS
        # =====================================================

        for i in range(len(data.questions)):

            question = data.questions[i]

            correct_answer = question["answer"]

            user_answer = data.answers[i]

            topic = question["topic"]

            difficulty = question["difficulty"]

            is_correct = (
                correct_answer == user_answer
            )

            if is_correct:

                score += 1

                strong_topics.append(topic)

            else:

                weak_topics.append(topic)

            question_analysis.append({

                "question": question["question"],

                "student_answer": user_answer,

                "correct_answer": correct_answer,

                "topic": topic,

                "difficulty": difficulty,

                "is_correct": is_correct
            })

        # =====================================================
        # PERCENTAGE
        # =====================================================

        percentage = round(
            (score / len(data.questions)) * 100,
            2
        )

        # =====================================================
        # ML-LIKE STUDENT LEVEL
        # =====================================================

        if percentage >= 80:

            student_level = "Advanced"

            recommended_difficulty = "hard"

        elif percentage >= 50:

            student_level = "Intermediate"

            recommended_difficulty = "medium"

        else:

            student_level = "Beginner"

            recommended_difficulty = "easy"

        # =====================================================
        # GEMINI FEEDBACK PROMPT
        # =====================================================

        feedback_prompt = f"""
        Student Performance Analysis

        Subject:
        {data.subject}

        Score:
        {percentage}%

        Student Level:
        {student_level}

        Weak Topics:
        {weak_topics}

        Strong Topics:
        {strong_topics}

        Generate:

        1. Personalized feedback
        2. Study plan
        3. Improvement suggestions
        4. YouTube learning resources
        5. Documentation/resources
        6. Interview preparation advice

        Return ONLY valid JSON.

        Format:
        {{
            "feedback": [],
            "study_plan": [],
            "improvement_suggestions": [],

            "youtube_resources": [
                {{
                    "title": "",
                    "url": ""
                }}
            ],

            "documentation_resources": [
                {{
                    "title": "",
                    "url": ""
                }}
            ],

            "interview_tips": []
        }}
        """

        response = model.generate_content(
            feedback_prompt
        )

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        ai_feedback = json.loads(
            cleaned_response
        )

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return {

            "score": score,

            "percentage": percentage,

            "student_level": student_level,

            "recommended_difficulty":
                recommended_difficulty,

            "weak_topics":
                list(set(weak_topics)),

            "strong_topics":
                list(set(strong_topics)),

            "question_analysis":
                question_analysis,

            "ai_feedback":
                ai_feedback
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":

    uvicorn.run(
        "mockExam:app",
        host="0.0.0.0",
        port=1000,
        reload=True
    )