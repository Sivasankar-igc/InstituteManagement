import departmentCol from "../../../Models/departmentModel.mjs";
import examinationCol from "../../../Models/examinationModel.mjs";
import { studentPushNotification_exam } from "../../../utils/generateMail.mjs";
import studentCol from "../../../Models/studentModel.mjs";
import mongoose from "mongoose";

export const getExam = async (req, res) => {
    try {
        const { examinationIds } = req.body;

        const ids = examinationIds.map(exam => exam.examinationId)
        const exams = await examinationCol.find({ _id: { $in: ids } })

        res.status(200).json({ status: exams.length > 0, message: exams })
    } catch (error) {
        console.error(`Server error : Retrieving exam --> ${error}`)
        res.status(500).send()
    }
}

export const setExam = async (req, res) => {
    try {
        const { deptId, instituteName, departmentName, headOfDepartment, examId, date, time, duration, semester, subject } = req.body;

        if (!examId || !date || !time || !duration)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        const hour = parseInt(time.split(":")[0])
        const minute = parseInt(time.split(":")[1])

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

        const response = await examinationCol.findByIdAndUpdate(examId, {
            $set: {
                date: date,
                time: ampmTime,
                encodedTime: encodedTime,
                duration: duration,
                adminRecog: true,
                semester: semester
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ?? "Something went wrong"
        })


        // Sending notification to students about the scheduled examination. 
        // Important: This should be done after sending the response to the admin to avoid any delay in response due to mail sending process. Hence, not awaiting the mail sending process.

        setTimeout(async () => {
            try {
                const department = await departmentCol.findOne(
                    {
                        _id: deptId,
                        "batches.semester": semester
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

                    const examInfo = {
                        paperName: subject,
                        examDate: date,
                        examTime: ampmTime,
                        duration: duration,
                        batchName: department.batches[0].batchName
                    };

                    await Promise.all(
                        students.map((student) =>
                            studentPushNotification_exam(
                                deptInfo,
                                examInfo,
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
        console.error(`Server error : setting exam --> ${error}`)
        res.status(500).send()
    }
}

export const removeExam = async (req, res) => {
    try {
        const { departmentId, batchName, examId } = req.query;

        const questionPaperRes = await examinationCol.findByIdAndDelete(examId)

        if (questionPaperRes.deletedCount === 0)
            return res.status(200).json({ status: false, message: "Something went wrong" })


        const response = await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName }, { $pull: { "batches.$.examinationList": { examinationId: examId } } })

        if (response) {

        }

        res.status(200).json({
            status: response.modifiedCount > 0,
            message: response.modifiedCount > 0 ? "Exam Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing the exam --> ${error}`)
        res.status(500).send()
    }
}

export const resetExam = async (req, res) => {
    try {
        const { examId } = req.query;
        const response = await examinationCol.findByIdAndUpdate(examId, {
            $set: {
                date: "NA",
                time: "NA",
                encodedTime: 0,
                duration: -1,
                adminRecog: false
            }
        })
        res.status(200).json({
            status: response ? true : false,
            message: response ? "Exam Reset" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : resetting exam --> ${error}`)
        res.status(500).send()
    }
}