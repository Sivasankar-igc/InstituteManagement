import bcryptjs from "bcryptjs";
import instituteCol from "../Models/instituteModel.mjs";

export default async (req, res) => {
    try {
        const { id: instituteId, password: institutePass } = req.body;

        if (!instituteId || !institutePass)
            return res.status(200).json({ status: false, message: "All fields must be filled" })

        const institute = await instituteCol.findOne({ instituteId: instituteId })

        if (!institute)
            return res.status(200).json({ status: false, message: "Institute Doesn't Exist" })

        const correctPassword = bcryptjs.compareSync(institutePass, institute.institutePass)

        if (!correctPassword)
            return res.status(200).json({ status: false, message: "Wrong Credentials" })

        res.status(200).json({
            status: true,
            message: institute
        })

    } catch (error) {
        console.error(`Server error : institute login error --> ${error}`)
        res.status(500).send()
    }
}