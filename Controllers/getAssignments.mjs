import departmentCol from "../Models/departmentModel.mjs";
import assignmentCol from "../Models/assignmentModel.mjs";

export default async (req, res) => {
    try {
        const { deptId, subject } = req.query;

        // Find the semester through deptid and paper name
        const findSemester = await departmentCol.findOne({ _id: deptId, "papers.name": subject }, { "papers.$": 1, _id: 0 })
        
        const semester = findSemester.papers[0].semester

        // Find the batch
        const batch = await departmentCol.findOne({ _id: deptId, "batches.semester": semester }, { "batches.$": 1, _id: 0 })

        if (!batch)
            return res.status(404).json({ status: false, message: "Batch not found" })

        const assignmentIds = batch.batches[0].assignments.map(ass => ass.assignmentId);

        if (assignmentIds.length === 0)
            return res.status(200).json({ status: true, message: [] })

        // Find the assignments by assignment ids
        const assignments = await assignmentCol.find({ _id: { $in: assignmentIds }, subject: subject })

        // if (assignments.length === 0)
        //     return res.status(404).json({ status: false, message: "Assignments couldn't be fetched" })

        res.status(200).json({
            status: true,
            message: assignments
        })

    } catch (error) {
        console.error(`Server error : Retrieving Assignments --> ${error}`)
        res.status(500).send()
    }
}