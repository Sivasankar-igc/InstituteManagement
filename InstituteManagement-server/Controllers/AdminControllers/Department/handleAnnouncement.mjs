import departmentCol from "../../../Models/departmentModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export const postDeptAnnouncement = async (req, res) => {
    try {
        const { announcement } = req.body;

        if (!announcement)
            return res.status(200).json({ status: false, message: "Announcment can't be empty" })

        const message = {
            _id: Date.now(),
            announcement: announcement,
            date: generateDate(),
            time: generateTime()
        }

        const response = await departmentCol.findByIdAndUpdate(req.params.departmentId, {
            $push: {
                announcements: message
            }
        }, { new: true })

        res.status(200).json({
            status: response ? true : false,
            message: response ? message : "Message couldn't be sent"
        })
    } catch (error) {
        console.error(`Server error : posting department announcement --> ${error}`)
        res.status(500).send()

    }
}

export const removeDeptAnnouncement = async (req, res) => {
    try {
        const response = await departmentCol.findByIdAndUpdate(req.params.departmentId, { $pull: { announcements: { _id: req.query.announcementId } } })
        res.status(200).json({
            status: response ? true : false,
            message: response ? "Removed Successfully" : "Something went wrong"
        })
    } catch (error) {
        console.error(`Server error : removing department announcement --> ${error}`)
        res.status(500).send()
    }
}