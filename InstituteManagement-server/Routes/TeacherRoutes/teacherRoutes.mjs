import { Router } from "express";
import sendOtp from "../../Controllers/sendOtp.mjs";
import { createQuestions, modifyExam } from "../../Controllers/TeacherControllers/prepareQuestion.mjs";
import { createAssignment, modifyAssignment, removeAssignment } from "../../Controllers/TeacherControllers/prepareAssignments.mjs";
import teacherLogin from "../../Controllers/TeacherControllers/teacherLogin.mjs";
import getAssignments from "../../Controllers/getAssignments.mjs";
import getExams from "../../Controllers/getExams.mjs";
import AI_Response from "../../Gemini_AI/AI_Response.mjs";

const router = Router()

router.get("/sendOTP", sendOtp)
router.post("/login", teacherLogin)

router.post("/creatQuestionPaper/:deptId", createQuestions)
router.put("/modifyQuestionPaper/:questionPaperId", modifyExam)
router.get("/getExams", getExams)

router.post("/createAssignment", createAssignment)
router.get("/getAssignment", getAssignments)
router.route("/handleAssignment/:assignmentId")
    .patch(modifyAssignment)
    .delete(removeAssignment)

// Generate Questions using AI

router.get("/generateUsingAI", AI_Response)

export { router }