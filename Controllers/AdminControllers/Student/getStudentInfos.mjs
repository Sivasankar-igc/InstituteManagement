import studentCol from "../../../Models/studentModel.mjs";

export default async (req, res) => {
    try {
        const { studentList } = req.body;
        const ids = studentList.map(sid => sid.studentId)

        if (ids.length === 0) return res.status(200).json({ status: false, message: "Student List is empty" })

        const students = await studentCol.find({ _id: { $in: ids } })
        res.status(200).json({
            status: students.length > 0,
            message: students.length > 0 ? students : "Student Informations couldn't be retrieved"
        })
    } catch (error) {
        console.error(`Server error : retrieving student informations --> ${error}`)
        res.status(500).send()
    }
}