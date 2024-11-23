import assignmentCol from "../../../Models/assignmentModel.mjs";
import departmentCol from "../../../Models/departmentModel.mjs";

export const removeAssignment = async (req, res) => {
    try {
        const { departmentId, batchName, assignmentId } = req.query;
        const assignmentRes = await assignmentCol.findByIdAndDelete(assignmentId);

        if (!assignmentRes)
            return res.status(200).json({ status: false, message: "Assignment couldn't be removed" })

        const response = await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName }, { $set: { "batches.$.assignments": { assignmentId: assignmentId } } })


        res.status(200).json({ status: response.modifiedCount > 0, message: response.modifiedCount > 0 ? "Assignment removed successfully" : "Assignment couldn't be removed" })
    } catch (error) {
        console.error(`Server error : removing assignment --> ${error}`)
        res.status(500).send()
    }
}

export const getAssignment = async (req, res) => {
    try {
        const {assignmentId} = req.params;
        const assignment = await assignmentCol.findById(assignmentId)
        res.status(assignment ? 200 : 400).json({ status: assignment ? true : false, message: assignment ?? "Assignment not found" })
    } catch (error) {
        console.error(`Server error : retrieving assignment --> ${error}`)
        res.status(500).send()
    }
}