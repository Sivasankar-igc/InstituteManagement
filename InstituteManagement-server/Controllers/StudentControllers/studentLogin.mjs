import departmentCol from "../../Models/departmentModel.mjs";
import studentCol from "../../Models/studentModel.mjs";
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export default async (req, res) => {
    try {
        const { loginInfos, instituteInfos } = req.body;

        if (!loginInfos || !instituteInfos)
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            })

        const { id: studentId, password } = loginInfos;

        if (!studentId || !password)
            return res.status(200).json({
                status: false,
                message: "All reuired fields must be filled"
            })

        // Find the student by his/her student id
        const student = await studentCol.findOne({ studentId: studentId, "studentDeptInfo.instituteId": instituteInfos.instituteId })

        if (!student)
            return res.status(200).json({
                status: false,
                message: "Student doesn't exist"
            })

        const correctPassword = bcryptjs.compareSync(password, student.studentPass);

        if (!correctPassword)
            return res.status(200).json({
                status: false, message: "Wrong Credentials"
            })

        // Find the corresponding department and batch
        const batch = await departmentCol.findOne(
            {
                _id: student.studentDeptInfo.departmentId,
                "batches.batchName": student.studentDeptInfo.batchName
            },
            {
                "batches": {
                    $elemMatch: { batchName: student.studentDeptInfo.batchName }
                }
            }
        )

        const department = await departmentCol.findById(student.studentDeptInfo.departmentId)

        // JWT TOKEN GENERATION

        const token = jwt.sign({ instituteId: instituteInfos._id, userId: student._id, userType: "student" }, JWT_SECRET)
        res.cookie("multiapp", token, {
            httpOnly: true,
            maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
        })

        res.status(200).json({
            status: true,
            message: { student, batch: batch.batches[0], department }
        })
        
    } catch (error) {
        console.error(`Server error : student login --> ${error}`)
        res.status(500).send()
    }
}