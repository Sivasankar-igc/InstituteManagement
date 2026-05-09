import assignmentCol from "../../Models/assignmentModel.mjs";
import departmentCol from "../../Models/departmentModel.mjs";
import studentCol from "../../Models/studentModel.mjs";
import { generateDate } from "../../utils/generateDate.mjs"
import { generateTime } from "../../utils/generateTime.mjs"
import { studentPushNotification_assignment } from "../../utils/generateMail.mjs";
import mongoose from "mongoose";


export const createAssignment = async (req, res) => {
    try {
        const { deptId } = req.query;
        const { instituteName, departmentName, headOfDepartment, teacherName, subject, submissionDate, submissionTime, assignment } = req.body;

        if (!teacherName || !subject || !submissionDate || !submissionTime || !assignment)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        let findSemester = await departmentCol.findOne({ _id: deptId, "papers.name": subject }, { "papers.$": 1, _id: 0 });

        if (!findSemester)
            return res.status(404).json({ status: false, message: "Paper couldn't be found" })

        const hour = parseInt(submissionTime.split(":")[0])
        const minute = parseInt(submissionTime.split(":")[1])

        let ampmTime = ""

        if (hour == 12) {
            ampmTime = hour + ":" + minute + " PM"
        }
        else if (hour > 12) {
            ampmTime = (hour - 12) + ":" + minute + " PM"
        } else if (hour == 0) {
            ampmTime = "12" + ":" + minute + " AM"
        } else {
            ampmTime = hour + ":" + minute + " AM"
        }

        const encodedTime = (hour * 60) + minute

        const assignmentData = new assignmentCol({
            teacherName,
            date: generateDate(),
            time: generateTime(),
            assignment,
            subject,
            submissionTime: ampmTime,
            submissionDate,
            encodedTime
        })

        const assRes = await assignmentData.save()

        if (!assRes)
            return res.status(200).json({ status: false, message: "Something went wrong!!!" })


        const response = await departmentCol.updateOne({ _id: deptId, "batches.semester": findSemester.papers[0].semester }, { $push: { "batches.$.assignments": { assignmentId: assRes._id } } })

        if (response.modifiedCount === 0) {
            await assignmentCol.findByIdAndDelete(assRes._id)
            return res.status(200).json({ status: false, message: "Something went wrong!!!" })
        }

        res.status(201).json({ status: true, message: assRes });

        setTimeout(async () => {
            try {
                const department = await departmentCol.findOne(
                    {
                        _id: deptId,
                        "batches.semester": findSemester.papers[0].semester
                    },
                    {
                        "batches.$": 1
                    }
                );

                const studentIds =
                    department?.batches?.[0]?.studentList?.map(
                        (student) => student.studentId
                    ) || [];

                const students = await studentCol.find(
                    {
                        _id: { $in: studentIds }
                    },
                    {
                        studentEmail: 1,
                        studentName: 1
                    }
                );

                if (students.length > 0) {
                    const deptInfo = {
                        instituteName,
                        departmentName,
                        headOfDepartment
                    };

                    const assignmentInfo = {
                        paperName: subject,
                        submissionDate,
                        submissionTime,
                        batchName: department.batches[0].batchName
                    };

                    await Promise.all(
                        students.map((student) =>
                            studentPushNotification_assignment(
                                deptInfo,
                                assignmentInfo,
                                {
                                    studentEmail: student.studentEmail,
                                    studentName: student.studentName
                                }
                            )
                        )
                    );
                }
            } catch (error) {
                console.error(
                    `Server error : sending assignment notification --> ${error}`
                );
            }
        }, 0);

        return;
    } catch (error) {
        console.error(`Server error : assignment creation --> ${error}`)
        res.status(500).send()
    }
}

export const modifyAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { assignment, duration } = req.body;

        if (!assignment || !duration)
            return res.status(200).json({ status: false, message: "All fields must be filled" })

        const response = await assignmentCol.findByIdAndUpdate(assignmentId, { $set: { assignment: assignment, duration: duration } }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ?? "Assignment couldn't be modifed"
        })

    } catch (error) {
        console.error(`Server error : modifing assignment --> ${error}`)
        res.status(500).send()
    }
}

export const removeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { departmentId, subject } = req.query;

        // Find the semester through deptid and paper name
        const findSemester = await departmentCol.findOne({ _id: departmentId, "papers.name": subject }, { "papers.$": 1, _id: 0 })
        const semester = findSemester.papers[0].semester

        const batchRes = await departmentCol.updateOne({ _id: departmentId, "batches.semester": semester }, { $pull: { "batches.$.assignments": { assignmentId: assignmentId } } })

        if (batchRes.modifiedCount === 0)
            return res.status(200).json({ status: false, message: "Something went wrong" })

        const response = await assignmentCol.findByIdAndDelete(assignmentId)

        if (!response) {
            await departmentCol.updateOne({ _id: departmentId, "batches.semester": semester }, { "batches.$.assignments": { $push: { assignmentId: assignmentId } } })
            return res.status(200).json({ status: false, message: "Something went wrong" })
        }

        return res.status(200).json({ status: true, message: "Assignment removed successfully" })

    } catch (error) {
        console.error(`Server error: removing assignment --> ${error}`)
        res.status(500).send()
    }
}