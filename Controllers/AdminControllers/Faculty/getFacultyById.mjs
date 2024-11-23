import facultyCol from "../../../Models/facultyModel.mjs";

export default async (req, res) => {
    try {
        const { facultyId } = req.params;
        const faculty = await facultyCol.findById(facultyId)

        res.status(200).json({
            status: faculty ? true : false,
            message: faculty ?? "Something went wrong"
        })

    } catch (error) {
        console.error(`Server error : retrieving faculty info --> ${error}`)
        res.status(500).send()
    }
}