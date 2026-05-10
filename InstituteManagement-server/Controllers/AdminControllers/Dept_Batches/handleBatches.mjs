import assignmentCol from "../../../Models/assignmentModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import examinationCol from "../../../Models/examinationModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export const createBatch = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { batchName, semester } = req.body;

        if (!batchName.trim() || !semester)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (isNaN(semester))
            return res.status(200).json({ status: false, message: "Semester must be a numeric value" })

        const batchExists = await departmentCol.findOne({ _id: departmentId, "batches.batchName": batchName.trim() }, { "batches.$": 1 })

        if (batchExists)
            return res.status(200).json({ status: false, message: "Batch already exists. Try another name" })


        const response = await departmentCol.findByIdAndUpdate(departmentId, {
            $push: {
                batches: {
                    batchName: batchName.trim(),
                    semester: semester,
                    creationDate: {
                        time: generateTime(),
                        date: generateDate()
                    }
                }
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ?? "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : creating batch --> ${error}`)
        res.status(500).send()
    }
}
export const modifyBatch = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { oldBatchName, newBatchName, newSemester } = req.body;

        if (!newBatchName)
            return res.status(200).json({ status: false, message: "Batch Name can't be empty" })

        if (!newSemester || isNaN(newSemester) || newSemester <= 0)
            return res.status(200).json({ status: false, message: "Invalid Semester" })

        const batchExists = await departmentCol.findOne({ _id: departmentId, "batches.batchName": newBatchName }, { "batches.$": 1 })

        if (batchExists && batchExists?.batches[0].batchName !== oldBatchName)
            return res.status(200).json({ status: false, message: "Batch Name has already been taken" })

        const response = await departmentCol.findOneAndUpdate({ _id: departmentId, "batches.batchName": oldBatchName }, { $set: { "batches.$.batchName": newBatchName, "batches.$.semester": newSemester } })

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Batch is modified" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : modifing batch name--> ${error}`)
        res.status(500).send()
    }
}
export const removeBatch = async (req, res) => {
    try {
        const { batchName } = req.query
        const { departmentId } = req.params;
        const response = await departmentCol.findByIdAndUpdate(departmentId, { $pull: { batches: { batchName: batchName } } })

        const batch = response.batches.find(batch => batch.batchName === batchName)

        const studentIds = batch?.studentList.map(std => std.studentId)
        const assignmentIds = batch?.assignments.map(ass => ass.assignmentId)
        const examIds = batch?.examinationList.map(exam => exam.examinationId)

        // Remove students 
        await studentCol.deleteMany({ _id: { $in: studentIds } })

        // Remove assignments
        await assignmentCol.deleteMany({ _id: { $in: assignmentIds } })

        // Remove Exams
        await examinationCol.deleteMany({ _id: { $in: examIds } })

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Batch Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing batch --> ${error}`)
        res.status(500).send()
    }
}