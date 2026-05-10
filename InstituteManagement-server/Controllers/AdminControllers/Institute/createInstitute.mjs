import adminCol from "../../../Models/adminModel.mjs";
import instituteCol from "../../../Models/instituteModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateEncryptedPassword } from "../../../utils/generateEncryptedPassword.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Admin Account Creation
export default async (req, res) => {
    try {
        const { adminEmail, adminFirstName, adminLastName, adminPass, designation, mobileNumber, instituteId, instituteName, institutePass } = req.body;

        if (!adminEmail || !adminFirstName || !adminLastName || !adminPass || !designation || !mobileNumber || !instituteId || !instituteName || !institutePass)
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
        else if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(instituteName.trim()))
            return res.status(200).json({ status: false, message: "Invalid Institute Name" })

        else {

            // CHECK WHETHER THERE IS ANY ADMIN ACCOUNT EXITS WITH THE SAME EMAIL OR MOBILE NUMBER
            const isAccountExist = await adminCol.findOne({
                $or: [
                    { adminEmail: adminEmail },
                    { mobileNumber: mobileNumber }
                ]
            })

            if (isAccountExist)  // IF NOT NULL THEN SIGN IN 
                return res.status(200).json({ status: false, message: "Admin Account Exists." })



            // CHECK WHETHER THERE EXISTS ANY INSTITUTE WITH SAME INSTITUTE ID
            const instituteExists = await instituteCol.findOne({ instituteId: instituteId })

            if (instituteExists)
                return res.status(200).json({ status: false, message: "Instiute Id is already in use." })



            // ***************************************************ADMIN ACCOUNT CREATION***************************************

            // Create the admin account
            const adminAccount = new adminCol({
                adminEmail: adminEmail.trim(),
                adminFirstName: adminFirstName.trim(),
                adminLastName: adminLastName.trim(),
                adminPass: await generateEncryptedPassword(adminPass),
                designation: designation.trim(),
                mobileNumber: mobileNumber.trim(),
                instituteId
            })

            const adminRes = await adminAccount.save()

            // Check whether admin document saved or not
            if (!adminRes)
                return res.status(200).json({ status: false, message: "Admin Account couldn't be created" })

            // ===================================================END OF ADMIN ACCOUNT CREATION==================================

            // ***************************************************INSTITUTE ACCOUNT CREATION*************************************

            // Create Institute Account 
            const instituteAccount = new instituteCol({
                instituteId: instituteId.trim(),
                instituteName: instituteName.trim(),
                institutePass: await generateEncryptedPassword(institutePass),
                superAdminMail: adminEmail,
                creationDateAndTime: {
                    time: generateTime(),
                    date: generateDate()
                }
            })

            const instituteRes = await instituteAccount.save()

            // Check whether institute document is saved or not
            if (!instituteRes) {
                await adminCol.findByIdAndDelete(adminRes._id) // delete the admin document from admin collections if the institute document couldn't be created
                res.status(200).json({ status: false, message: "Institute Account couldn't be created" })
            }

            // ===================================================END OF INSTIUTE ACCOUNT CREATION===========================

            // // TOKEN CREATION
            // const token = jwt.sign({ instituteId: instituteRes._id, adminId: adminRes._id, facultyId }, JWT_SECRET_KEY)

            // // COOKIE CREATION
            // res.cookie("multiapp", token, {
            //     httpOnly: true,
            //     maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000)
            // })

            res.status(201).json({
                status: true,
                message: { admin: adminRes, institute: instituteRes }
            })
        }
    }
    catch (error) {
        console.error(`Sever Error : Institute Account Creation Error --> ${error}`)
        res.status(500).send()
    }
}