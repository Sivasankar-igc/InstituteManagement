import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    headOfDepartment: { type: String, required: true },
    creationDate: {
        date: String,
        time: String
    },
    announcements: [
        {
            _id: String,
            announcement: String,
            date: String,
            time: String
        }
    ],
    papers: [
        {
            name: { type: String, required: true },
            semester: Number
        }
    ],
    facultyList: [
        {
            facultyId: mongoose.Schema.Types.ObjectId,
            facultyDeptId: String
        }
    ],
    adminMail: { type: String, default: "", required: false }, // Each department can have two admins 1. Super admin 2. Dept Admin. Not necessary to set an admin for a department
    batches: [
        {
            batchName: { type: String, required: true },
            semester: Number,
            creationDate: {
                time: String,
                date: String
            },
            batchAnnouncements: [{
                _id: String,
                announcement: String,
                date: String,
                time: String
            }],
            studentList: [{
                studentId: mongoose.Schema.Types.ObjectId
            }],
            assignments: [{
                assignmentId: mongoose.Schema.Types.ObjectId
            }],
            examinationList: [{
                examinationId: mongoose.Schema.Types.ObjectId
            }]
        }
    ]
}, { timestamps: true })

const departmentCol = new mongoose.model("departmentCollection", departmentSchema)

export default departmentCol