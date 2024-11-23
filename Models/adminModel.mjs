import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminEmail: { type: String, unique: true, required: true },
    adminFirstName: String,
    adminLastName: String,
    adminPass: String,
    designation: String,
    mobileNumber: { type: String, required: true, unique: true },
    instituteId: String,
    departmentId: { type: mongoose.Schema.Types.ObjectId, default: null } // store the department id iff the admin is a dept admin
}, { timestamps: true })


const adminCol = new mongoose.model("adminCollection", adminSchema)
export default adminCol;
