from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import google.generativeai as genai

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from dotenv import load_dotenv

import numpy as np
import json
import re
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
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODEL
# =====================================================

class CareerRequest(BaseModel):
    skills: str

# =====================================================
# CAREER DATASET
# =====================================================

career_data = [
    {
        "career": "Full Stack Developer",
        "skills": "javascript react node mongodb express api jwt docker git"
    },
    {
        "career": "Frontend Developer",
        "skills": "html css javascript react tailwind figma ui ux"
    },
    {
        "career": "Backend Developer",
        "skills": "node express mongodb sql api authentication jwt"
    },
    {
        "career": "Data Analyst",
        "skills": "python sql excel powerbi statistics pandas numpy"
    },
    {
        "career": "AI Engineer",
        "skills": "python machinelearning deeplearning tensorflow pytorch ai"
    },
    {
        "career": "DevOps Engineer",
        "skills": "docker kubernetes aws linux cicd terraform cloud"
    }
]

# =====================================================
# SKILL ALIASES
# =====================================================

skill_aliases = {
    "js": "javascript",
    "ml": "machinelearning",
    "backend": "node",
    "frontend": "react",
    "db": "mongodb",
    "py": "python",
    "cpp": "c++",
    "mern": "mongodb express react node"
}

# =====================================================
# HOME ROUTE
# =====================================================

@app.get("/")
def home():

    return {
        "message": "AI Career Guidance API Running"
    }

# =====================================================
# CAREER GUIDANCE ROUTE
# =====================================================

@app.post("/career-guidance")
async def career_guidance(data: CareerRequest):

    try:

        # =====================================================
        # CLEAN INPUT
        # =====================================================

        student_input = data.skills.lower()

        student_input = student_input.replace(",", " ")

        student_input = re.sub(
            r'[^a-zA-Z0-9+# ]',
            '',
            student_input
        )

        student_skill_list = student_input.split()

        # =====================================================
        # APPLY ALIASES
        # =====================================================

        normalized_skills = []

        for skill in student_skill_list:

            if skill in skill_aliases:

                normalized_skills.extend(
                    skill_aliases[skill].split()
                )

            else:

                normalized_skills.append(skill)

        student_skills = " ".join(normalized_skills)

        # =====================================================
        # TF-IDF
        # =====================================================

        career_skill_texts = [
            item["skills"]
            for item in career_data
        ]

        vectorizer = TfidfVectorizer()

        vectors = vectorizer.fit_transform(
            career_skill_texts + [student_skills]
        )

        # =====================================================
        # COSINE SIMILARITY
        # =====================================================

        similarity_scores = cosine_similarity(
            vectors[-1],
            vectors[:-1]
        )[0]

        # =====================================================
        # TOP CAREERS
        # =====================================================

        top_indices = np.argsort(
            similarity_scores
        )[::-1][:3]

        top_careers = []

        for index in top_indices:

            career = career_data[index]["career"]

            score = round(
                float(similarity_scores[index]) * 100,
                2
            )

            required_skills = career_data[index][
                "skills"
            ].split()

            missing_skills = list(
                set(required_skills)
                - set(normalized_skills)
            )

            top_careers.append({
                "career": career,
                "match_percentage": score,
                "missing_skills": missing_skills
            })

        # =====================================================
        # BEST MATCH
        # =====================================================

        best_match_index = top_indices[0]

        best_score = similarity_scores[
            best_match_index
        ]

        best_career = career_data[
            best_match_index
        ]["career"]

        best_missing_skills = top_careers[0][
            "missing_skills"
        ]

        # =====================================================
        # GEMINI PROMPT
        # =====================================================

        roadmap_prompt = f"""
        Student Skills:
        {student_skills}

        Predicted Career:
        {best_career}

        Missing Skills:
        {', '.join(best_missing_skills)}

        Generate:

        1. Step-by-step roadmap
        2. Recommended projects
        3. Certifications
        4. Interview preparation tips
        5. Career advice
        6. Best YouTube videos
        7. Best documentation/resources
        8. Best online courses

        Return ONLY valid JSON.

        Format:
        {{
            "roadmap": [],
            "projects": [],
            "certifications": [],
            "interview_tips": [],
            "career_advice": [],

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

            "online_courses": [
                {{
                    "title": "",
                    "platform": "",
                    "url": ""
                }}
            ]
        }}
        """

        response = model.generate_content(
            roadmap_prompt
        )

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        ai_response = json.loads(
            cleaned_response
        )

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        final_output = {

            "type": "success",

            "student_skills": normalized_skills,

            "selected_best_career": best_career,

            "career_match_percentage": round(
                float(best_score) * 100,
                2
            ),

            "best_career_paths": [
                career["career"]
                for career in top_careers
            ],

            "top_career_recommendations": top_careers,

            "missing_skills": best_missing_skills,

            "ai_generated_roadmap": ai_response
        }

        return final_output

    except Exception as e:

        return {
            "error": str(e)
        }

# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":

    uvicorn.run(
        "chatbot:app",
        host="0.0.0.0",
        port=2000,
        reload=True
    )