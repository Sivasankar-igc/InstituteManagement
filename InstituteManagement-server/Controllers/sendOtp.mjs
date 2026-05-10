import adminCol from "../Models/adminModel.mjs";
import facultyCol from "../Models/facultyModel.mjs";
import studentCol from "../Models/studentModel.mjs";
import { sendOTP } from "../utils/generateMail.mjs";
import generateOTP from "../utils/generateOTP.mjs";

export default async (req, res) => {
    try {
        const { mail, instituteName, userType } = req.body;

        if (!new RegExp("^[\\w]+([\.-]?[\\w]+)*@[\\w]+([\.-]?[\\w]+)*(\.[\\w]{2,3})+$").test(mail.trim()))
            return res.status(200).json({ status: false, message: "Invalid Email Id" })

        const otp = generateOTP();
        let user = null;

        if (!otp)
            return res.status(200).json({ status: false, message: "OTP couldn't be generated" })

        switch (userType) {
            case "admin":
                user = await adminCol.findOne({ adminEmail: mail })
                break;
            case "faculty":
                user = await facultyCol.findOne({ facultyEmail: mail })
                break;
            case "student":
                user = await studentCol.findOne({ studentEmail: mail })
                break;
        }

        if (!user) return res.status(400).send("Please enter a registered email")
        sendOTP(otp, instituteName, mail)
        res.status(200).json({ status: true, message: otp })
    } catch (error) {
        console.error(`Server error : sending otp --> ${error}`)
        res.status(500).send()
    }
}