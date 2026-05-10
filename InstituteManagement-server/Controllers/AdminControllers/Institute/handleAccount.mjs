import adminCol from "../../../Models/adminModel.mjs"
import departmentCol from "../../../Models/departmentModel.mjs"
import facultyCol from "../../../Models/facultyModel.mjs";
import instituteCol from "../../../Models/instituteModel.mjs";
import studentCol from "../../../Models/studentModel.mjs";

export const modifyInstituteAccount = async (req, res) => {
    try {
        const { instituteId } = req.params;

        const { instituteName } = req.body;

        if (!instituteName.trim())
            return res.status(200).json({ status: false, message: "Invalid Institute Name" })

        const response = await instituteCol.findByIdAndUpdate(instituteId, { $set: { instituteName: instituteName } }, { new: true })

        res.status(200).json({
            status: response !== null && response !== undefined,
            message: response ? "Institute Account modified successfully" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : Modifing Institute account -->${error}`)
        res.status(500).send()
    }
}

export const removeSuperAdminAccount = async (req, res) => {
    try {

        const { instituteId } = req.params;

        // Delete the institute account
        const instituteRes = await instituteCol.findByIdAndDelete(instituteId);

        // Check whether the institute is removed or not
        if (!instituteRes)
            return res.status(200).json({ status: false, message: "Institute Account couldn't be removed" })



        // Delete the admin account
        const adminRes = await adminCol.findOneAndDelete({ adminEmail: instituteRes.superAdminMail });

        if (!adminRes)
            return res.status(200).json({ status: false, message: "Admin account couldn't be removed" })



        // Retrieve all department Ids from related to institute
        const departmentIds = instituteRes.departments.map(dept => dept.departmentId)

        // Delete the departments and their informations based on their _id retrieved from the institute iff there exists any department under the institute
        if (departmentIds.length > 0) {

            const departments = await departmentCol.find({ _id: { $in: departmentIds } })


            // Delete all the department admins
            const dept_admin_mails = departments.map(department => department.adminMail)
            if (dept_admins > 0)
                await adminCol.deleteMany({ adminEmail: { $in: dept_admin_mails } })



            // Delete all student information
            await studentCol.deleteMany({ "studentDeptInfo.instituteId": instituteRes.instituteId })



            // Delete all faculty information
            await facultyCol.deleteMany({ "facultyDeptInfo.instituteId": instituteRes.instituteId })



            // Delete all the assignments
            const assignmentIds = departments.flatMap(dept => {
                dept.batches.flatMap(batch => {
                    batch.assignments.map(exam => exam.assignmentId)
                })
            })
            await assignmentCol.deleteMany({ _id: { $in: assignmentIds } })



            //Delete all the exams
            const examIds = departments.flatMap(dept => {
                dept.batches.flatMap(batch => {
                    batch.examinationList.map(exam => exam.examinationId)
                })
            })
            await examinationCol.deleteMany({ _id: { $in: examIds } })

            const departmentRes = await departmentCol.deleteMany({ _id: { $in: departmentIds } })

            return res.status(200).json({
                status: departmentRes.deletedCount > 0,
                message: departmentRes.deletedCount > 0 ? "Institute Account deleted with all its departments" : "Department Accounts Couldn't be removed"
            })
        }


        req.clearCookie("multiapp")
        res.status(200).json({
            status: true,
            message: "Institute Account Removed Successfully"
        })

    } catch (error) {
        console.error(`Server error : removing institute account --> ${error}`)
        res.status(500).send()
    }
}