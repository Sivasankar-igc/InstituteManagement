import departmentCol from "../../../Models/departmentModel.mjs";
import instituteCol from "../../../Models/instituteModel.mjs";
import { generateDate } from "../../../utils/generateDate.mjs";
import { generateTime } from "../../../utils/generateTime.mjs";

export default async (req, res) => {
    try {
        const { departmentInfo, instituteInfo } = req.body;
        const { departmentName, hod: headOfDepartment } = departmentInfo;

        if (!departmentName || !headOfDepartment)
            return res.status(200).json({ status: false, message: "All required fields must be filled" })

        // CHECK WHETHER THERE IS ANY DEPARTMENT EXISTS WITH THE SAME NAME
        const departmentExists = instituteInfo.departments.find(department => department.departmentName === departmentName.trim().toUpperCase())

        if (departmentExists) {
            return res.status(200).json({ status: false, message: "Department Exists" })
        } else {
            const department = new departmentCol({
                departmentName: departmentName.trim().toUpperCase(),
                headOfDepartment,
                creationDate: {
                    date: generateDate(),
                    time: generateTime()
                }
            })

            const response = await department.save()

            if (response) {
                // PUSH THE DEPARTMENT ID AND NAME TO THE ADMIN DEPARTMENT ARRAY
                const instituteResponse = await instituteCol.findByIdAndUpdate(instituteInfo._id, {
                    $push: {
                        departments: {
                            departmentId: response._id,
                            departmentName: departmentName.toUpperCase()
                        }
                    }
                }, { new: true })

                if (instituteResponse) {
                    res.status(200).json({
                        status: true,
                        message: {
                            departmentId: response._id,
                            departmentName: departmentName.toUpperCase()
                        }
                    })
                } else {
                    await departmentCol.findByIdAndDeleteOne(response._id)
                    res.status(200).json({
                        status: false,
                        message: "Something went wrong"
                    })
                }
            } else {
                return res.status(200).json({ status: false, message: "Department couldn't be created" })
            }
        }
    } catch (error) {
        console.error(`Server error : department creation error --> ${error}`)
        res.status(500).send()
    }
}