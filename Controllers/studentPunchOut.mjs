import studentCol from "../Models/studentModel.mjs";
import { generateTime } from "../utils/generateTime.mjs";

export default async (req, res) => {
    try {
        const { departmentId, RFIDTagId } = req.body;

        // Find the student by his/her rfid unique id and department_id
        const student = await studentCol.findOne({ studentRFIDUniqueId: RFIDTagId, "studentDeptInfo.departmentId": departmentId })

        if (!student)
            return res.status(200).json({
                status: false,
                message: "Student doesn't exist"
            })

        if (student.punchStatus === "OUT")
            return res.status(200).json({
                status: false,
                message: "Already Punched Out"
            })

        const exitTime = generateTime();

        // Insert an object with entryTime and date to the student collection
        const response = await studentCol.findOneAndUpdate(
            { _id: student._id, "studentActivity.exitTime": "NA" },
            {
                $set: {
                    "studentActivity.$.exitTime": exitTime,
                    punchStatus: "OUT"
                }
            },
            { new: true }
        );

        // Send the student info if the punch in got successful 
        res.status(201).json({
            status: response !== null && response !== undefined,
            message: {
                studentName: student.studentName.firstName,
                studentId: student.studentId,
                exitTime
            }
        })

    } catch (error) {
        console.error(`Server error : Punch Out Error --> ${error}`)
        res.status(500).send()
    }
}