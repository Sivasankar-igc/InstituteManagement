import departmentCol from "../../../Models/departmentModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";
import { removeStudentMail, studentModificationMail } from "../../../utils/generateMail.mjs";

export const modifyStudentAccount = async (req, res) => {
    try {
        const { instituteId, departmentId, batchName } = req.query;
        const { _id, firstName, lastName, studentEmail: newStudentMail, studentId: newstudentId, studentDOB } = req.body;

        if (!firstName || !lastName || !newStudentMail || !newstudentId || !studentDOB)
            return res.status(200).json({ status: false, message: "All fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(newStudentMail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })

        // Check if the admin has not modified the mail and id
        const studentDocs = await studentCol.find({
            $or: [
                { studentEmail: newStudentMail },
                { studentId: newstudentId }
            ],
            "studentDeptInfo.instituteId": instituteId,
            "studentDeptInfo.departmentId": departmentId,
            "studentDeptInfo.batchName": batchName
        })

        /*
            mail and id are not modified - count 1
            mail and id are modified and there is a student - count 1
            mail and id are modified no student - count 0

            only mail modified and no student - count 1
            only mail modified and there is student - count >1

            only id modified and no student - count 1
            only id modified and there is student - count>1
        */

        if (studentDocs.length > 1)
            return res.status(200).json({ status: false, message: "Student already exists" })

        if (studentDocs.length === 1) {
            const student = await studentCol.findById(_id)

            if (!student)
                return res.status(404).json({ status: false, message: "Student not found" })

            /*
             If count is 1 
             cond1 -> the document holds the same student info
             cond1 -> the doucment holds another student info
             */
            
            if (!(student._id.toString() === studentDocs[0]._id.toString()))
                return res.status(200).json({ status: false, message: "Student already exists" })

        }

        const response = await studentCol.findByIdAndUpdate(_id, {
            $set: {
                studentName: {
                    firstName: firstName,
                    lastName: lastName
                },
                studentEmail: newStudentMail,
                studentDOB: studentDOB,
                studentId: newstudentId
            }
        }, { new: true })


        studentModificationMail(req.query, response)

        res.status(200).json({
            status: response !== null && response !== undefined,
            message: response
        })
    } catch (error) {
        console.error(`Server error : modifing student account --> ${error}`)
        res.status(500).send()
    }
}

export const removeStudentAccount = async (req, res) => {
    try {
        const { departmentId, batchName, studentId } = req.query;

        // Remove the student document from the department collections
        const deptRes = await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName, "batches.studentList.studentId": studentId }, { $pull: { "batches.$.studentList": { studentId: studentId } } })

        // If the student Ref is removed from the department then Remove it from the student collections
        if (!deptRes.modifiedCount > 0)
            return res.status(200).json({ status: false, message: "Student Document couldn't be removed" })

        const response = await studentCol.findByIdAndDelete(studentId)

        // check whether the student document is removed from the student collection or not
        if (!response) {
            await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName, "batches.studentList.studentId": studentId }, { $push: { "batches.studentList": { studentId: studentId } } })
            return res.status(200).json({ status: false, message: "Student Document couldn't be removed" })
        }

        removeStudentMail(req.query, response)
        res.status(200).json({
            status: true,
            message: "Student Account Removed Successfully"
        })
    } catch (error) {
        console.error(`Server error : removing student account --> ${error}`)
        res.status(500).send()
    }
}