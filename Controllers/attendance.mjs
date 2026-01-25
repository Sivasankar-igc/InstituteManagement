import attendanceCol from "../Models/attendanceModel.mjs";

export const getAttendance = async (req, res) => {
    try {
        const { instituteId, departmentId, subject, year, month } = req.params;

        const response = await attendanceCol.findOne(
            {
                instituteId: instituteId,
                departmentId: departmentId,
                paperName: subject,
                "attendanceInfo.year": year,
                "attendanceInfo.month": month
            },
            {
                "attendanceInfo": { $elemMatch: { year: year, month: month } },
            }
        )

        res.status(200).json({
            status: response !== null || response !== undefined,
            message: response !== null || response !== undefined ? response.attendanceInfo[0]?.attendanceList : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : retrieve attendance --> ${error}`)
        res.status(500).send()
    }
}

export const takeAttendance = async (req, res) => {
    try {
        const { instituteId, deptId, paperName, year, month, attendanceList } = req.body;

        const response = await attendanceCol.updateOne(
            {
                instituteId: instituteId,
                departmentId: deptId,
                paperName: paperName,
                "attendanceInfo.year": year,
                "attendanceInfo.month": month,
            },
            {
                $set: {
                    "attendanceInfo.$.attendanceList": attendanceList,
                },
            }
        );

        return res.status(200).json({
            status: response !== null,
            message: response ? "Attendance Saved Successfully" : "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : taking attendance --> ${error}`)
        res.status(500).send()
    }
}