import departmentCol from "../../../Models/departmentModel.mjs";

export default async (req, res) => {
    try {

        const { deptId, batchName } = req.query;

        const batch = await departmentCol.findOne(
            {
                _id: deptId,
                "batches.batchName": batchName
            },
            {
                "batches": {
                    $elemMatch: { batchName: batchName }
                }
            }
        )

        res.status(batch ? 200 : 404).json({
            status: batch ? true : false,
            message: batch ?? "Batch Not Found"
        })

    } catch (error) {
        console.error(`Server error : retrieving batch info --> ${error}`)
        res.status(500).send()
    }
}