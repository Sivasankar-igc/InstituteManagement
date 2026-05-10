import { useDispatch, useSelector } from "react-redux";
import { statusCode } from "../utils/statusFile.mjs";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { removeDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { removeDepartment_institute } from "../Redux_Components/Features/instituteSlice.mjs";
import Announcement from "../Components/Announcement";
import FacultyList from "../Components/FacultyList";
import BatchList from "../Components/BatchList";
import { useNavigate } from "react-router-dom";
import DepartmentAdmin from "../Components/DepartmentAdmin";
import PaperList from "../Components/PaperList";
import { useLoadingContext } from "../Context_API/LoadingContext";
import {
    faBuilding, faUserTie, faLayerGroup, faBullhorn, faFileAlt,
    faFingerprint, faArrowLeft, faTrash
} from "@fortawesome/free-solid-svg-icons";
import ShowDepartment from "../Components/ShowDepartment";
import PopWindow from "../Components/Others/PopWindow";
import DashboardLayout from "../Components/Others/DashboardLayout";

const DepartmentPage = () => {
    const { data: deptData, status: deptStatus } = useSelector(state => state.department);
    const { data: instituteInfo } = useSelector(state => state.institute);
    const { data: admin, isSuperAdmin } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isloading, isRemoving, setIsRemoving } = useLoadingContext();
    const [showField, setShowField] = useState("account");

    const deleteDept = () => {
        setIsRemoving(true);
        axios.delete(`admin/handleDepartment/?departmentId=${deptData._id}&instituteId=${instituteInfo.instituteId}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) {
                    dispatch(removeDepartment_institute(deptData._id));
                    dispatch(removeDepartments());
                    navigate(-1);
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsRemoving(false));
    };

    const navItems = [
        { key: "account",     label: "Account",          icon: faBuilding,    onClick: () => setShowField("account") },
        ...(isSuperAdmin ? [{ key: "showAdmin", label: "Department Admin", icon: faUserTie, onClick: () => setShowField("showAdmin") }] : []),
        { key: "facultyList", label: "Faculty List",     icon: faUserTie,     onClick: () => setShowField("facultyList"),  disabled: isloading || isRemoving },
        { key: "batchList",   label: "Batch List",       icon: faLayerGroup,  onClick: () => setShowField("batchList"),    disabled: isloading || isRemoving },
        { key: "announcement",label: "Announcement",     icon: faBullhorn,    onClick: () => setShowField("announcement"), disabled: isloading || isRemoving },
        { key: "papers",      label: "Papers",           icon: faFileAlt,     onClick: () => setShowField("papers"),       disabled: isloading || isRemoving },
        ...(admin ? [
            { key: "punchIn",  label: "Punch In",  icon: faFingerprint, onClick: () => navigate("/department/punchIn"),  disabled: isloading || isRemoving },
            { key: "punchOut", label: "Punch Out", icon: faFingerprint, onClick: () => navigate("/department/punchOut"), disabled: isloading || isRemoving },
        ] : []),
    ];

    const bottomItems = [
        ...(isSuperAdmin ? [{
            key: "removeDept", label: isRemoving ? "Deleting..." : "Delete Department",
            icon: faTrash, onClick: () => setShowField("removeDepartment"), danger: true, disabled: isloading || isRemoving
        }] : []),
        { key: "back", label: "Go Back", icon: faArrowLeft, onClick: () => navigate(-1), disabled: isloading || isRemoving },
    ];

    if (deptStatus !== statusCode.IDLE) return (
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Something went wrong</div>
    );

    return (
        <>
            {showField === "removeDepartment" && (
                <PopWindow userType="Department" onClose={() => setShowField("account")} onProceed={deleteDept} />
            )}
            <DashboardLayout
                title="Department Dashboard"
                subtitle={deptData?.departmentName}
                icon={faBuilding}
                navItems={navItems}
                bottomItems={bottomItems}
                activeKey={showField}
                pageTitle="Department Dashboard"
            >
                {showField === "account"      && <ShowDepartment />}
                {showField === "showAdmin"    && <DepartmentAdmin deptId={deptData._id} />}
                {showField === "facultyList"  && <FacultyList deptId={deptData._id} faculties={deptData.facultyList} />}
                {showField === "batchList"    && <BatchList batchList={deptData.batches} deptId={deptData._id} />}
                {showField === "announcement" && <Announcement deptId={deptData._id} announcements={deptData.announcements} batchName={null} type="Department" />}
                {showField === "papers"       && <PaperList deptId={deptData._id} papers={deptData.papers} />}
            </DashboardLayout>
        </>
    );
};

export default DepartmentPage;
