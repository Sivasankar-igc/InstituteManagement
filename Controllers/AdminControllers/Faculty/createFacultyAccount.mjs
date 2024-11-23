import departmentCol from "../../../Models/departmentModel.mjs"
import facultyCol from "../../../Models/facultyModel.mjs"
import { generateEncryptedPassword } from "../../../utils/generateEncryptedPassword.mjs"
import { facultyCreationMail } from "../../../utils/generateMail.mjs"
import generatePassword from "../../../utils/generatePassword.mjs"

export default async (req, res) => {
    try {
        const { instituteId, departmentId } = req.query;
        const { firstName, lastName, facultyEmail, designation, facultyId, subjects } = req.body

        if (!firstName || !lastName || !facultyEmail || !designation || !facultyId || subjects.length === 0)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(facultyEmail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(designation.trim()))
            return res.status(200).json({ status: false, message: "Invalid Designation" })

        // CHECK WHEHTER THERE ANY FACULTY EXISTS WITH THE SAME EMAIL ID
        const facultyExists = await facultyCol.findOne({
            "facultyDeptInfo.instituteId": instituteId,
            "facultyDeptInfo.departmentId": departmentId,
            $or: [
                { facultyEmail: facultyEmail },
                { facultyId: facultyId }
            ]
        })

        if (facultyExists)
            return res.status(200).json({ status: false, message: "Faculty exists either with same mail or faculty Id" })

        // Generate a 6-digits password for faculty login credential
        const password = generatePassword();
        
        // Create the faculty instance
        const facultyInfo = new facultyCol({
            facultyName: {
                firstName: firstName.trim(),
                lastName: lastName.trim()
            },
            facultyEmail: facultyEmail.trim(),
            facultyPass: await generateEncryptedPassword(password),
            designation,
            facultyId: facultyId,
            facultyDeptInfo: {
                instituteId,
                departmentId
            },
            subjects
        })

        // Save the data in the faculty collections
        const facultyRes = await facultyInfo.save();

        // Check if the document has been saved or not
        if (!facultyRes)
            return res.status(200).json({ status: false, message: "Faculty Document couldn't be created" })

        const response = await departmentCol.findByIdAndUpdate(departmentId, { $push: { facultyList: { facultyId: facultyRes._id, facultyDeptId: facultyId } } })

        if (response) {
            facultyCreationMail(req.query, facultyRes, password)
            res.status(201).json({
                status: true,
                message: { facultyId: facultyRes._id, facultyDeptId: facultyId }
            })
        } else {
            res.status(200).json({
                status: false,
                message: "Something went wrong"
            })
        }

    } catch (error) {
        console.error(`Server error : faculty account creation error-- > ${error}`)
        res.status(500).send()
    }
}