import { useState } from "react";
import ShowFaculty from "./ShowFaculty";
import CreateFaculty from "./CreateFaculty";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus, faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, StaggerContainer, StaggerItem, HoverButton, HoverCard } from "./Others/AnimatedPage";

export default ({ deptId, faculties }) => {
    const [facultyId, setFacultyId] = useState(null);
    const [canAddFaculty, setCanAddFaculty] = useState(false);
    const [search, setSearch] = useState("");
    const { data: admin } = useSelector(state => state.admin);

    const filtered = (faculties || []).filter(f =>
        f.facultyDeptId?.toLowerCase().includes(search.toLowerCase())
    );

    if (canAddFaculty) {
        return <CreateFaculty deptId={deptId} close={() => setCanAddFaculty(false)} />;
    }

    if (facultyId) {
        return (
            <ShowFaculty
                faculty={null}
                deptId={deptId}
                faculty_id={facultyId}
                goBack={() => setFacultyId(null)}
            />
        );
    }

    return (
        <AnimatedPage>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-rose
                               flex items-center justify-center text-white text-2xl shadow-luxury mb-4"
                >
                    <FontAwesomeIcon icon={faUserTie} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Faculty List</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {faculties?.length || 0} faculty member{faculties?.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search faculty..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-luxury pl-10 py-2.5 text-sm"
                    />
                </div>
                {admin && (
                    <HoverButton
                        onClick={() => setCanAddFaculty(true)}
                        className="btn-primary btn-sm gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Faculty
                    </HoverButton>
                )}
            </div>

            {/* Faculty Grid */}
            {filtered.length > 0 ? (
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((faculty) => (
                        <StaggerItem key={faculty.facultyId}>
                            <HoverCard
                                className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm
                                           cursor-pointer overflow-hidden"
                                onClick={() => setFacultyId(faculty.facultyId)}
                            >
                                <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-rose
                                                        flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {faculty.facultyDeptId?.[0]?.toUpperCase() || "F"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 leading-tight">
                                                {faculty.facultyDeptId}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">Faculty Member</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-300 text-sm" />
                                </div>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-4">
                        <FontAwesomeIcon icon={faUserTie} />
                    </div>
                    <p className="text-gray-400 font-medium">
                        {search ? "No faculty match your search" : "No faculty members yet"}
                    </p>
                    {!search && admin && (
                        <p className="text-gray-300 text-sm mt-1">Add your first faculty member to get started</p>
                    )}
                </div>
            )}
        </AnimatedPage>
    );
};
