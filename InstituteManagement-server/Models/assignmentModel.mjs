import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    teacherName: {
        firstName: String, lastName: String
    },
    date: String,
    time: String,
    assignment: String,
    subject: String,
    submissionDate: String,
    submissionTime: String,
    encodedTime: Number,
    studentList: [{
        studentName: Object,
        studentId: String,
        date: String,
        time: String,
        pdf: [],
        pdfLink: { type: String, default: "" }
    }]
})

const assignmentCol = new mongoose.model("assignmentCollection", assignmentSchema)

export default assignmentCol;