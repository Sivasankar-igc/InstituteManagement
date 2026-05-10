import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { useState } from "react";
import CreateDepartment from "./CreateDepartment";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBuilding, faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, StaggerContainer, StaggerItem, HoverButton, HoverCard } from "./Others/AnimatedPage";

const DepartmentList = () => {
    const { data: instituteData } = useSelector(state => state.institute);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createBtnClicked, setCreateBtnClicked] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(null);

    const fetchDepartmentData = (deptId, deptName) => {
        setLoading(deptId);
        axios.get(`admin/getDepartment/${deptId}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                dispatch(addDepartments(message));
                navigate(`/institute/${instituteData.instituteId}/department/${deptName}`);
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setLoading(null));
    };

    const filtered = (instituteData.departments || []).filter(d =>
        d.departmentName.toLowerCase().includes(search.toLowerCase())
    );

    if (createBtnClicked) {
        return <CreateDepartment onClose={() => setCreateBtnClicked(false)} />;
    }

    return (
        <AnimatedPage>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-rose
                                flex items-center justify-center text-white text-2xl shadow-luxury mb-4">
                    <FontAwesomeIcon icon={faBuilding} />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Department List</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {instituteData.departments?.length || 0} department{instituteData.departments?.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-luxury pl-10 py-2.5 text-sm"
                    />
                </div>

                <HoverButton
                    onClick={() => setCreateBtnClicked(true)}
                    className="btn-primary btn-sm gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} /> Create Department
                </HoverButton>
            </div>

            {/* Department Grid */}
            {filtered.length > 0 ? (
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((dept) => (
                        <StaggerItem key={dept.departmentId}>
                            <HoverCard
                                className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm
                                           cursor-pointer overflow-hidden"
                                onClick={() => fetchDepartmentData(dept.departmentId, dept.departmentName)}
                            >
                                <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center text-rose">
                                            <FontAwesomeIcon icon={faBuilding} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 leading-tight">
                                                {dept.departmentName}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">Department</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {loading === dept.departmentId
                                            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                              </motion.div>
                                            : <FontAwesomeIcon icon={faArrowRight} />
                                        }
                                    </div>
                                </div>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-4">
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <p className="text-gray-400 font-medium">
                        {search ? "No departments match your search" : "No departments yet"}
                    </p>
                    {!search && (
                        <p className="text-gray-300 text-sm mt-1">Create your first department to get started</p>
                    )}
                </div>
            )}
        </AnimatedPage>
    );
};

export default DepartmentList;
