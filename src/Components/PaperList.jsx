import { useState } from "react";
import CreatePaper from "./CreatePaper";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addPaper_dept, modifyPaper_dept, removePaper_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faPenToSquare, faPlus, faSpinner, faTrashCan, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default ({ deptId, papers }) => {
    const { data: admin } = useSelector(state => state.admin);
    const [canAdd, setCanAdd] = useState(false);
    const [removePaper_name, setRemovePaper_name] = useState(null);
    const [paperInfo, setPaperInfo] = useState({ name: "", semester: "" });
    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext();
    const [modifyingPaper, setModifyingPaper] = useState("");
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaperInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setCanAdd(false);
        setPaperInfo({ name: "", semester: "" });
    };

    const addPaper = (e) => {
        e.preventDefault();
        setIsloading(true);
        axios.post(`admin/handleDepartmentPapers/${deptId}`, paperInfo)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) { dispatch(addPaper_dept(message)); handleCancel(); }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const modifyPaper = () => {
        setIsloading(true);
        axios.put(`admin/handleDepartmentPapers/${deptId}`, {
            oldPaperName: modifyingPaper,
            newPaperName: paperInfo.name,
            semester: paperInfo.semester,
        })
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) {
                    dispatch(modifyPaper_dept({ oldPaperName: modifyingPaper, newPaperName: paperInfo.name, semester: paperInfo.semester }));
                    setModifyingPaper("");
                    setPaperInfo({ name: "", semester: "" });
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const removePaper = (paperName) => {
        const encodedPaperName = encodeURIComponent(paperName);
        setIsRemoving(true);
        axios.delete(`admin/handleDepartmentPapers/${deptId}/?paperName=${encodedPaperName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) dispatch(removePaper_dept(paperName));
            })
            .catch(() => toast("Network connection error"))
            .finally(() => { setIsRemoving(false); setRemovePaper_name(null); });
    };

    if (canAdd) {
        return <CreatePaper handleCancel={handleCancel} handleChange={handleChange} handleSubmit={addPaper} />;
    }

    return (
        <AnimatedPage>
            {removePaper_name && (
                <PopWindow
                    onClose={() => setRemovePaper_name(null)}
                    onProceed={() => removePaper(removePaper_name)}
                    userType="Paper"
                />
            )}

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-rose
                               flex items-center justify-center text-white text-2xl shadow-luxury mb-4"
                >
                    <FontAwesomeIcon icon={faFileAlt} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Paper List</h2>
                <p className="text-sm text-gray-500 mt-1">{papers?.length || 0} papers</p>
            </div>

            {/* Add Button */}
            {admin && (
                <div className="flex justify-end mb-5">
                    <HoverButton
                        onClick={() => setCanAdd(true)}
                        disabled={isloading || isRemoving}
                        className="btn-primary btn-sm gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Paper
                    </HoverButton>
                </div>
            )}

            {/* Table */}
            {papers?.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table-luxury">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Paper Name</th>
                                    <th>Semester</th>
                                    {admin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {papers.map((paper, index) => (
                                    <motion.tr
                                        key={paper.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <td className="text-gray-400 font-medium">{index + 1}</td>
                                        <td>
                                            {paper.name === modifyingPaper ? (
                                                <input
                                                    type="text"
                                                    defaultValue={paper.name}
                                                    onChange={handleChange}
                                                    name="name"
                                                    className="input-luxury py-1.5 text-xs"
                                                />
                                            ) : (
                                                <span className="font-semibold text-gray-800">{paper.name}</span>
                                            )}
                                        </td>
                                        <td>
                                            {paper.name === modifyingPaper ? (
                                                <input
                                                    type="number"
                                                    name="semester"
                                                    defaultValue={paper.semester}
                                                    onChange={handleChange}
                                                    className="input-luxury py-1.5 text-xs w-20"
                                                />
                                            ) : (
                                                <span className="badge badge-primary">Sem {paper.semester}</span>
                                            )}
                                        </td>
                                        {admin && (
                                            <td>
                                                <div className="flex gap-2">
                                                    {paper.name === modifyingPaper ? (
                                                        <>
                                                            <HoverButton
                                                                onClick={modifyPaper}
                                                                disabled={isloading || isRemoving}
                                                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border-none cursor-pointer
                                                                           flex items-center justify-center text-xs hover:bg-emerald-100 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                                            </HoverButton>
                                                            <HoverButton
                                                                onClick={() => { setModifyingPaper(""); setPaperInfo({ name: "", semester: "" }); }}
                                                                disabled={isloading || isRemoving}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 border-none cursor-pointer
                                                                           flex items-center justify-center text-xs hover:bg-gray-200 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={faXmark} />
                                                            </HoverButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HoverButton
                                                                onClick={() => { setModifyingPaper(paper.name); setPaperInfo({ name: paper.name, semester: paper.semester }); }}
                                                                disabled={isloading || isRemoving}
                                                                className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border-none cursor-pointer
                                                                           flex items-center justify-center text-xs hover:bg-sky-100 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                            </HoverButton>
                                                            <HoverButton
                                                                onClick={() => setRemovePaper_name(paper.name)}
                                                                disabled={isloading || isRemoving}
                                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 border-none cursor-pointer
                                                                           flex items-center justify-center text-xs hover:bg-red-100 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                                            </HoverButton>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl mb-4">
                        <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <p className="text-gray-400 font-medium">No papers added yet</p>
                </div>
            )}
        </AnimatedPage>
    );
};
