import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentName: {
        firstName: String,
        lastName: String
    },
    studentEmail: String,
    studentPass: String,
    studentId: { type: String, required: true },
    studentDOB: String,
    studentDeptInfo: {
        instituteId: String,
        departmentId: mongoose.Schema.Types.ObjectId,
        batchName: String
    }
})

const studentCol = new mongoose.model("studentCollection", studentSchema)
export default studentCol;