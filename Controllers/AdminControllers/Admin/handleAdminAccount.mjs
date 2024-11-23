import adminCol from "../../../Models/adminModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";

export const modifyAdminAccount = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { adminFirstName, adminLastName, designation, mobileNumber } = req.body;

        if (!adminFirstName || !adminLastName || !designation || !mobileNumber)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(adminFirstName.trim()))
            return res.status(200).json({ status: false, message: "Invalid First Name" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(adminLastName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Last Name" })
        else if (!new RegExp("^[\+0-9][0-9]{4,11}$").test(mobileNumber.trim()))
            return res.status(200).json({ status: false, message: "Invalid Mobile No" })
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(designation.trim()))
            return res.status(200).json({ status: false, message: "Invalid Designation" })

        // Check whether there exists any other admin document with same mobile
        const admin = await adminCol.findOne({ mobileNumber: mobileNumber })

        // If exists then if the _id is same as the adminId then it belongs to the same admin (no updation for mobile number) else there exists other document with the same mobile number
        if (admin && admin._id.toString() !== adminId)
            return res.status(200).json({ status: false, message: "Mobile Number is already in use" })

        const response = await adminCol.findByIdAndUpdate(adminId, {
            $set: {
                adminFirstName: adminFirstName,
                adminLastName: adminLastName,
                designation: designation,
                mobileNumber: mobileNumber
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Admin account modified" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : modifing admin account --> ${error}`)
        res.status(500).send()
    }
}

export const removeAdminAccount = async (req, res) => { // Remove the branch admin accounts
    try {
        const { departmentId, adminId } = req.query;

        const adminRes = await adminCol.findByIdAndDelete(adminId);

        if (!adminRes)
            return res.status(200).json({ status: false, message: "Admin account couldn't be removed" })



        const deptRes = await departmentCol.findByIdAndUpdate(departmentId, { $set: { adminMail: "" } }, { new: true })

        if (!deptRes)
            return res.status(200).json({ status: false, message: "Department Admin couldn't be changed" })



        res.status(200).json({
            status: true,
            message: "Admin account removed successful"
        })

    } catch (error) {
        console.error(`Server error : removing admin account --> ${error}`)
        res.status(500).send()
    }
}