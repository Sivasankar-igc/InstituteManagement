import adminCol from "../../../Models/adminModel.mjs";
import assignmentCol from "../../../Models/assignmentModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";
import examinationCol from "../../../Models/examinationModel.mjs";
import facultyCol from "../../../Models/facultyModel.mjs";
import instituteCol from "../../../Models/instituteModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";

export const modifyDepartment = async (req, res) => {
    try {
        const { departmentId, instituteId } = req.query;
        const { deptName, hod: headOfDepartment } = req.body;

        const departmentName = deptName.trim().toUpperCase()

        if (!departmentName || !headOfDepartment)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        if (!new RegExp("^[a-zA-Z][a-zA-Z.\\s]+[a-zA-Z]+$").test(headOfDepartment.trim()))
            return res.status(200).json({ status: false, message: "Invalid Head Of Department" })

        // Find the institute document
        const institute = await instituteCol.findById(instituteId);

        if (!institute)
            return res.status(400).json({ status: true, message: "Institute Not Found" })

        // Check whether there exists any department in the institute with the same department name but different id
        const departmentExists = institute.departments.find(dept => dept.departmentId.toString() !== departmentId && dept.departmentName === departmentName)

        if (departmentExists)
            return res.status(200).json({ status: false, message: "Department Exists." })

        const d_response = await departmentCol.findByIdAndUpdate(departmentId, {
            $set: {
                departmentName: departmentName,
                headOfDepartment: headOfDepartment
            }
        }, { new: true })

        if (d_response) {
            const instituteRes = await instituteCol.updateOne({ _id: instituteId, "departments.departmentId": departmentId }, {
                $set: {
                    "departments.$.departmentName": departmentName
                }
            })
            if (instituteRes.modifiedCount > 0) { // CHECK WHETHER THE DEPARTMENT NAME IS MODIFIED IN ADMIN DOCUMENT
                res.status(200).json({
                    status: true,
                    message: "Department Modified Successfully"
                })
            } else {
                await departmentCol.findByIdAndUpdate(departmentId, {
                    $set: {
                        departmentName: departmentName,
                        headOfDepartment: headOfDepartment.trim()
                    }
                })

                res.status(200).json({
                    status: false,
                    message: "Something went wrong"
                })
            }
        } else {
            res.status(200).json({
                status: false,
                message: "Something went wrong"
            })
        }
    } catch (error) {
        console.error(`Server error : modifing department --> ${error}`)
        res.status(500).send()
    }
}

export const removeDepartment = async (req, res) => {
    try {
        const { departmentId, instituteId } = req.query;

        const dept_response = await departmentCol.findByIdAndDelete(departmentId)

        if (!dept_response)
            return res.status(200).json({
                status: false, message: "Department coudln't be removed"
            })


        // Pull the department Id from the institute department list
        await instituteCol.findOneAndUpdate({ instituteId: instituteId }, { $pull: { departments: { departmentId: departmentId } } })

        // Delete all student information
        await studentCol.deleteMany({ "studentDeptInfo.departmentId": departmentId, "studentDeptInfo.instituteId": instituteId })

        // Delete all faculty information
        await facultyCol.deleteMany({ "facultyDeptInfo.departmentId": departmentId, "facultyDeptInfo.instituteId": instituteId })

        // Delete all the assignments
        const assignmentIds = dept_response.batches.flatMap(batch => {
            batch.assignments.map(assignment => assignment.assignmentId)
        })
        await assignmentCol.deleteMany({ _id: { $in: assignmentIds } })

        //Delete all the exams
        const examIds = dept_response.batches.flatMap(batch => {
            batch.examinationList.map(exam => exam.examinationId)
        })
        await examinationCol.deleteMany({ _id: { $in: examIds } })


        // Delete the department admin account if exists
        if (dept_response.adminMail !== "")
            await adminCol.findOneAndDelete({ adminEmail: dept_response.adminMail })


        return res.status(200).json({
            status: true, message: "Department Remvoed Successfully"
        })
    } catch (error) {
        console.error(`Server errro : removing department --> ${error}`)
        res.status(500).send()
    }
}