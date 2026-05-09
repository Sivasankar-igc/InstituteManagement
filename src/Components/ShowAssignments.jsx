import axios from "axios";
import { useState } from "react"
import { toast } from "react-toastify";
import ShowSubjects from "./ShowSubjects";
import CreateAssignment from "./CreateAssignment";
import AssignmentList from "./AssignmentList";
import { faArrowLeftLong, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ deptId, subjects, teacherName, type, isVisiting }) => { // type = admin, faculty, student

    const [assignmentList, setAssignmentList] = useState([])
    const [canAddAssignment, setCanAddAssignment] = useState(false)
    const [canShowAssignment, setCanShowAssignment] = useState(false)
    const [currentSubject, setCurrentSubject] = useState(null)

    const getAssignments = (subject) => {
        const encodedSubject = encodeURIComponent(subject)
        axios.get(`${type}/getAssignment/?deptId=${deptId}&subject=${encodedSubject}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                setAssignmentList(message)
                setCanShowAssignment(true)
                setCurrentSubject(subject)
            })
            .catch(err => {
                console.error(`Rettrieving assignment --> ${err}`)
                if (err.response.status === 404) return toast(err.response.data.message)
                toast("Network connection error")
            })
    }

    const addAssignment = (param) => {
        setAssignmentList([...assignmentList, param])
        setCanAddAssignment(false)
    }

    const removeAssignment = (param) => {
        let temp = [...assignmentList]
        temp = temp.filter(t => t._id !== param)
        setAssignmentList(temp)
    }

    return (
        <section className="departmentList-wrapper">
            <div className="header">
                <h2>Assignment List</h2>
            </div>
            <div className="content">
                <div className="departmentList-container">
                    {
                        !canShowAssignment && <ShowSubjects subjects={subjects} onClick={getAssignments} />
                    }
                </div>
                {
                    canShowAssignment && !canAddAssignment && <>
                        <div className="btn-container">
                            <button onClick={() => setCanShowAssignment(false)} className="close-btn blue-btn"> <FontAwesomeIcon icon={faArrowLeftLong} /> </button>
                            {!isVisiting && <button onClick={() => setCanAddAssignment(true)} className="create-btn" > <FontAwesomeIcon icon={faPlus} /> Create Assignment</button>}
                        </div>
                        <AssignmentList isVisiting={isVisiting} onRemove={removeAssignment} assignments={assignmentList} deptId={deptId} type={type} getAssignments={getAssignments} />
                    </>
                }
                {
                    canShowAssignment && canAddAssignment && <CreateAssignment onClose={() => setCanAddAssignment(false)} subject={currentSubject} teacherName={teacherName} addAssignment={addAssignment} />
                }
            </div>
        </section>
    )
}