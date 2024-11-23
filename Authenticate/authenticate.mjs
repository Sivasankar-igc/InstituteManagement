import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import instituteCol from "../Models/instituteModel.mjs"
import studentCol from "../Models/studentModel.mjs"
import departmentCol from "../Models/departmentModel.mjs"
import facultyCol from "../Models/facultyModel.mjs"
import adminCol from "../Models/adminModel.mjs"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET_KEY

export const checkUserAuthentication = async (req, res) => {
    try {
        const token = req.cookies?.multiapp;

        if (token) {
            const verifiedToken = jwt.verify(token, JWT_SECRET)
            const institute = await instituteCol.findById(verifiedToken.instituteId)
            let department = null;
            let admin = null;

            if (!institute)
                return res.status(404).send("Institute Not Found. Try to login")

            switch (verifiedToken.userType) {
                case "superAdmin":
                    admin = await adminCol.findById(verifiedToken.userId)

                    if (!admin) return res.status(404).send("Admin Account Not Found. Try to login")

                    return res.status(200).json({
                        status: true,
                        message: { institute, admin, department: null, isSuperAdmin: true, userType: "superAdmin" }
                    })

                    break;
                case "deptAdmin":
                    admin = await adminCol.findById(verifiedToken.userId)

                    if (!admin) return res.status(404).send("Admin Account Not Found. Try to login")

                    department = await departmentCol.findById(admin.departmentId)

                    if (!department) return res.status(404).send("Department Account Not Found. Try to login")

                    return res.status(200).json({
                        status: true,
                        message: { institute, admin, department, isSuperAdmin: false, userType: "deptAdmin" }
                    })

                    break;
                case "faculty":
                    const faculty = await facultyCol.findById(verifiedToken.userId)

                    if (!faculty) return res.status(404).send("Faculty Account Not Found. Try to login")

                    department = await departmentCol.findOne({ _id: faculty.facultyDeptInfo.departmentId })

                    if (!department) return res.status(404).send("Department Account Not Found. Try to login")

                    res.status(200).json({
                        status: true,
                        message: { institute, faculty, department, userType: "faculty" }
                    })

                    break;
                case "student":
                    const student = await studentCol.findById(verifiedToken.userId);

                    if (!student) return res.status(404).send("Student Account Not Found. Try to login")

                    department = await departmentCol.findById(student.studentDeptInfo.departmentId)

                    if (!department) return res.status(404).send("Department Account Not Found. Try to login")

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

                    if (!batch) return res.status(404).send("Batch Account Not Found. Try to login")

                    res.status(200).json({
                        status: true,
                        message: { institute, student, batch: batch.batches[0], department, userType: "student" }
                    })

                    break;
                default:
                    return res.status(200).json({ status: false, message: "Login to your account" })
            }
        } else {
            return res.status(200).json({ status: false, message: "Login to your account" })
        }

    } catch (error) {
        console.error(`Server error : authenticating user : ${error}`)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("multiapp")
        res.status(200).send(true)
    } catch (error) {
        console.error(`Server error : logout --> ${error}`)
    }
}