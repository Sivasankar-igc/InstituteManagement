import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShowStudent from "../Components/ShowStudent";
import ShowInstitute from "../Components/ShowInstitute";
import Announcement from "../Components/Announcement";
import ShowAssignments from "../Components/ShowAssignments";
import ShowStudentExams from "../Components/Student/ShowStudentExams";
import ResumeScanner from "../Components/Student/ResumeScanner";
import CareerBot from "../Components/Student/careerBot";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { useSideBarActiveContext } from "../Context_API/SideBarActivation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faRobot } from "@fortawesome/free-solid-svg-icons";

const StudentPage = () => {

    const { data: studentData } = useSelector(state => state.student)
    const { data: departmentData } = useSelector(state => state.department)
    const { data: instituteData } = useSelector(state => state.institute)
    const { data: batchData } = useSelector(state => state.batch)

    const { logout } = useAuthenticateContext()

    const navigate = useNavigate()

    const [showField, setShowField] = useState("account")
    const [subjects, setSubjects] = useState([])

    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext()

    useEffect(() => {
        let temp = []
        departmentData.papers.map(({ name, semester }) => {
            if (semester === batchData.semester) temp.push(name)
        })
        setSubjects(temp)
    }, [departmentData])

    const toggleSidebar = () => {
        setActiveSideBar(!activeSideBar)
    };

    const showPanelContent = (content) => {
        setShowField(content)
        toggleSidebar()
    }

    return (
        <section className="user-panel">
            <div className="hamburger-menu">
                <button className="hamburger-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faCompass} spin />
                </button>
            </div>
            <div className={`sidebar ${activeSideBar ? "active" : ""}`}>
                <h2>Student DashBoard</h2>
                <button onClick={() => showPanelContent("account")} className={`panel-buttton ${showField === "account" && "active"}`} >My Account</button>
                <button onClick={() => showPanelContent("institute")} className={`panel-buttton ${showField === "institute" && "active"}`}>Institute</button>
                <button onClick={() => showPanelContent("instituteAnn")} className={`panel-buttton ${showField === "instituteAnn" && "active"}`}>Institute Announcement</button>
                <button onClick={() => showPanelContent("batchAnn")} className={`panel-buttton ${showField === "batchAnn" && "active"}`}>Batch Announcement</button>
                <button onClick={() => showPanelContent("exams")} className={`panel-buttton ${showField === "exams" && "active"}`}>Exams</button>
                <button onClick={() => showPanelContent("assignments")} className={`panel-buttton ${showField === "assignments" && "active"}`}>Assignments</button>
                <button onClick={() => navigate(`/institute/${instituteData.instituteId}/department/${departmentData.departmentName}`)} >Department</button>
                <button onClick={() => showPanelContent("chatbot")} className={`panel-buttton ${showField === "chatbot" && "active"}`}>AI Career Bot</button>
                <button onClick={() => showPanelContent("resumeScanner")} className={`panel-buttton ${showField === "resumeScanner" && "active"}`}>Resume Scanner</button>
                <button onClick={logout} >Logout</button>
            </div>
            <div className="main-content">
                {showField === "account" && <ShowStudent student={studentData} />}
                {showField === "instituteAnn" && <Announcement deptId={departmentData._id} announcements={instituteData.announcements} batchName={null} type={null} instituteId={instituteData.instituteId} />}
                {showField === "batchAnn" && <Announcement deptId={departmentData._id} announcements={batchData?.batchAnnouncements} batchName={batchData?.batchName} type={"Batch"} />}
                {showField === "assignments" && <ShowAssignments deptId={departmentData._id} subjects={subjects} teacherName={null} type={"student"} isVisiting={true} />}
                {showField === "institute" && <ShowInstitute />}
                {showField === "resumeScanner" && <ResumeScanner />}
                {showField === "chatbot" && <CareerBot />}
                {showField === "exams" && <ShowStudentExams batchName={batchData.batchName} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={subjects} />}
            </div>
        </section>
    )
}

export default StudentPage