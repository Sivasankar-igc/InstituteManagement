import jwt from "jsonwebtoken";
import adminCol from "../../../Models/adminModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs"
import bcryptjs from "bcryptjs";
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const login = async (req, res) => {
    try {
        const { loginInfos, instituteInfos, confidential } = req.body;

        if (!loginInfos || !instituteInfos)
            return res.status(400).json({
                status: false,
                message: "Bad Request"
            })

        const { id: adminEmail, password } = loginInfos;

        if (!adminEmail || !password)
            return res.status(200).json({
                status: false,
                message: "All reuired fields must be filled"
            })

        const admin = await adminCol.findOne({ adminEmail: adminEmail })

        if (!admin)
            return res.status(200).json({
                status: false,
                message: "Admin Not Found."
            })

        const passwordCorrect = bcryptjs.compareSync(password, admin.adminPass)

        if (!passwordCorrect)
            return res.status(200).json({
                status: false,
                message: "Wrong Login Credentials."
            })

        // Check whether the admin is the superadmin or not
        if (adminEmail === instituteInfos.superAdminMail) {

            const token = jwt.sign({ instituteId: instituteInfos._id, userId: admin._id, confidential, userType: "superAdmin" }, JWT_SECRET_KEY)
            res.cookie("multiapp", token, {
                httpOnly: true,
                maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
            })

            return res.status(200).json({
                status: true,
                message: { admin, departmentInfo: null, isSuperAdmin: true }
            })
        }
        else {
            // if the admin is not the super admin then give only the corresponding department access
            const departmentInfo = await departmentCol.findById(admin.departmentId)

            const token = jwt.sign({ instituteId: instituteInfos._id, userId: admin._id, confidential, userType: "deptAdmin" }, JWT_SECRET_KEY)
            res.cookie("multiapp", token, {
                httpOnly: true,
                maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
            })

            return res.status(200).json({
                status: true,
                message: { admin, departmentInfo, isSuperAdmin: false }
            })
        }
    } catch (error) {
        console.error(`Server error : Login error -->${error}`)
        res.status(500).send()
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("multiapp")
        res.status(200).send(true)
    } catch (error) {
        console.error(`Server error : Logout error -->${error}`)
        res.status(500).send()
    }
}


export const getAdminAccount = async (req, res) => {
    try {
        const token = req.cookies.multiapp;

        if (!token)
            return res.status(200).json({
                status: false,
                message: null
            })

        const verifiedToken = jwt.verify(token, JWT_SECRET_KEY)

        const admin = await adminCol.findById(verifiedToken.tokenId)

        res.status(200).json({
            status: true,
            message: admin
        })

    } catch (error) {
        console.error(`Server error : retrieving user detatils from cookies : ${error}`)
    }
}