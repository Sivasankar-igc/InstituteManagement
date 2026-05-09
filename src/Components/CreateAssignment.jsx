import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import FormPopUp from "./Others/FormPopUp";

export default ({ subject, teacherName, onClose, addAssignment }) => {

    const { setIsloading } = useLoadingContext()
    const { data: departmentData } = useSelector(state => state.department)
    const { data: instituteData } = useSelector(state => state.institute)

    const [assignmentInfo, setAssignmentInfo] = useState({
        teacherName: teacherName,
        subject: subject,
        assignment: "",
        submissionDate: "",
        submissionTime: ""
    })

    const limitHour = useRef()
    const limitMin = useRef()

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "hour" || name === "minute") {
            if (limitHour.current.value.length > 2) return limitHour.current.value = limitHour.current.value.slice(0, 2)
            else if (limitMin.current.value.length > 2) return limitMin.current.value = limitMin.current.value.slice(0, 2)
        }

        setAssignmentInfo({
            ...assignmentInfo,
            [name]: value
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsloading(true)

        axios.post(`faculty/createAssignment/?deptId=${departmentData._id}`, {
            instituteName: instituteData.instituteName,
            departmentName: departmentData.departmentName,
            headOfDepartment: departmentData.headOfDepartment,
            teacherName,
            subject,
            assignment: assignmentInfo.assignment,
            submissionDate: assignmentInfo.submissionDate,
            submissionTime: assignmentInfo.submissionTime
        })
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)
                addAssignment(message)
            })
            .catch(err => {
                if (err.response.status === 404) return toast(err.response.data.message)
                console.log(`Posting assignment --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))

    }

    const formElems = [
        { type: "text", defaultValue: `${teacherName.firstName} ${teacherName.lastName}`, name: "teacherName", onChange: null, placeholder: null, disabled: true, label: "Teacher Name" },
        { type: "text", defaultValue: subject, name: "subject", onChange: null, placeholder: null, disabled: true, label: "Subject" },
        { type: "text", defaultValue: assignmentInfo.assignment, name: "assignment", onChange: handleChange, placeholder: "Type the assignment", disabled: false, label: "Assignment" },
        { type: "date", defaultValue: assignmentInfo.submissionDate, name: "submissionDate", onChange: handleChange, placeholder: null, disabled: false, label: "Submission Date" },
        { type: "time", defaultValue: assignmentInfo.submissionTime, name: "submissionTime", onChange: handleChange, placeholder: null, disabled: false, label: "Submission Time" }
    ]

    return (
        <FormPopUp formElems={formElems} onSubmit={handleSubmit} onClose={onClose} />
    )
}