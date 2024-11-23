import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    facultyName: {
        firstName: String,
        lastName: String
    },
    facultyEmail: { type: String, required: true },
    facultyPass: String,
    designation: String,
    facultyId: String,
    subjects: [],
    facultyDeptInfo: {
        instituteId: String,
        departmentId: mongoose.Schema.Types.ObjectId,
    }
})

const facultyCol = new mongoose.model("facultyCollections", facultySchema)
export default facultyCol;