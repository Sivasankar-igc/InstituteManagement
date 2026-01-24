import express from "express";
import studentPunchIn from "../../Controllers/studentPunchIn.mjs";
import studentPunchOut from "../../Controllers/studentPunchOut.mjs";

const router = express.Router()

router.post("/punchIn", studentPunchIn)
router.post("/punchOut", studentPunchOut)

export { router }