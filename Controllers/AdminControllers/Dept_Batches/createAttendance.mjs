import attendanceCol from "../../../Models/attendanceModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";

export default async (req, res) => {
    try {
        const { instituteId, departmentId, semester, data: ymList } = req.body;

        const info = await departmentCol.findOne(
            {
                _id: departmentId,
                "papers.semester": semester
            },
            {
                "papers": 1,
                "batches": 1,
                "_id": 0
            }
        )

        const papers = info?.papers
            ?.filter((p) => p.semester === semester)
            ?.map((p) => p.name);


        const studentList = info?.batches
            ?.filter((b) => b.semester === semester)
            ?.flatMap((b) => b.studentList.map((s) => s.studentId));


        const students = await studentCol.find({
            _id: { $in: studentList },
        },
            { "studentName": 1, "studentId": 1, "_id": 0 }
        );

        const attendanceInfo = ymList.map((item) => ({
            year: Number(item.year),
            month: item.month,
            attendanceList: students.map((s) => ({
                studentId: s.studentId,
                studentName: `${s.studentName.firstName} ${s.studentName.lastName}`,
                studentAttendance: [], // ✅ later fill day-wise
            }))
        }));

        const attendanceDocs = papers.map((paperName) => ({
            instituteId,
            departmentId,
            paperName,
            attendanceInfo
        }));

        // ✅ insert all papers at once
        const response = await attendanceCol.insertMany(attendanceDocs);

        res.status(200).json({
            status: response.length > 0,
            message: response.length > 0 ? "Batch Attendance Created" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : attendance creation --> ${error}`)
        res.status(500).send()
    }
}