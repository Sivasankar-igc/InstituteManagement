// This method will be called when there is a requirement of checking whether the admin password is correct or not

import adminCol from "../../../Models/adminModel.mjs";
import bcryptjs from "bcryptjs"

export default async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.query;
        const admin = await adminCol.findOne({ adminEmail: adminEmail })
        if (!admin)
            return res.status(404).send("Admin not found")

        const isPasswordCorrect = bcryptjs.compareSync(adminPassword, admin.adminPass)

        res.status(200).send(isPasswordCorrect)

    } catch (error) {
        console.error(`Checking admin password --> ${error}`)
        res.status(500).send()
    }
}