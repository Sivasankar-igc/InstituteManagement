import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { removeExam_batch } from "../Redux_Components/Features/batchSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import PopWindow from "./Others/PopWindow";
import FormPopUp from "./Others/FormPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRotate, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default ({ exams, deptId, setExams, getExams }) => {

    const dispatch = useDispatch()

    const { data: admin } = useSelector(state => state.admin)
    const { data: deptData } = useSelector(state => state.department)
    const { data: instidata } = useSelector(state => state.institute)
    const { data: batchData } = useSelector(state => state.batch)

    const { setIsRemoving, setIsloading, isloading, isRemoving } = useLoadingContext()

    const [updatingExam, setUpdatingExam] = useState(null)

    const [removeExam_id, setRemoveExam_id] = useState(null)
    const [resetExam_id, setResetExam_id] = useState(null)

    const removeExam = (examId) => {
        setIsRemoving(true)
        const encodedBatch = encodeURIComponent(batchData.batchName)

        axios.delete(`admin/handleBatchExam/?departmentId=${deptId}&batchName=${encodedBatch}&examId=${examId}`)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(removeExam_batch(examId));
                    getExams(exams[0].paperName)
                }
                toast(message)
            })
            .catch(err => {
                console.error(`Removing exam --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
                setRemoveExam_id(null)
            })
    }

    const saveUpdates = (e) => {
        e.preventDefault()
        if (parseInt(updatingExam.hour) === 0 && parseInt(updatingExam.minute) === 0) return toast("Set the exam duration")
        // else if (!new RegExp("^[0-9][0-9]{0,}$").test(updatingExam.hour)) return toast("Invalid Exam Duration")
        // hour and minute validation will be checked later
        else {
            let duration = (parseInt(updatingExam.hour) * 60) + parseInt(updatingExam.minute)
            setIsloading(true)

            axios.patch(`admin/handleBatchExam`, { deptId, instituteName: instidata.instituteName, departmentName: deptData.departmentName, headOfDepartment: deptData.headOfDepartment, examId: updatingExam._id, date: updatingExam.date, time: updatingExam.time, duration: duration, semester:batchData.semester, subject: updatingExam.subject })
                .then(res => {
                    const { status, message } = res.data;
                    if (!status) return toast(message``)
                    if (status) {
                        let temp = [...exams]
                        temp.forEach(t => {
                            if (t._id === updatingExam._id) {
                                t.date = message.date;
                                t.time = message.time;
                                t.duration = duration;
                                t.encodedTime = message.encodedTime;
                                t.adminRecog = true
                            }
                        })

                        setExams([...temp])
                        setUpdatingExam(null)
                        toast("Exam Set")
                    }
                })
                .catch(err => {
                    console.error(`Updating exam --> ${err}`)
                    toast("Network connection error")
                })
                .finally(() => {
                    setIsloading(false)
                })
        }
    }

    const resetExam = (examId) => {
        setIsloading(true)

        axios.get(`admin/handleBatchExam/?examId=${examId}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    let temp = [...exams]
                    temp.forEach(t => {
                        if (t._id === examId) {
                            t.date = "NA";
                            t.time = "NA";
                            t.duration = -1;
                            t.adminRecog = false;
                            t.encodedTime = 0;
                        }
                    })
                    setExams([...temp])
                }
            })
            .catch(err => {
                console.error(`Resetting exam --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setResetExam_id(null)
                setIsloading(false)
            })
    }

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setUpdatingExam({
            ...updatingExam,
            [name]: value
        })
    }

    const formElems = [
        { type: "date", name: "date", onChange: (e) => handleChanges(e), label: "Exam Date" },
        { type: "time", name: "time", onChange: (e) => handleChanges(e), label: "Exam Time" },
        { type: "number", name: "hour", onChange: (e) => handleChanges(e), label: "Duration (Hour)", placeholder: "Duration in hour" },
        { type: "number", name: "minute", onChange: (e) => handleChanges(e), label: "Duration (Minute)", placeholder: "Duration in minutes" },
    ]

    return (
        exams.length > 0
            ? <table>
                {removeExam_id && <PopWindow userType={"Exam"} onClose={() => setRemoveExam_id(null)} onProceed={() => removeExam(removeExam_id)} />}
                {resetExam_id && <PopWindow userType={"Exam"} onClose={() => setResetExam_id(null)} onProceed={() => resetExam(resetExam_id)} />}
                {updatingExam && <FormPopUp formElems={formElems} onClose={() => setUpdatingExam(null)} onSubmit={(e) => saveUpdates(e)} />}
                <thead>
                    <tr>
                        <th>Sl No.</th>
                        <th>Paper</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Student List</th>
                        {admin && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        exams.map((exam, index) => (
                            <tr key={exam._id} >
                                <td>{index + 1}</td>
                                <td>
                                    <Link
                                        to={`/institute/${instidata.instituteId}/department/${deptData.departmentName}/exam/${exam._id}`}
                                        state={{ deptId: deptId, subject: exam.paperName, examData: exam }} >
                                        Visit
                                    </Link>
                                </td> {/*Visit the question paper*/}
                                <td>
                                    <p>{exam.date}</p>
                                </td>
                                <td>
                                    <p>{exam.time}</p>
                                </td>
                                <td>
                                    <p>{exam.duration === -1 ? "NA" : `${Math.floor(exam.duration / 60)} hour ${exam.duration % 60} minutes`}</p>
                                </td>
                                <td>
                                    <Link
                                        to={`/institute/${instidata.instituteId}/department/${deptData.departmentName}/exam/${exam._id}/studentList`}
                                        state={exam}>Visit</Link>
                                </td> {/*Visit the student*/}
                                {admin && <td>
                                    {
                                        exam.adminRecog
                                            ? <button onClick={() => setResetExam_id(exam._id)} className="violet-btn table-btn tiny-btn" disabled={isloading || isRemoving}>
                                                <FontAwesomeIcon icon={isloading ? faSpinner : faRotate} spin={isloading} />
                                            </button>
                                            : <button
                                                onClick={() => setUpdatingExam({ ...exam, date: "", time: "", hour: 0, minute: 0, subject: exam.paperName })}
                                                className="violet-btn table-btn tiny-btn"
                                                disabled={isloading || isRemoving}
                                            >
                                                <FontAwesomeIcon icon={isloading ? faSpinner : faEdit} spin={isloading} />
                                            </button>
                                    }
                                    <button onClick={() => setRemoveExam_id(exam._id)} className="cancel-btn table-btn tiny-btn" disabled={isloading || isRemoving} >
                                        <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                    </button>
                                </td>}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            : <p>Exam List is empty</p>
    )
}