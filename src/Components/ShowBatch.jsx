import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faPenToSquare, faSpinner, faLayerGroup, faCalendar, faClock, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { modifyBatch } from "../Redux_Components/Features/batchSlice.mjs";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default () => {
    const { data: admin } = useSelector(state => state.admin);
    const { data: deptData } = useSelector(state => state.department);
    const { data: batchData } = useSelector(state => state.batch);
    const { isloading, setIsloading } = useLoadingContext();
    const dispatch = useDispatch();

    const [newBatchName, setNewBatchName] = useState(batchData?.batchName);
    const [newSemester, setNewSemester] = useState(batchData?.semester);
    const [canModify, setCanModify] = useState(false);

    const modify = () => {
        setIsloading(true);
        axios.put(`admin/handleBatch/${deptData._id}`, { oldBatchName: batchData.batchName, newBatchName, newSemester })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyBatch({ newBatchName, newSemester }));
                    setCanModify(false);
                } else {
                    setNewBatchName(batchData.batchName);
                    setNewSemester(batchData.semester);
                }
                toast(message);
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    const fields = [
        { icon: faLayerGroup, label: "Batch Name",     value: newBatchName, editable: true,  onChange: (e) => setNewBatchName(e.target.value), type: "text" },
        { icon: faHashtag,    label: "Semester",       value: newSemester,  editable: true,  onChange: (e) => setNewSemester(e.target.value),  type: "number" },
        { icon: faClock,      label: "Creation Time",  value: batchData?.creationDate?.time, editable: false, type: "text" },
        { icon: faCalendar,   label: "Creation Date",  value: batchData?.creationDate?.date, editable: false, type: "text" },
    ];

    return (
        <AnimatedPage>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blush to-rose
                                   flex items-center justify-center text-white text-3xl shadow-luxury mb-4"
                    >
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Batch Account</h2>
                    <span className="badge badge-primary mt-2">Semester {batchData?.semester}</span>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-luxury overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blush to-rose" />
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {fields.map(({ icon, label, value, editable, onChange, type }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <label className="form-label-luxury flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={icon} className="text-rose" />
                                        {label}
                                    </label>
                                    {canModify && editable ? (
                                        <input
                                            type={type}
                                            defaultValue={value}
                                            onChange={onChange}
                                            className="input-luxury"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 flex-wrap">
                            {canModify ? (
                                <>
                                    <HoverButton
                                        onClick={modify}
                                        disabled={isloading}
                                        className="btn-success btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                        {isloading ? "Saving..." : "Save Changes"}
                                    </HoverButton>
                                    <HoverButton
                                        type="button"
                                        onClick={() => {
                                            setCanModify(false);
                                            setNewBatchName(batchData?.batchName);
                                            setNewSemester(batchData?.semester);
                                        }}
                                        disabled={isloading}
                                        className="btn-danger btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faBan} /> Cancel
                                    </HoverButton>
                                </>
                            ) : admin && (
                                <HoverButton
                                    type="button"
                                    onClick={() => setCanModify(true)}
                                    className="btn-violet btn-sm gap-2"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} /> Modify
                                </HoverButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};
