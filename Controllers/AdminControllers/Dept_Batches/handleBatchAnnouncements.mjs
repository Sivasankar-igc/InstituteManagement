import departmentCol from "../../../Models/departmentModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export const postBatchAnnouncment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { batchName } = req.query;
        const { announcement } = req.body;

        if (!announcement)
            return res.status(200).json({ status: false, message: "Message can't be empty" })

        const message = {
            _id: Date.now(),
            announcement: announcement,
            date: generateDate(),
            time: generateTime()
        }

        const response = await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName }, { $push: { "batches.$.batchAnnouncements": message } })

        res.status(200).json({
            status: response.modifiedCount > 0,
            message: response.modifiedCount > 0 ? message : "Message couldn't be sent"
        })

    } catch (error) {
        console.error(`Server error : posting batch announcement --> ${error}`)
        res.status(500).send()
    }
}

export const removeBatchAnnouncement = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { batchName, announcementId } = req.query;
        const response = await departmentCol.updateOne({ _id: departmentId, "batches.batchName": batchName }, { $pull: { "batches.$.batchAnnouncements": { _id: announcementId } } })
        res.status(200).json({
            status: response.modifiedCount > 0,
            message: response.modifiedCount > 0 ? "Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing batch announcement --> ${error}`)
        res.status(500).send()
    }
}