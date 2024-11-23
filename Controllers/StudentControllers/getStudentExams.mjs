import departmentCol from "../../Models/departmentModel.mjs";
import examinationCol from "../../Models/examinationModel.mjs";

export default async (req, res) => {
    try {
        const { deptId, batchName, subject } = req.query;

        // Find the batch 
        const batch = await departmentCol.findOne({ _id: deptId, "batches.batchName": batchName }, { "batches.$": 1, _id: 0 })

        if (!batch)
            return res.status(404).json({ status: false, message: "Batch not found" })

        // Retrieve all the exam ids from the batch's examination list
        const examIds = batch.batches[0].examinationList.map(exam => exam.examinationId)

        if (examIds.length === 0)
            return res.status(200).json({ status: true, message: [] })

        // Find the exams
        const exams = await examinationCol.find({ _id: { $in: examIds }, paperName: subject, adminRecog: true })

        res.status(200).json({
            status: true,
            message: exams
        })

    } catch (error) {
        console.error(`Server error : retrieving student exams --> ${error}`)
        res.status(500).send()
    }
}