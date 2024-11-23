import departmentCol from "../../Models/departmentModel.mjs";
import bcryptjs from "bcryptjs"
import facultyCol from "../../Models/facultyModel.mjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET_KEY

export default async (req, res) => {
    try {
        const { loginInfos, instituteInfos } = req.body;

        if (!loginInfos || !instituteInfos)
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            })

        const { id: facultyId, password } = loginInfos;

        if (!facultyId || !password)
            return res.status(200).json({
                status: false,
                message: "All reuired fields must be filled"
            })

        // Find the faculty by his/her faculty id
        const faculty = await facultyCol.findOne({ facultyId: facultyId, "facultyDeptInfo.instituteId": instituteInfos.instituteId })

        if (!faculty)
            return res.status(200).json({
                status: false,
                message: "Faculty doesn't exist"
            })

        const correctPassword = bcryptjs.compareSync(password, faculty.facultyPass);

        if (!correctPassword)
            return res.status(200).json({
                status: false, message: "Wrong Credentials"
            })

        // Find the corresponding department and batch
        const department = await departmentCol.findOne({ _id: faculty.facultyDeptInfo.departmentId })

        const token = jwt.sign({ instituteId: instituteInfos._id, userId: faculty._id, userType: "faculty" }, JWT_SECRET)
        res.cookie("multiapp", token, {
            httpOnly: true,
            maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
        })

        res.status(200).json({
            status: true,
            message: { faculty, department }
        })
    } catch (error) {
        console.error(`Server error : faculty login --> ${error}`)
        res.status(500).send()
    }
}