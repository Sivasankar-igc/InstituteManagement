import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShowStudent from "../Components/ShowStudent";
import ShowInstitute from "../Components/ShowInstitute";
import Announcement from "../Components/Announcement";
import ShowAssignments from "../Components/ShowAssignments";
import ShowStudentExams from "../Components/Student/ShowStudentExams";
import MockExamBot from "../Components/Student/MockExamBot";
import CareerBot from "../Components/Student/careerBot";
import ResumeScanner from "../Components/Student/ResumeScanner";
import { useAuthenticateContext } from "../Context_API/Authentication";
import {
    faUser, faBuilding, faBullhorn, faClipboardList, faFileAlt,
    faLayerGroup, faRightFromBracket, faRobot, faMagnifyingGlass, faBrain
} from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../Components/Others/DashboardLayout";

const StudentPage = () => {
    const { data: studentData } = useSelector(state => state.student);
    const { data: departmentData } = useSelector(state => state.department);
    const { data: instituteData } = useSelector(state => state.institute);
    const { data: batchData } = useSelector(state => state.batch);
    const { logout } = useAuthenticateContext();
    const navigate = useNavigate();

    const [showField, setShowField] = useState("account");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const temp = [];
        departmentData?.papers?.forEach(({ name, semester }) => {
            if (semester === batchData?.semester) temp.push(name);
        });
        setSubjects(temp);
    }, [departmentData]);

    const navItems = [
        { key: "account",      label: "My Account",             icon: faUser,          onClick: () => setShowField("account") },
        { key: "institute",    label: "Institute",               icon: faBuilding,      onClick: () => setShowField("institute") },
        { key: "instituteAnn", label: "Institute Announcements", icon: faBullhorn,      onClick: () => setShowField("instituteAnn") },
        { key: "batchAnn",     label: "Batch Announcements",     icon: faBullhorn,      onClick: () => setShowField("batchAnn") },
        { key: "exams",        label: "Exams",                   icon: faFileAlt,       onClick: () => setShowField("exams") },
        { key: "assignments",  label: "Assignments",             icon: faClipboardList, onClick: () => setShowField("assignments") },
        { key: "dept",         label: "Department",              icon: faLayerGroup,    onClick: () => navigate(`/institute/${instituteData.instituteId}/department/${departmentData.departmentName}`) },
        { key: "mockExam",     label: "Mock Exam AI",            icon: faBrain,         onClick: () => setShowField("mockExam") },
        { key: "chatbot",      label: "Career Guidance AI",      icon: faRobot,         onClick: () => setShowField("chatbot") },
        { key: "resumeScanner",label: "Resume Scanner AI",       icon: faMagnifyingGlass,    onClick: () => setShowField("resumeScanner") },
    ];

    const bottomItems = [
        { key: "logout", label: "Log Out", icon: faRightFromBracket, onClick: logout, danger: true },
    ];

    return (
        <DashboardLayout
            title="Student Dashboard"
            subtitle={`${studentData?.studentName?.firstName || ""} ${studentData?.studentName?.lastName || ""}`.trim()}
            icon={faUser}
            navItems={navItems}
            bottomItems={bottomItems}
            activeKey={showField}
            pageTitle="Student Dashboard"
        >
            {showField === "account"       && <ShowStudent student={studentData} />}
            {showField === "institute"     && <ShowInstitute />}
            {showField === "instituteAnn"  && <Announcement deptId={departmentData._id} announcements={instituteData.announcements} batchName={null} type={null} instituteId={instituteData.instituteId} />}
            {showField === "batchAnn"      && <Announcement deptId={departmentData._id} announcements={batchData?.batchAnnouncements} batchName={batchData?.batchName} type="Batch" />}
            {showField === "assignments"   && <ShowAssignments deptId={departmentData._id} subjects={subjects} teacherName={null} type="student" isVisiting={true} />}
            {showField === "exams"         && <ShowStudentExams batchName={batchData.batchName} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={subjects} />}
            {showField === "mockExam"      && <MockExamBot subjects={subjects} />}
            {showField === "chatbot"       && <CareerBot />}
            {showField === "resumeScanner" && <ResumeScanner />}
        </DashboardLayout>
    );
};

export default StudentPage;
