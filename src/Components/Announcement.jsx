import axios from "axios";
import { toast } from "react-toastify";
import { addAnnouncement_dept, removeAnnouncement_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { addAnnouncement_batch, removeAnnouncement_batch } from "../Redux_Components/Features/batchSlice.mjs";
import { addAnnouncement_insti, removeAnnouncement_insti } from "../Redux_Components/Features/instituteSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner, faTrashCan, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";
import { AnimatedPage, HoverButton } from "./Others/AnimatedPage";

export default ({ deptId, announcements, batchName, type, instituteId }) => {
    const dispatch = useDispatch();
    const inputField = useRef();
    const { data: admin, isSuperAdmin } = useSelector(state => state.admin);
    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext();
    const [removeAnnouncement_id, setRemoveAnnouncement_id] = useState(null);
    const [announcement, setAnnouncement] = useState("");

    const canSend = type === "Institute" ? isSuperAdmin : !!admin;

    const deleteAnnouncement = (id) => {
        setIsRemoving(true);
        axios.delete(`admin/handle${type}Announcement/${type === "Institute" ? instituteId : deptId}/?announcementId=${id}&batchName=${batchName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message);
                if (status) {
                    if (type === "Institute") dispatch(removeAnnouncement_insti(id));
                    else if (type === "Department") dispatch(removeAnnouncement_dept(id));
                    else dispatch(removeAnnouncement_batch(id));
                }
            })
            .catch(() => toast("Network connection error"))
            .finally(() => { setIsRemoving(false); setRemoveAnnouncement_id(null); });
    };

    const handleSend = () => {
        if (!announcement.trim()) return;
        setIsloading(true);
        axios.post(`admin/handle${type}Announcement/${type === "Institute" ? instituteId : deptId}/?batchName=${batchName}`, { announcement })
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message);
                setAnnouncement("");
                if (inputField.current) inputField.current.value = "";
                if (type === "Institute") dispatch(addAnnouncement_insti(message));
                else if (type === "Department") dispatch(addAnnouncement_dept(message));
                else dispatch(addAnnouncement_batch(message));
            })
            .catch(() => toast("Network connection error"))
            .finally(() => setIsloading(false));
    };

    return (
        <AnimatedPage>
            {removeAnnouncement_id && (
                <PopWindow
                    userType="Announcement"
                    onClose={() => setRemoveAnnouncement_id(null)}
                    onProceed={() => deleteAnnouncement(removeAnnouncement_id)}
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
                    <FontAwesomeIcon icon={faBullhorn} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                    {type} Announcements
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {announcements?.length || 0} announcement{announcements?.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 mb-5 max-h-[55vh] overflow-y-auto pr-1">
                <AnimatePresence>
                    {announcements?.length > 0 ? (
                        announcements.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.04 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm p-5
                                           relative overflow-hidden group hover:border-blush-light
                                           hover:shadow-luxury transition-all duration-200"
                            >
                                {/* Left accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blush to-rose rounded-l-2xl" />
                                <div className="pl-3">
                                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                        {item.announcement}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <span>🕐</span>
                                            {item.date} {item.time}
                                        </p>
                                        {canSend && (
                                            <HoverButton
                                                onClick={() => setRemoveAnnouncement_id(item._id)}
                                                disabled={isRemoving || isloading}
                                                className="w-7 h-7 rounded-lg bg-red-50 text-red-400 border-none cursor-pointer
                                                           flex items-center justify-center text-xs
                                                           opacity-0 group-hover:opacity-100 transition-all duration-200
                                                           hover:bg-red-100"
                                            >
                                                <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                            </HoverButton>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="text-5xl mb-4 opacity-20">📢</div>
                            <p className="text-gray-400 font-medium">No announcements yet</p>
                            {canSend && (
                                <p className="text-gray-300 text-sm mt-1">Be the first to post an announcement</p>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            {canSend && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-luxury-sm p-4 flex gap-3 items-end">
                    <textarea
                        ref={inputField}
                        placeholder="Write an announcement..."
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={2}
                        className="input-luxury flex-1 resize-none py-3 text-sm"
                    />
                    <HoverButton
                        onClick={handleSend}
                        disabled={isRemoving || isloading || !announcement.trim()}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blush to-rose text-white
                                   border-none cursor-pointer flex items-center justify-center
                                   shadow-luxury transition-all duration-300 flex-shrink-0
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={isloading ? faSpinner : faPaperPlane} spin={isloading} />
                    </HoverButton>
                </div>
            )}
        </AnimatedPage>
    );
};
