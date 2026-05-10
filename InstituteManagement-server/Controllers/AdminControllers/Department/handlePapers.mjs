import assignmentCol from "../../../Models/assignmentModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import examinationCol from "../../../Models/examinationModel.mjs";
import facultyCol from "../../../Models/facultyModel.mjs";

export const addPaper = async (req, res) => {
    try {
        const { departmentId } = req.params
        const { name: paperName, semester } = req.body;

        if (!paperName.trim() || !semester)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (isNaN(semester) || !new RegExp("^[\+0-9]").test(semester))
            return res.status(200).json({ status: false, message: "Invalid Semester" })

        // CHECK WHETHER PAPER EXISTS OR NOT
        const paperExists = await departmentCol.findOne({ _id: departmentId, "papers.name": paperName })

        if (paperExists) {
            return res.status(200).json({ status: false, message: "Paper Exists" })
        } else {
            const response = await departmentCol.findByIdAndUpdate(departmentId, {
                $push: {
                    papers: {
                        name: paperName.trim(),
                        semester: parseInt(semester)
                    }
                }
            }, { new: true })

            res.status(201).json({
                status: response !== null && response !== undefined,
                message: response ? {
                    name: paperName.trim(),
                    semester: parseInt(semester)
                } : "Something went wrong"
            })
        }
    } catch (error) {
        console.error(`Server error : adding new paper --> ${error}`)
        res.status(500).send()
    }
}

export const modifyPaper = async (req, res) => {
    try {
        const departmentId = req.params.departmentId
        const { oldPaperName, newPaperName, semester } = req.body;

        if (isNaN(semester) || !new RegExp("^[\+0-9]").test(semester))
            return res.status(200).json({ status: false, message: "Invalid Semester" })
        else if (!newPaperName.trim())
            return res.status(200).json({ status: false, message: "Invalid Paper Name" })





        if (oldPaperName !== newPaperName) {
            // CHECK WHETHER PAPER EXISTS OR NOT
            const paperExists = await departmentCol.findOne({ _id: departmentId, "papers.name": newPaperName })

            if (paperExists) {
                return res.status(200).json({ status: false, message: "Paper Exists" })
            } else {
                const response = await departmentCol.findOneAndUpdate({ _id: departmentId, "papers.name": oldPaperName }, { $set: { "papers.$.name": newPaperName.trim(), "papers.$.semester": semester } }, { new: true })
                await facultyCol.updateMany({ "facultyDeptInfo.departmentId": departmentId }, { $pull: { subjects: oldPaperName } })
                await facultyCol.updateMany({ "facultyDeptInfo.departmentId": departmentId }, { $push: { subjects: newPaperName.trim() } })

                // Change the papername in all exams and asssignments of the corresponding paper
                const batch = await departmentCol.findOne({ _id: departmentId, "batches.semester": semester }, { "batches.$": 1, _id: 0 }) // Find the batch

                const exam_ids = batch?.batches[0].examinationList.map(exam => exam.examinationId)
                const assignment_ids = batch?.batches[0].assignments.map(ass => ass.assignmentId)

                await assignmentCol.updateMany({ _id: { $in: assignment_ids }, subject: oldPaperName }, { $set: { subject: newPaperName } })// change assignment papername
                await examinationCol.updateMany({ _id: { $in: exam_ids }, paperName: oldPaperName }, { $set: { paperName: newPaperName } })


                res.status(201).json({
                    status: response !== null && response !== undefined,
                    message: response ? "Paper Modified Successfully" : "Something went wrong"
                })
            }

        } else {
            const response = await departmentCol.findOneAndUpdate({ _id: departmentId, "papers.name": oldPaperName }, { $set: { "papers.$.semester": semester } }, { new: true })
            res.status(201).json({
                status: response !== null && response !== undefined,
                message: response ? "Semester Modified Successfully" : "Something went wrong"
            })
        }
    } catch (error) {
        console.error(`Server error : modifing the paper --> ${error}`)
        res.status(500).send()
    }
}

export const removePaper = async (req, res) => {
    try {
        const departmentId = req.params.departmentId
        const { paperName } = req.query;

        // Find the semester through deptid and paper name
        const findSemester = await departmentCol.findOne({ _id: departmentId, "papers.name": paperName }, { "papers.$": 1, _id: 0 })

        const semester = findSemester.papers[0].semester

        const batch = await departmentCol.findOne({ _id: departmentId, "batches.semester": semester }, { "batches.$": 1, _id: 0 })

        if (batch) {

            // Remove all the assignments of the paper
            const tempAssignmentIds = batch.batches[0].assignments.map(ass => ass.assignmentId) // Retrieve all assignment ids from the assignment array of the batch
            const assignmentCols = await assignmentCol.find({ _id: { $in: tempAssignmentIds }, subject: paperName }) // Find the assignment collections by _id and papername
            const assignmentIds = assignmentCols.map(ass => ass._id) // Retrieve all the required assignment ids

            await assignmentCol.deleteMany({ _id: { $in: assignmentIds } })


            // Remove all the exams of the paper
            const tempExamIds = batch.batches[0].examinationList.map(exam => exam.examinationId) // Retrieve all exam ids from the examination array of the batch
            const examCols = await examinationCol.find({ _id: { $in: tempExamIds }, paperName: paperName }) // Find the examination collections by _id and papername
            const examinationIds = examCols.map(exam => exam._id) // Retrieve all the required examination ids

            await examinationCol.deleteMany({ _id: { $in: examinationIds } })


            // Pull the assignment and examination ids from the examination and asignment array of the batch
            await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batch.batches[0].batchName }, {
                $pull: {
                    "batches.$.assignments": { assignmentId: { $in: assignmentIds } },
                    "batches.$.examinationList": { examinationId: { $in: examinationIds } }
                }
            })


        }

        await facultyCol.updateMany({ "facultyDeptInfo.departmentId": departmentId }, { $pull: { subjects: paperName } })

        const response = await departmentCol.updateOne({ _id: departmentId }, { $pull: { papers: { name: paperName } } })

        res.status(201).json({
            status: response.modifiedCount > 0,
            message: response.modifiedCount > 0 ? "Paper Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing the paper --> ${error}`)
        res.status(500).send()
    }
}