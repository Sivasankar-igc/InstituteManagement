import express from "express"
import { createStudentAccount } from "../../Controllers/AdminControllers/Student/createStudentAccount.mjs"
import { modifyStudentAccount, removeStudentAccount } from "../../Controllers/AdminControllers/Student/handleStudentAccount.mjs"
import { modifyFacultyAccount, removeFacultyAccount } from "../../Controllers/AdminControllers/Faculty/handleFacultyAccount.mjs"
import createFacultyAccount from "../../Controllers/AdminControllers/Faculty/createFacultyAccount.mjs"
import createInstitute from "../../Controllers/AdminControllers/Institute/createInstitute.mjs"
import { postInstituteAnnouncement, removeInstituteAnnouncement } from "../../Controllers/AdminControllers/Institute/handleAnnouncement.mjs"
import { modifyInstituteAccount, removeSuperAdminAccount } from "../../Controllers/AdminControllers/Institute/handleAccount.mjs"
import { modifyAdminAccount, removeAdminAccount } from "../../Controllers/AdminControllers/Admin/handleAdminAccount.mjs"
import createDepartment from "../../Controllers/AdminControllers/Department/createDepartment.mjs"
import { modifyDepartment, removeDepartment } from "../../Controllers/AdminControllers/Department/handleDepartment.mjs"
import { postDeptAnnouncement, removeDeptAnnouncement } from "../../Controllers/AdminControllers/Department/handleAnnouncement.mjs"
import { addPaper, modifyPaper, removePaper } from "../../Controllers/AdminControllers/Department/handlePapers.mjs"
import { createDeptAdmin } from "../../Controllers/AdminControllers/Department/handllingAdmin.mjs"
import { createBatch, modifyBatch, removeBatch } from "../../Controllers/AdminControllers/Dept_Batches/handleBatches.mjs"
import { updateSemester } from "../../Controllers/AdminControllers/Dept_Batches/updateBatch.mjs"
import { postBatchAnnouncment, removeBatchAnnouncement } from "../../Controllers/AdminControllers/Dept_Batches/handleBatchAnnouncements.mjs"
import { getAssignment, removeAssignment } from "../../Controllers/AdminControllers/Dept_Batches/handleAssignment.mjs"
import { getExam, removeExam, resetExam, setExam } from "../../Controllers/AdminControllers/Dept_Batches/handleExam.mjs"
import { login } from "../../Controllers/AdminControllers/Admin/signin_login.mjs"
import getDepartment from "../../Controllers/AdminControllers/Department/getDepartment.mjs"
import getFacultyById from "../../Controllers/AdminControllers/Faculty/getFacultyById.mjs"
import getAdminByMail from "../../Controllers/AdminControllers/Admin/getAdminByMail.mjs"
import getBatchByName from "../../Controllers/AdminControllers/Dept_Batches/getBatchByName.mjs"
import getStudentInfos from "../../Controllers/AdminControllers/Student/getStudentInfos.mjs"
import getAssignments from "../../Controllers/getAssignments.mjs"
import checkPassword from "../../Controllers/AdminControllers/Admin/checkPassword.mjs"
import createAttendance from "../../Controllers/AdminControllers/Dept_Batches/createAttendance.mjs"

const router = express.Router()

// ADMIN ACCOUNT ROUTES
router.put("/modifyAdminAccount/:adminId", modifyAdminAccount) // done
router.post("/login", login) // done
router.get("/getAdminByMail", getAdminByMail) //done
router.delete("/removeAdminAccount", removeAdminAccount) // done


//DEPARTMENT ROUTES
router.route("/handleDepartment")
    .post(createDepartment) // done
    .put(modifyDepartment) // done
    .delete(removeDepartment) //done

router.route("/handleDepartmentAnnouncement/:departmentId")
    .post(postDeptAnnouncement) // done
    .delete(removeDeptAnnouncement) // done

router.route("/handleDepartmentPapers/:departmentId")
    .post(addPaper) // done
    .put(modifyPaper) // done
    .delete(removePaper) // done

router.post("/createDepartmentAdmin", createDeptAdmin)  // done
router.get("/getDepartment/:deptId", getDepartment) // done

router.post("/createDeptAdmin/:departmentId", createDeptAdmin) // done



//FACULTY ROUTES
router.post("/createFacultyAccount", createFacultyAccount) // done
router.route("/handleFacultyAccount")
    .patch(modifyFacultyAccount) // done
    .delete(removeFacultyAccount) // done

router.get("/getFaculty/:facultyId", getFacultyById)  // done




//STUDENT ROUTES
router.post("/createStudentAccount", createStudentAccount) // done
router.route("/handleStudentAccount")
    .put(modifyStudentAccount) // done
    .delete(removeStudentAccount)// done

router.post("/getStudentInfos", getStudentInfos) // done




//INSTITUTE ROUTES
router.post("/createInstitute", createInstitute) // done
router.patch("/modifyInstitute/:instituteId", modifyInstituteAccount) // done


router.route("/handleInstituteAnnouncement/:instituteId")
    .post(postInstituteAnnouncement) // done
    .delete(removeInstituteAnnouncement) // done




// SUPER ADMIN ROUTES
router.delete("/removeSuperAdminAccount/:instituteId", removeSuperAdminAccount) //done



//BATCH ROUTES
router.route("/handleBatch/:departmentId")
    .post(createBatch) // done
    .put(modifyBatch) // done
    .delete(removeBatch) // done
    .patch(updateSemester) // done

router.route("/handleBatchAnnouncement/:departmentId")
    .post(postBatchAnnouncment) //done
    .delete(removeBatchAnnouncement) //done

router.delete("/removeAssignment", removeAssignment) //done
router.get("/getAssignment", getAssignments)

router.route("/handleBatchExam")
    .patch(setExam)// done
    .delete(removeExam) // done
    .post(getExam) //done
    .get(resetExam)

router.post("/createAttendance", createAttendance); // done


router.get("/getBatchInfo", getBatchByName) // done

router.get("/checkPassword", checkPassword)

export { router }