import departmentCol from "../../Models/departmentModel.mjs";
import examinationCol from "../../Models/examinationModel.mjs";

export const createQuestions = async (req, res) => {
    try {
        const { deptId } = req.params;
        const { paperName, fullMark, questionPaperInfo } = req.body;

        if (!paperName || !fullMark || questionPaperInfo.length === 0)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        // Find the semester through deptid and paper name
        const findSemester = await departmentCol.findOne({ _id: deptId, "papers.name": paperName }, { "papers.$": 1, _id: 0 })
        const semester = findSemester.papers[0].semester

        // Find the batch
        const batch = await departmentCol.findOne({ _id: deptId, "batches.semester": semester }, { "batches.$": 1, _id: 0 })

        if (!batch)
            return res.status(404).json({ status: false, message: "Batch not found" })

        const examInfo = new examinationCol({
            questionsAndAnswers: questionPaperInfo,
            paperName: paperName,
            fullMark: fullMark
        })

        const response = await examInfo.save();

        if (!response)
            return res.status(200).json({ status: false, message: "Something went wrong" })

        const batchRes = await departmentCol.updateOne({ _id: deptId, "batches.semester": semester }, { $push: { "batches.$.examinationList": { examinationId: response._id } } })

        if (batchRes.modifiedCount === 0) {
            await examinationCol.findByIdAndDelete(response._id)
            return res.status(200).json({ status: false, message: "Something went wrong" })
        }

        res.status(201).json({ status: true, message: "Question Creation Successful." })

        // console.table(questionPaperInfo)

    } catch (error) {
        console.error(`Server error : question paper creation --> ${error}`)
        res.status(500).send()
    }
}

export const modifyExam = async (req, res) => {
    try {
        const { questionPaperId } = req.params;
        const { fullMark, questionAndAnswers } = req.body;

        if (!fullMark || questionAndAnswers.length === 0)
            return res.status(200).json({ status: false, message: "All fields must be filled" })

        const response = await examinationCol.findByIdAndUpdate(questionPaperId, {
            $set: {
                questionsAndAnswers: questionAndAnswers,
                fullMark: fullMark
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Question modified successfully" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : modifing examination paper --> ${error}`)
        res.status(500).send()
    }
}