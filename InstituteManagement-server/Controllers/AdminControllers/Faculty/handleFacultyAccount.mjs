import departmentCol from "../../../Models/departmentModel.mjs";
import facultyCol from "../../../Models/facultyModel.mjs";
import { removeFacultyMail } from "../../../utils/generateMail.mjs";

export const modifyFacultyAccount = async (req, res) => {
    try {
        const { instituteId, departmentId } = req.query;
        const { _id, facultyName, facultyEmail, designation, facultyId, subjects } = req.body;
        const { firstName, lastName } = facultyName;

        if (!firstName || !lastName || !facultyEmail || !designation || !facultyId || subjects.length === 0)
            return res.status(200).json({
                status: false,
                message: "All required fields must be filled"
            })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(firstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(lastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(facultyEmail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(designation.trim()))
            return res.status(200).json({ status: false, message: "Invalid Designation" })

        const facultyDocs = await facultyCol.find({
            $or: [
                { facultyEmail: facultyEmail },
                { facultyId: facultyId }
            ],
            "facultyDeptInfo.instituteId": instituteId,
            "facultyDeptInfo.departmentId": departmentId,
        })

        if (facultyDocs.length > 1)
            return res.status(200).json({ status: false, message: "Faculty already exists" })

        if (facultyDocs.length === 1) {
            const faculty = await facultyCol.findById(_id)

            if (!faculty)
                return res.status(404).json({ status: false, message: "Faculty not found" })

            if (!(faculty._id !== facultyDocs[0]._id))
                return res.status(200).json({ status: false, message: "Faculty already exists" })

        }

        const response = await facultyCol.findByIdAndUpdate(_id, {
            $set: {
                facultyName: {
                    firstName: firstName,
                    lastName: lastName
                },
                facultyEmail: facultyEmail,
                designation: designation,
                facultyId: facultyId,
                subjects: subjects,
            }
        }, { new: true })

        await departmentCol.findOneAndUpdate({ _id: departmentId, "facultyList.facultyId": _id }, { $set: { "facultyList.$.facultyDeptId": facultyId } })

        res.status(200).json({
            status: response !== null && response !== undefined,
            message: response ?? "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : modifing faculty account --> ${error}`)
        res.status(500).send()
    }
}


export const removeFacultyAccount = async (req, res) => {
    try {
        const { departmentId, facultyId } = req.query;

        // Remove the faculty document from the department collections
        const deptRes = await departmentCol.updateOne({ _id: departmentId }, { $pull: { facultyList: { facultyId: facultyId } } })

        // If the faculty Ref is removed from the department then Remove it from the faculty collections
        if (!deptRes.modifiedCount > 0)
            return res.status(200).json({ status: false, message: "Faculty Document couldn't be removed" })

        const response = await facultyCol.findByIdAndDelete(facultyId)

        // check whether the faculty document is removed from the faculty collection or not
        if (!response) {
            await departmentCol.updateOne({ _id: departmentId }, { $push: { facultyList: { facultyId: facultyId } } })
            return res.status(200).json({ status: false, message: "Faculty Document couldn't be removed" })
        }

        removeFacultyMail(req.query, response)
        res.status(200).json({
            status: true,
            message: "Faculty Account Removed Successfully"
        })
    } catch (error) {
        console.error(`Server error : removing faculty account --> ${error}`)
        res.status(500).send()
    }
}