import { useSelector } from "react-redux";
import { statusCode } from "../utils/statusFile.mjs";
import { useState } from "react";
import DepartmentList from "../Components/DepartmentList";
import Announcement from "../Components/Announcement";
import { useNavigate } from "react-router-dom";
import ShowAdmin from "../Components/ShowAdmin";
import ShowInstitute from "../Components/ShowInstitute";
import Premium from "../Components/Premium";
import { useAuthenticateContext } from "../Context_API/Authentication";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import PopWindow from "../Components/Others/PopWindow";
import DashboardLayout from "../Components/Others/DashboardLayout";
import {
    faUser, faBuilding, faBullhorn,
    faLayerGroup, faCrown, faTrash, faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

const AdminPage = () => {
    const { status: adminStatus, isSuperAdmin } = useSelector(state => state.admin);
    const { data: instituteData } = useSelector(state => state.institute);
    const { data: deptData } = useSelector(state => state.department);

    const { isloading, isRemoving, setIsRemoving } = useLoadingContext();
    const [showField, setShowField] = useState("account");
    const { logout } = useAuthenticateContext();
    const navigate = useNavigate();

    const removeAccount = () => {
        setIsRemoving(true);
        axios.delete(`admin/removeSuperAdminAccount/${instituteData.instituteId}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsRemoving(false));
    };

    const navItems = [
        { key: "account",        label: "My Account",       icon: faUser,       onClick: () => setShowField("account") },
        { key: "institute",      label: "Institute Account", icon: faBuilding,   onClick: () => setShowField("institute") },
        { key: "announcement",   label: "Announcements",    icon: faBullhorn,   onClick: () => setShowField("announcement") },
        ...(isSuperAdmin ? [
            { key: "departmentList", label: "Department List", icon: faLayerGroup, onClick: () => setShowField("departmentList") },
            { key: "premium",        label: "Premium Plans",   icon: faCrown,      onClick: () => setShowField("premium") },
        ] : [
            { key: "dept", label: "My Department", icon: faLayerGroup,
              onClick: () => navigate(`/institute/${instituteData.instituteId}/department/${deptData?.departmentName}`) },
        ]),
    ];

    const bottomItems = [
        ...(isSuperAdmin ? [{
            key: "removeAccount",
            label: isRemoving ? "Removing..." : "Remove Account",
            icon: faTrash,
            onClick: () => setShowField("removeAccount"),
            danger: true,
            disabled: isloading || isRemoving,
        }] : []),
        { key: "logout", label: "Log Out", icon: faRightFromBracket, onClick: logout, danger: true },
    ];

    const pageTitles = {
        account: "My Account", institute: "Institute Account",
        announcement: "Announcements", departmentList: "Department List",
        premium: "Premium Plans"
    };

    return (
        adminStatus === statusCode.IDLE && (
            <>
                {showField === "removeAccount" && (
                    <PopWindow
                        onClose={() => setShowField("account")}
                        onProceed={removeAccount}
                        userType="Institute"
                    />
                )}
                <DashboardLayout
                    title="Admin Dashboard"
                    subtitle={isSuperAdmin ? "Super Admin" : "Department Admin"}
                    icon={faBuilding}
                    navItems={navItems}
                    bottomItems={bottomItems}
                    activeKey={showField}
                    pageTitle={pageTitles[showField] || "Dashboard"}
                >
                    {showField === "account"        && <ShowAdmin />}
                    {showField === "institute"      && <ShowInstitute />}
                    {showField === "departmentList" && <DepartmentList />}
                    {showField === "announcement"   && (
                        <Announcement
                            type="Institute"
                            announcements={instituteData.announcements}
                            instituteId={instituteData._id}
                        />
                    )}
                    {showField === "premium" && <Premium />}
                </DashboardLayout>
            </>
        )
    );
};

export default AdminPage;
