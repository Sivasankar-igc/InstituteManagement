import departmentCol from "../../../Models/departmentModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";
import { generateEncryptedPassword } from "../../../utils/generateEncryptedPassword.mjs";
import { studentCreationMail } from "../../../utils/generateMail.mjs";
import generatePassword from "../../../utils/generatePassword.mjs";

export const createStudentAccount = async (req, res) => {
    try {
        const { instituteId, departmentId, batchName } = req.query;

        const { firstName, lastName, studentEmail, studentId, studentDOB, studentRFIDUniqueId } = req.body;
        if (!firstName || !lastName || !studentEmail || !studentId || !studentDOB || !studentRFIDUniqueId)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(studentEmail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })


        // Check whether any student exists with same email or id in the same institue, department and batch

        const studentExists = await studentCol.findOne({
            "studentDeptInfo.instituteId": instituteId,
            "studentDeptInfo.departmentId": departmentId,
            "studentDeptInfo.batchName": batchName,
            $or: [
                { studentEmail: studentEmail },
                { studentId: studentId },
                { studentRFIDUniqueId: studentRFIDUniqueId}
            ]
        })

        if (studentExists)
            return res.status(200).json({ status: false, message: "Student already exists either with Email or student Id" })

        // Generate a 6-digits password for student login credential
        const password = generatePassword();

        // Create the student instance
        const studentInfo = new studentCol({
            studentName: {
                firstName: firstName.trim(),
                lastName: lastName.trim()
            },
            studentEmail: studentEmail.trim(),
            studentPass: await generateEncryptedPassword(password),
            studentId: studentId,
            studentDOB,
            studentDeptInfo: {
                instituteId,
                departmentId,
                batchName
            },
            studentRFIDUniqueId // holds the RFID Id
        })

        // Save the data in the student collections
        const studentRes = await studentInfo.save();

        // Check if the document has been saved or not
        if (!studentRes)
            return res.status(200).json({ status: false, message: "Student Document couldn't be created" })

        const response = await departmentCol.findOneAndUpdate({ _id: departmentId, "batches.batchName": batchName }, { $push: { "batches.$.studentList": { studentId: studentRes._id } } })

        if (response) {
            studentCreationMail(req.query, studentRes, password)
            res.status(201).json({
                status: true,
                message: studentRes
            })
        } else {
            res.status(200).json({
                status: false,
                message: "Something went wrong"
            })
        }

    } catch (error) {
        console.error(`Server error : creating student account --> ${error}`)
        res.status(500).send()
    }
}