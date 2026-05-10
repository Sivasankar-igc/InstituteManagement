import bcryptjs from "bcryptjs";
import adminCol from "../Models/adminModel.mjs";
import instituteCol from "../Models/instituteModel.mjs";
import facultyCol from "../Models/facultyModel.mjs";
import studentCol from "../Models/studentModel.mjs";
import { generateEncryptedPassword } from "../utils/generateEncryptedPassword.mjs";
import { institutePasswordChange } from "../utils/generateMail.mjs";

export default async (req, res) => {
    try {
        const { userType, userId } = req.query;
        const { oldPassword, newPassword } = req.body;

        if (oldPassword.trim() === "")
            return res.status(200).json({ status: false, message: "Please enter old password" })
        else if (newPassword.trim() === "")
            return res.status(200).json({ status: false, message: "Please enter new password" })

        let response = null;
        let user = null;
        let correctPass = false;

        switch (userType) {
            case "admin":
                user = await adminCol.findById(userId)
                if (!user) break;
                correctPass = bcryptjs.compareSync(oldPassword, user.adminPass);
                if (!correctPass) break;
                response = await adminCol.findByIdAndUpdate(userId, { $set: { adminPass: await generateEncryptedPassword(newPassword) } })
                break;
            case "institute":
                user = await instituteCol.findOne({ instituteId: userId })
                if (!user) break;
                correctPass = bcryptjs.compareSync(oldPassword, user.institutePass);
                if (!correctPass) break;
                response = await instituteCol.findOneAndUpdate({ instituteId: userId }, { $set: { institutePass: await generateEncryptedPassword(newPassword) } })
                break;
            case "faculty":
                user = await facultyCol.findById(userId)
                if (!user) break;
                correctPass = bcryptjs.compareSync(oldPassword, user.facultyPass);
                if (!correctPass) break;
                response = await facultyCol.findByIdAndUpdate(userId, { $set: { facultyPass: await generateEncryptedPassword(newPassword) } })
                break;
            case "student":
                user = await studentCol.findById(userId)
                if (!user) break;
                correctPass = bcryptjs.compareSync(oldPassword, user.studentPass);
                if (!correctPass) break;
                response = await studentCol.findByIdAndUpdate(userId, { $set: { studentPass: await generateEncryptedPassword(newPassword) } })
                break;
            case "admin_mail":
                user = await adminCol.findOne({ adminEmail: userId })
                if (!user) return
                response = await adminCol.findOneAndUpdate({ adminEmail: userId }, { $set: await generateEncryptedPassword(newPassword) })
            case "faculty_mail":
                user = await facultyCol.findOne({ facultyEmail: userId })
                if (!user) return
                response = await facultyCol.findOneAndUpdate({ facultyEmail: userId }, { $set: { facultyPass: await generateEncryptedPassword(newPassword) } })
            case "student_mail":
                user = await studentCol.findOne({ studentEmail: userId })
                if (!user) return
                response = await studentCol.findOneAndUpdate({ studentEmail: userId }, { $set: { studentPass: await generateEncryptedPassword(newPassword) } })
        }

        if (!user) return res.status(400).send("User Not Found")
        if (!correctPass) return res.status(200).json({ status: false, message: "Wrong Credential" })

        // If the user type is institute then send a mail to all the admins, students and faculties regarding the password change
        if (userType === "institute") {
            const institute = await instituteCol.findOne({ instituteId: userId })

            const admins = await adminCol.find({ instituteId: userId })
            const faculties = await facultyCol.find({ "facultyDeptInfo.instituteId": userId })
            const students = await studentCol.find({ "studentDeptInfo.instituteId": userId })

            if (institute) {
                admins.forEach(admin => {
                    institutePasswordChange(institute, admin.adminEmail, admin.adminFirstName, newPassword)
                });
                faculties.forEach(faculty => {
                    institutePasswordChange(institute, faculty.facultyEmail, faculty.facultyName.firstName, newPassword)
                });
                students.forEach(student => {
                    institutePasswordChange(institute, student.studentEmail, student.studentName.firstName, newPassword)
                });
            }
        }

        return res.status(200).json({
            status: response !== null,
            message: response ? "Password Changed Successfully" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Changing Password --> ${error}`)
        res.status(500).send()
    }
}