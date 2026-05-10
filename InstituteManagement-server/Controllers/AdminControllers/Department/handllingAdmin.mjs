import adminCol from "../../../Models/adminModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import { generateEncryptedPassword } from "../../../utils/generateEncryptedPassword.mjs";
import { adminCreationMail } from "../../../utils/generateMail.mjs";
import generatePassword from "../../../utils/generatePassword.mjs";

export const createDeptAdmin = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { instituteId } = req.query;

        const { adminEmail, adminFirstName, adminLastName, designation, mobileNumber } = req.body;

        if (!adminEmail || !adminFirstName || !adminLastName || !designation || !mobileNumber)
            return res.status(200).json({
                status: false,
                message: "All reuired fields must be filled"
            })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(adminFirstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(adminLastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(adminEmail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })
        else if (!new RegExp("^[\+0-9][0-9]{4,11}$").test(mobileNumber.trim()))
            return res.status(200).json({ status: false, message: "Invalid Mobile No" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(designation.trim()))
            return res.status(200).json({ status: false, message: "Invalid Designation" })

        const pass = generatePassword()
        const encryptedPassword = await generateEncryptedPassword(pass)

        const adminInfo = new adminCol({
            adminEmail,
            adminFirstName,
            adminLastName,
            adminPass: encryptedPassword,
            designation,
            mobileNumber,
            instituteId: instituteId,
            departmentId: departmentId
        })

        const adminRes = await adminInfo.save()

        if (!adminRes)
            return res.status(200).json({ status: false, message: "Account creation failed" })

        const deptRes = await departmentCol.findByIdAndUpdate(departmentId, { adminMail: adminEmail }, { new: true })

        if (!deptRes) {
            await adminCol.findByIdAndDelete(adminRes._id)
            return res.status(200).json({ status: false, message: "Department Admin couldn't be modified" })
        }

        adminCreationMail(req.query, adminRes, pass)
        res.status(200).json({ status: true, message: adminRes })

    } catch (error) {
        console.error(`Server error : creating department admin --> ${error}`)
        res.status(500).send()
    }
}