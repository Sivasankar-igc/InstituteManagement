import examinationCol from "../../Models/examinationModel.mjs";

export default async (req, res) => {
    try {
        const { examId } = req.params;
        const { studentId, mark, answers } = req.body;

        const response = await examinationCol.findByIdAndUpdate(examId, {
            $push: {
                studentList: {
                    studentId: studentId,
                    mark: mark,
                    answers
                }
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Exam Submission Successfully" : "Exam couldn't be recorded"
        })

    } catch (error) {
        console.error(`Server error : attending exam --> ${error}`)
        res.status(500).send()
    }
}