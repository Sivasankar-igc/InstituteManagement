import assignmentCol from "../../../Models/assignmentModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import examinationCol from "../../../Models/examinationModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export const updateSemester = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { batchName } = req.query;

        if (!batchName)
            return res.status(400).json({ status: false, message: "Bad Request" })

        // Find The Batch
        const batch = await departmentCol.findOne({ _id: departmentId, "batches.batchName": batchName }, { "batches.$": 1, _id: 0 })

        if (!batch)
            return res.status(404).json({ status: false, message: "Batch Not Found" })

        // Remove all the assignments of the paper
        const tempAssignmentIds = batch.batches[0].assignments.map(ass => ass.assignmentId) // Retrieve all assignment ids from the assignment array of the batch

        await assignmentCol.deleteMany({ _id: { $in: tempAssignmentIds } })

        // Remove all the exams of the paper
        const tempExamIds = batch.batches[0].examinationList.map(exam => exam.examinationId) // Retrieve all exam ids from the examination array of the batch

        await examinationCol.deleteMany({ _id: { $in: tempExamIds } })


        const response = await departmentCol.findOneAndUpdate({ _id: departmentId, "batches.batchName": batchName }, {
            $set: {
                "batches.$.batchAnnouncements": [{
                    _id: Date.now(),
                    announcement: "Semester has been updated",
                    date: generateDate(),
                    time: generateTime()
                }],
                "batches.$.assignments": [],
                "batches.$.examinationList": []
            },
            $inc: { "batches.$.semester": 1 }
        }, { new: true })


        if (response) {
            const updatedBatch = await departmentCol.findOne({ _id: departmentId, "batches.batchName": batchName }, {
                "batches.$": 1
            })

            return res.status(200).json({
                status: true,
                message: updatedBatch.batches[0]
            })
        }

        res.status(200).json({
            status: false,
            message: "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : updating semester --> ${error}`)
        res.status(500).send()
    }
}