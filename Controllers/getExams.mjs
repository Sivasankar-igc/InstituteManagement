import departmentCol from "../Models/departmentModel.mjs";
import examinationCol from "../Models/examinationModel.mjs";

export default async (req, res) => {
    try {
        const { deptId, subject } = req.query;

        // Find the semester through deptid and paper name
        const findSemester = await departmentCol.findOne({ _id: deptId, "papers.name": subject }, { "papers.$": 1, _id: 0 })
        const semester = findSemester.papers[0].semester

        // Find the batch
        const batch = await departmentCol.findOne({ _id: deptId, "batches.semester": semester }, { "batches.$": 1, _id: 0 })

        if (!batch)
            return res.status(404).json({ status: false, message: "Batch not found" })

        const examIds = batch.batches[0].examinationList.map(exam => exam.examinationId)

        if (examIds.length === 0)
            return res.status(200).json({ status: true, message: [] })

        const exams = await examinationCol.find({ _id: { $in: examIds }, paperName: subject })


        res.status(200).json({
            status: true,
            message: exams
        })

    } catch (error) {
        console.error(`Server error : retrieving exams --> ${error}`)
        res.status(500).send()
    }
}