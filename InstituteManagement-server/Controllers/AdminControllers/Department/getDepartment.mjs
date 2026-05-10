import departmentCol from "../../../Models/departmentModel.mjs";

export default async (req, res) => {
    try {
        const { deptId } = req.params;
        const dept = await departmentCol.findById(deptId);
        if (!dept)
            return res.status(404).json({ status: false, message: "Department doesn't exist" })

        res.status(200).json({ status: true, message: dept })
    } catch (error) {
        console.error(`Server error : retrieving department information --> ${error}`)
        res.status(500).send()
    }
}