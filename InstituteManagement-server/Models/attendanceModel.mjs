import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    instituteId: String,
    departmentId: mongoose.Schema.Types.ObjectId,
    paperName: String,
    attendanceInfo: [{
        year: Number,
        month: String,
        attendanceList: [{
            studentId: String,
            studentName: String,
            studentAttendance: [{
                day: Number,
                present: Boolean
            }]
        }]
    }]
})

const attendanceCol = new mongoose.model("attendanceCollection", attendanceSchema)

export default attendanceCol;