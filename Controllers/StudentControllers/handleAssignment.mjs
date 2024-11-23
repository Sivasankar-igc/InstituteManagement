import handleRemove from "../../cloudinaryConfig/handleRemove.mjs";
import assignmentCol from "../../Models/assignmentModel.mjs";
import { generateDate } from "../../utils/generateDate.mjs"
import { generateTime } from "../../utils/generateTime.mjs"

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { studentName, studentId, pdf, pdfLink } = req.body;

        if (!studentName || !studentId || pdf.length === 0)
            return res.status(200).json({ status: false, message: "All fields must be filled" })

        const response = await assignmentCol.findByIdAndUpdate(assignmentId, {
            $push: {
                studentList: {
                    studentName,
                    studentId,
                    date: generateDate(),
                    time: generateTime(),
                    pdf: pdf,
                    pdfLink: pdfLink
                }
            }
        }, { new: true })

        if (!response) {
            handleRemove(pdf)
            return res.status(200).json({
                status: false,
                message: "Assignment couldn't be submitted"
            })
        }

        res.status(200).json({
            status: true,
            message: "Assignment Uploaded Successfully"
        })

    } catch (error) {
        console.error(`Server error : posting student assignment --> ${error}`)
        res.status(500).send()
    }
}

export const removeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { studentId } = req.query;

        const response = await assignmentCol.findByIdAndUpdate(assignmentId, {
            $pull: {
                studentList: {
                    studentId: studentId
                }
            }
        })

        const urls = response.studentList.find(std => std.studentId === studentId)
        handleRemove(urls.pdf)

        res.status(200).json({
            status: response ? true : false,
            message: response ? "Assignment Removed Successfully" : "Assignment couldn't be removed"
        })
    } catch (error) {
        console.error(`Server error : removing student assignment --> ${error}`)
        res.status(500).send()
    }
}