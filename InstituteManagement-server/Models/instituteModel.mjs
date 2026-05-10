import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
    instituteId: { type: String, unique: true, requird: true },
    instituteName: String,
    institutePass: String,
    superAdminMail: String,
    creationDateAndTime: {
        time: String,
        date: String
    },
    announcements: [{
        _id: String,
        announcement: String,
        time: String,
        date: String
    }],
    departments: [{
        departmentId: mongoose.Schema.Types.ObjectId,
        departmentName: String
    }],
    premiumInfo: {
        isPremium: { type: Boolean, default: false },
        premiumPeriod: Number,
        startingDate: { type: String, default: "NA" },
        endingDate: { type: String, default: "NA" }
    }
}, { timestamps: true })

const instituteCol = new mongoose.model("instituteCollection", instituteSchema)
export default instituteCol;