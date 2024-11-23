import instituteCol from "../../../Models/instituteModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export const postInstituteAnnouncement = async (req, res) => {
    try {
        const {instituteId} = req.params;
        const { announcement } = req.body;

        if (!announcement)
            return res.status(200).json({ status: false, message: "Announcement can't be empty" })

        const message = {
            _id: Date.now(),
            announcement: announcement,
            date: generateDate(),
            time: generateTime()
        }

        const response = await instituteCol.findByIdAndUpdate(instituteId, {
            $push: {
                announcements: message
            }
        })

        res.status(200).json({
            status: response ? true : false,
            message: response ? message : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : posting announcement --> ${error}`)
        res.status(500).send()
    }
}

export const removeInstituteAnnouncement = async (req, res) => {
    try {
        const {instituteId} = req.params;
        const response = await instituteCol.findByIdAndUpdate(instituteId, { $pull: { announcements: { _id: req.query.announcementId } } })
        res.status(200).json({
            status: response ? true : false,
            message: response ? "Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing announcement --> ${error}`)
        res.status(500).send()
    }
}