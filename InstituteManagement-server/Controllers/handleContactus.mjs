import { sendUserMsg_contactUs } from "../utils/generateMail.mjs"

export default async (req, res) => {
    try {
        const { email, username, message } = req.body;
        if (!email || !username || !message)
            res.status(200).json({ status: false, message: "All field must be filled" })

        else {
            if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(username.trim()))
                res.status(200).json({ status: false, message: "Invalid Full Name" })
            else if (!new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").test(email.trim()))
                res.status(200).json({ status: false, message: "Invalid Email Id" })
            else if (message.trim() === "")
                res.status(200).json({ status: false, message: "Invalid Message" })
            else {
                sendUserMsg_contactUs(email, username, message)
                res.status(200).json({ status: true, message: "Message Sent Successfully" })
            }
        }
    } catch (error) {
        console.error(`Server error : contact us error --> ${error}`)
    }
}