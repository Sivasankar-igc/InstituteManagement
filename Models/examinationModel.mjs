import mongoose from "mongoose";

const examinationSchema = new mongoose.Schema({
    questionsAndAnswers: [{
        question: String,
        answer: String,
        options: []
    }],
    paperName: { type: String, default: "" },
    fullMark: Number,
    date: { type: String, default: "NA" },
    time: { type: String, default: "NA" },
    encodedTime: { type: Number, default: 0 },
    duration: { type: Number, default: -1 },
    semester: { type: Number, default: -1 },
    adminRecog: { type: Boolean, default: false },
    examTimeOver: { type: Boolean, default: false },
    studentList: [{
        studentId: String,
        mark: Number,
        answers: []
    }]
})


// Creating indexes on date and time fields
examinationSchema.index({ date: 1, time: 1 })
examinationSchema.index({ examTimeOver: 1 })

const examinationCol = new mongoose.model("examinationCollection", examinationSchema)

export default examinationCol;