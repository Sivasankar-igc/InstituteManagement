from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import google.generativeai as genai
import uvicorn
import shutil
import os
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv("GEMINI_MODEL")

# =====================================
# GEMINI CONFIGURATION
# =====================================

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(GEMINI_MODEL)

# =====================================
# FASTAPI APP
# =====================================

app = FastAPI()

# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# HOME ROUTE
# =====================================

@app.get("/")
def home():
    return {
        "message": "Resume Analyzer API Running"
    }

# =====================================
# RESUME ANALYZER API
# =====================================

@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...)
):

    try:

        # Create uploads folder
        os.makedirs("uploads", exist_ok=True)

        # Save uploaded file
        file_path = f"uploads/{resume.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        # =====================================
        # EXTRACT TEXT FROM PDF
        # =====================================

        resume_text = ""

        if resume.filename.endswith(".pdf"):

            reader = PdfReader(file_path)

            for page in reader.pages:

                text = page.extract_text()

                if text:
                    resume_text += text

        # =====================================
        # EXTRACT TEXT FROM TXT
        # =====================================

        elif resume.filename.endswith(".txt"):

            with open(
                file_path,
                "r",
                encoding="utf-8",
                errors="ignore"
            ) as file:

                resume_text = file.read()

        else:
            return {
                "error": "Only PDF and TXT files supported"
            }

        # =====================================
        # AI PROMPT
        # =====================================

        prompt = f"""
        Analyze this resume carefully.

        Return ONLY valid JSON.

        Format:

        {{
            "ats_score": "",
            "missing_skills": [],
            "strengths": [],
            "weaknesses": [],
            "suggestions": []
        }}

        Resume:
        {resume_text}
        """

        # =====================================
        # GEMINI RESPONSE
        # =====================================

        response = model.generate_content(prompt)

        # Clean markdown if Gemini returns ```json
        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        # Convert string → JSON
        analysis_json = json.loads(cleaned_response)

        return analysis_json

    except Exception as e:

        return {
            "error": str(e)
        }

# =====================================
# RUN SERVER
# =====================================

if __name__ == "__main__":

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000
    )