import { useState } from "react";
import { useSelector } from "react-redux";
import ShowAssignments from "../Components/ShowAssignments";
import ShowFaculty from "../Components/ShowFaculty";
import ShowExams from "../Components/ShowExams";
import { useNavigate } from "react-router-dom";
import ShowInstitute from "../Components/ShowInstitute";
import Announcement from "../Components/Announcement";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { faUser, faBuilding, faBullhorn, faClipboardList, faFileAlt, faCalendarCheck, faRightFromBracket, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import TakeAttendance from "../Components/Faculty/TakeAttendance";
import DashboardLayout from "../Components/Others/DashboardLayout";

const FacultyPage = () => {
    const { data: facultyData } = useSelector(state => state.faculty);
    const { data: departmentData } = useSelector(state => state.department);
    const { data: instituteData } = useSelector(state => state.institute);
    const { logout } = useAuthenticateContext();
    const [showField, setShowField] = useState("account");
    const navigate = useNavigate();

    const navItems = [
        { key: "account",     label: "My Account",             icon: faUser,             onClick: () => setShowField("account") },
        { key: "institute",   label: "Institute Account",       icon: faBuilding,         onClick: () => setShowField("institute") },
        { key: "instituteAnn",label: "Institute Announcements", icon: faBullhorn,         onClick: () => setShowField("instituteAnn") },
        { key: "dept",        label: "Department Account",      icon: faLayerGroup,       onClick: () => navigate(`/institute/${instituteData.instituteId}/department/${departmentData.departmentName}`) },
        { key: "assignments", label: "Assignments",             icon: faClipboardList,    onClick: () => setShowField("assignments") },
        { key: "exams",       label: "Exams",                   icon: faFileAlt,          onClick: () => setShowField("exams") },
        { key: "attendance",  label: "Attendance",              icon: faCalendarCheck,    onClick: () => setShowField("attendance") },
    ];

    const bottomItems = [
        { key: "logout", label: "Log Out", icon: faRightFromBracket, onClick: logout, danger: true },
    ];

    if (!facultyData) return (
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
            Loading Faculty Data...
        </div>
    );

    return (
        <DashboardLayout
            title="Faculty Dashboard"
            subtitle={facultyData.facultyName}
            icon={faUser}
            navItems={navItems}
            bottomItems={bottomItems}
            activeKey={showField}
            pageTitle="Faculty Dashboard"
        >
            {showField === "account"      && <ShowFaculty faculty={facultyData} />}
            {showField === "institute"    && <ShowInstitute />}
            {showField === "instituteAnn" && <Announcement deptId={departmentData._id} announcements={instituteData.announcements} batchName={null} type={null} instituteId={instituteData.instituteId} />}
            {showField === "assignments"  && <ShowAssignments type="faculty" deptId={departmentData._id} subjects={facultyData.subjects} teacherName={facultyData.facultyName} />}
            {showField === "exams"        && <ShowExams instituteId={instituteData.instituteId} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={facultyData.subjects} />}
            {showField === "attendance"   && <TakeAttendance instituteId={instituteData.instituteId} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={facultyData.subjects} />}
        </DashboardLayout>
    );
};

export default FacultyPage;
