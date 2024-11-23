import adminCol from "../../../Models/adminModel.mjs";

export default async (req, res) => {
    try {
        const { adminEmail } = req.query;
        const admin = await adminCol.findOne({ adminEmail: adminEmail })
        if (!admin) return res.status(404).json({ status: false, message: "Admin not found" })
        res.status(200).json({ status: true, message: admin })
    } catch (error) {
        console.error(`Server error : retrieving admin by mail --> ${error}`)
        res.status(500).send()
    }
}