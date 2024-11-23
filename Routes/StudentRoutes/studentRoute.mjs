import express from "express"
import sendOtp from "../../Controllers/sendOtp.mjs"
import { removeAssignment, submitAssignment } from "../../Controllers/StudentControllers/handleAssignment.mjs"
import attendExam from "../../Controllers/StudentControllers/attendExam.mjs"
import studentLogin from "../../Controllers/StudentControllers/studentLogin.mjs"
import getAssignments from "../../Controllers/getAssignments.mjs"
import getStudentExams from "../../Controllers/StudentControllers/getStudentExams.mjs"

const router = express.Router()

router.get("/sendOTP", sendOtp)
router.post("/login", studentLogin)

router.get("/getAssignment", getAssignments)
router.get("/getExams", getStudentExams)

router.route("/handleAssignment/:assignmentId")
    .post(submitAssignment)
    .delete(removeAssignment)

router.post("/attendExam/:examId", attendExam)

export { router }