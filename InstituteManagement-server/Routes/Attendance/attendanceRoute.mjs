import express from "express"
import { getAttendance, takeAttendance } from "../../Controllers/attendance.mjs"


const router = express.Router()

router.get("/getAttendanceInfo/:instituteId/:departmentId/:subject/:year/:month", getAttendance)
router.post("/takeAttendance", takeAttendance)

export { router }