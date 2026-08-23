import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faBuilding,
    faChevronDown,
    faSearch,
    faArrowRight,
    faCheck,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

import FormPopUp from "../Others/FormPopUp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default ({ deptId, isCentralLibrary, isAdmin }) => {

    const { data: admin, isSuperAdmin } = useSelector(state => state.admin);
    const navigate = useNavigate();
    const { departmentName } = useParams();


    // --------------------------------------------------
    // TEMPORARY DATA
    // Replace this with API data later
    // --------------------------------------------------

    const centralLibraries = [
        {
            _id: "central001",
            libraryName: "Main Central Library",
            description: "Institute-wide central library",
            totalBooks: 2500,
            availableBooks: 1840,
        },
        {
            _id: "central002",
            libraryName: "Digital Library",
            description: "Digital and online resources",
            totalBooks: 1800,
            availableBooks: 1260,
        },
        {
            _id: "central003",
            libraryName: "Research Library",
            description: "Research papers and reference books",
            totalBooks: 1200,
            availableBooks: 870,
        },
        {
            _id: "central004",
            libraryName: "Engineering Library",
            description: "Engineering reference books",
            totalBooks: 950,
            availableBooks: 710,
        },
        {
            _id: "central005",
            libraryName: "Science Library",
            description: "Science and research materials",
            totalBooks: 1100,
            availableBooks: 820,
        },
    ];

    const departmentLibraries = [
        {
            _id: "dept001",
            libraryName: "CSE Main Library",
            description: "Computer Science & Engineering",
            totalBooks: 850,
            availableBooks: 620,
        },
        {
            _id: "dept002",
            libraryName: "CSE Research Library",
            description: "CSE research and reference materials",
            totalBooks: 430,
            availableBooks: 280,
        },
        {
            _id: "dept003",
            libraryName: "AI & Data Science Library",
            description: "AI, ML and Data Science resources",
            totalBooks: 320,
            availableBooks: 210,
        },
        {
            _id: "dept004",
            libraryName: "Software Engineering Library",
            description: "Software engineering resources",
            totalBooks: 500,
            availableBooks: 350,
        },
    ];

    // --------------------------------------------------
    // STATES
    // --------------------------------------------------

    const [centralSearch, setCentralSearch] = useState("");
    const [departmentSearch, setDepartmentSearch] = useState("");

    const [centralOpen, setCentralOpen] = useState(false);
    const [departmentOpen, setDepartmentOpen] = useState(false);

    const [selectedCentralLibrary, setSelectedCentralLibrary] =
        useState(null);

    const [selectedDepartmentLibrary, setSelectedDepartmentLibrary] =
        useState(null);

    // CREATE LIBRARY POPUP
    const [showCreateLibraryPopup, setShowCreateLibraryPopup] =
        useState(false);

    // --------------------------------------------------
    // FILTER CENTRAL LIBRARIES
    // --------------------------------------------------

    const filteredCentralLibraries = useMemo(() => {
        return centralLibraries.filter((library) =>
            library.libraryName
                .toLowerCase()
                .includes(centralSearch.toLowerCase())
        );
    }, [centralSearch]);

    // --------------------------------------------------
    // FILTER DEPARTMENT LIBRARIES
    // --------------------------------------------------

    const filteredDepartmentLibraries = useMemo(() => {
        return departmentLibraries.filter((library) =>
            library.libraryName
                .toLowerCase()
                .includes(departmentSearch.toLowerCase())
        );
    }, [departmentSearch]);

    // --------------------------------------------------
    // SELECT CENTRAL LIBRARY
    // --------------------------------------------------

    const handleCentralSelect = (library) => {
        setSelectedCentralLibrary(library);
        setCentralOpen(false);
        setSelectedDepartmentLibrary(null);
    };

    // --------------------------------------------------
    // SELECT DEPARTMENT LIBRARY
    // --------------------------------------------------

    const handleDepartmentSelect = (library) => {
        setSelectedDepartmentLibrary(library);
        setDepartmentOpen(false);
        setSelectedCentralLibrary(null);
    };

    // --------------------------------------------------
    // ENTER LIBRARY
    // --------------------------------------------------

    const handleContinue = () => {

        const selectedLibrary =
            selectedCentralLibrary ||
            selectedDepartmentLibrary;

        if (!selectedLibrary) return;

        isCentralLibrary
            ? window.open(`library/${selectedLibrary._id}`, "_blank")
            : window.open(`${departmentName}/library/${selectedLibrary._id}`, "_blank")
        // Navigate to library page here
    };

    // --------------------------------------------------
    // CREATE LIBRARY SUBMIT
    // --------------------------------------------------

    const handleCreateLibrary = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);

        const libraryData = {
            libraryName: formData.get("libraryName"),
            fineLimit: formData.get("fineLimit"),
            returnDays: formData.get("returnDays"),

            isCentral: isCentralLibrary,

            departmentId: isCentralLibrary
                ? null
                : deptId,
        };

        console.log("Library Data:", libraryData);

        // ------------------------------------------
        // API CALL WILL GO HERE
        // ------------------------------------------

        /*
        Example:

        axios.post("/api/library/create", libraryData)
            .then(...)
            .catch(...)
        */

        setShowCreateLibraryPopup(false);
    };

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div
            className="
                min-h-[85vh]
                bg-gradient-to-br
                from-peach
                via-cream
                to-blush-light/60
                px-5
                py-12
                relative
                overflow-x-hidden
                overflow-y-auto
            "
        >

            {/* Background Orb */}

            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    pointer-events-none
                "
            >
                <div
                    className="
                        w-[700px]
                        h-[700px]
                        rounded-full
                        bg-blush/10
                    "
                />
            </div>


            {/* Main Content */}

            <div
                className="
                    relative
                    z-10
                    w-full
                    mx-auto
                "
            >

                {/* Header */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="
                        text-center
                        mb-10
                    "
                >

                    <span className="section-label">

                        {isCentralLibrary
                            ? "Central"
                            : "Department"}{" "}
                        Library

                    </span>

                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-extrabold
                            text-gray-800
                            tracking-tight
                            mb-3
                        "
                    >
                        Choose Your Library
                    </h1>

                    <p
                        className="
                            text-gray-500
                            text-base
                            max-w-xl
                            mx-auto
                        "
                    >
                        Select a{" "}
                        {isCentralLibrary
                            ? "central"
                            : "department"}{" "}
                        library to access books, borrowing
                        and library services.
                    </p>

                </motion.div>


                {/* Library Card */}

                <div
                    className="
                        flex
                        flex-col
                        items-center
                    "
                >

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-gray-100
                            shadow-luxury
                            overflow-visible
                            w-[80%]
                            relative
                        "
                    >

                        {/* Top Border */}

                        <div
                            className={`
                                h-1.5
                                rounded-t-3xl

                                ${isCentralLibrary
                                    ? "bg-gradient-to-r from-violet-400 to-violet-600"
                                    : "bg-gradient-to-r from-sky-400 to-sky-600"
                                }
                            `}
                        />


                        {/* CREATE LIBRARY BUTTON */}

                        {(isSuperAdmin || (isCentralLibrary && isSuperAdmin) || (!isCentralLibrary && !isSuperAdmin)) && (
                            <motion.button
                                initial={{
                                    opacity: 0,
                                    x: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                transition={{
                                    delay: 0.3,
                                }}
                                type="button"
                                onClick={() =>
                                    setShowCreateLibraryPopup(true)
                                }
                                className={`
                                    absolute
                                    top-6
                                    right-6
                                    px-5
                                    py-2.5
                                    rounded-full
                                    font-outfit
                                    font-bold
                                    text-xs
                                    text-white
                                    flex
                                    items-center
                                    gap-2
                                    shadow-luxury
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    z-20

                                    ${isCentralLibrary
                                        ? "bg-gradient-to-r from-violet-400 to-violet-600"
                                        : "bg-gradient-to-r from-sky-400 to-sky-600"
                                    }
                                `}
                            >

                                <FontAwesomeIcon
                                    icon={faPlus}
                                />

                                Create{" "}
                                {isCentralLibrary
                                    ? "Central Library"
                                    : "Department Library"}

                            </motion.button>
                        )}


                        <div className="p-8">

                            {/* Header */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    mb-6
                                    pr-64
                                "
                            >

                                <div
                                    className={`
                                        w-16
                                        h-16
                                        rounded-2xl
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0

                                        ${isCentralLibrary
                                            ? "bg-violet-50"
                                            : "bg-sky-50"
                                        }
                                    `}
                                >

                                    <FontAwesomeIcon
                                        icon={
                                            isCentralLibrary
                                                ? faBuilding
                                                : faBookOpen
                                        }
                                        className={`
                                            text-2xl

                                            ${isCentralLibrary
                                                ? "text-violet-600"
                                                : "text-sky-600"
                                            }
                                        `}
                                    />

                                </div>


                                <div>

                                    <span
                                        className={`
                                            inline-block
                                            text-xs
                                            font-semibold
                                            tracking-widest
                                            uppercase
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-gradient-to-r
                                            text-white
                                            mb-2

                                            ${isCentralLibrary
                                                ? "from-violet-400 to-violet-600"
                                                : "from-sky-400 to-sky-600"
                                            }
                                        `}
                                    >
                                        {isCentralLibrary
                                            ? "Central"
                                            : "Department"}
                                    </span>


                                    <h2
                                        className="
                                            text-2xl
                                            font-extrabold
                                            text-gray-800
                                        "
                                    >
                                        {isCentralLibrary
                                            ? "Central Library"
                                            : "Department Library"}
                                    </h2>

                                </div>

                            </div>


                            {/* Description */}

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mb-6
                                "
                            >

                                {isCentralLibrary
                                    ? "Choose from the central libraries available across your institute."
                                    : "Select a library from your department. Your department is automatically detected."
                                }

                            </p>


                            {/* Dropdown */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() => {

                                        if (isCentralLibrary) {

                                            setCentralOpen(
                                                !centralOpen
                                            );

                                            setDepartmentOpen(false);

                                        } else {

                                            setDepartmentOpen(
                                                !departmentOpen
                                            );

                                            setCentralOpen(false);

                                        }

                                    }}
                                    className={`
                                        w-full
                                        min-h-[58px]
                                        px-4
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        flex
                                        items-center
                                        justify-between
                                        text-left
                                        focus:outline-none
                                        transition

                                        ${isCentralLibrary
                                            ? "hover:border-violet-400"
                                            : "hover:border-sky-400"
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <FontAwesomeIcon
                                            icon={faBookOpen}
                                            className="
                                                text-gray-400
                                            "
                                        />

                                        <span
                                            className={
                                                isCentralLibrary
                                                    ? selectedCentralLibrary
                                                        ? "text-gray-800 font-semibold"
                                                        : "text-gray-400"
                                                    : selectedDepartmentLibrary
                                                        ? "text-gray-800 font-semibold"
                                                        : "text-gray-400"
                                            }
                                        >

                                            {isCentralLibrary

                                                ? selectedCentralLibrary
                                                    ? selectedCentralLibrary.libraryName
                                                    : "Select central library"

                                                : selectedDepartmentLibrary
                                                    ? selectedDepartmentLibrary.libraryName
                                                    : "Select department library"

                                            }

                                        </span>

                                    </div>


                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`
                                            text-gray-400
                                            transition-transform

                                            ${(
                                                isCentralLibrary
                                                    ? centralOpen
                                                    : departmentOpen
                                            )
                                                ? "rotate-180"
                                                : ""
                                            }
                                        `}
                                    />

                                </button>


                                {/* CENTRAL DROPDOWN */}

                                {isCentralLibrary &&
                                    centralOpen && (

                                        <div
                                            className="
                                                absolute
                                                top-[66px]
                                                left-0
                                                right-0
                                                bg-white
                                                border
                                                border-gray-200
                                                rounded-2xl
                                                shadow-xl
                                                z-50
                                                overflow-hidden
                                            "
                                        >

                                            <div
                                                className="
                                                    p-3
                                                    border-b
                                                    border-gray-100
                                                "
                                            >

                                                <div className="relative">

                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        className="
                                                            absolute
                                                            left-4
                                                            top-1/2
                                                            -translate-y-1/2
                                                            text-gray-400
                                                        "
                                                    />

                                                    <input
                                                        type="text"
                                                        value={centralSearch}
                                                        onChange={(e) =>
                                                            setCentralSearch(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Search central library..."
                                                        autoFocus
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="
                                                            w-full
                                                            pl-10
                                                            pr-4
                                                            py-3
                                                            rounded-xl
                                                            bg-gray-50
                                                            border
                                                            border-gray-100
                                                            outline-none
                                                            focus:border-violet-400
                                                        "
                                                    />

                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    max-h-64
                                                    overflow-y-auto
                                                    p-2
                                                "
                                            >

                                                {filteredCentralLibraries.length >
                                                    0 ? (

                                                    filteredCentralLibraries.map(
                                                        (library) => (

                                                            <button
                                                                key={
                                                                    library._id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCentralSelect(
                                                                        library
                                                                    )
                                                                }
                                                                className="
                                                                    w-full
                                                                    p-3
                                                                    rounded-xl
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    text-left
                                                                    hover:bg-violet-50
                                                                    transition
                                                                "
                                                            >

                                                                <div>

                                                                    <p
                                                                        className="
                                                                            font-semibold
                                                                            text-gray-700
                                                                        "
                                                                    >
                                                                        {
                                                                            library.libraryName
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            text-xs
                                                                            text-gray-400
                                                                            mt-1
                                                                        "
                                                                    >
                                                                        {
                                                                            library.description
                                                                        }
                                                                    </p>

                                                                </div>


                                                                {selectedCentralLibrary?._id ===
                                                                    library._id && (

                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faCheck
                                                                            }
                                                                            className="
                                                                            text-violet-600
                                                                        "
                                                                        />

                                                                    )}

                                                            </button>

                                                        )
                                                    )

                                                ) : (

                                                    <div
                                                        className="
                                                            py-8
                                                            text-center
                                                            text-gray-400
                                                            text-sm
                                                        "
                                                    >
                                                        No central library found
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    )}


                                {/* DEPARTMENT DROPDOWN */}

                                {!isCentralLibrary &&
                                    departmentOpen && (

                                        <div
                                            className="
                                                absolute
                                                top-[66px]
                                                left-0
                                                right-0
                                                bg-white
                                                border
                                                border-gray-200
                                                rounded-2xl
                                                shadow-xl
                                                z-50
                                                overflow-hidden
                                            "
                                        >

                                            <div
                                                className="
                                                    p-3
                                                    border-b
                                                    border-gray-100
                                                "
                                            >

                                                <div className="relative">

                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        className="
                                                            absolute
                                                            left-4
                                                            top-1/2
                                                            -translate-y-1/2
                                                            text-gray-400
                                                        "
                                                    />

                                                    <input
                                                        type="text"
                                                        value={
                                                            departmentSearch
                                                        }
                                                        onChange={(e) =>
                                                            setDepartmentSearch(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Search department library..."
                                                        autoFocus
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="
                                                            w-full
                                                            pl-10
                                                            pr-4
                                                            py-3
                                                            rounded-xl
                                                            bg-gray-50
                                                            border
                                                            border-gray-100
                                                            outline-none
                                                            focus:border-sky-400
                                                        "
                                                    />

                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    max-h-64
                                                    overflow-y-auto
                                                    p-2
                                                "
                                            >

                                                {filteredDepartmentLibraries.length >
                                                    0 ? (

                                                    filteredDepartmentLibraries.map(
                                                        (library) => (

                                                            <button
                                                                key={
                                                                    library._id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDepartmentSelect(
                                                                        library
                                                                    )
                                                                }
                                                                className="
                                                                    w-full
                                                                    p-3
                                                                    rounded-xl
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    text-left
                                                                    hover:bg-sky-50
                                                                    transition
                                                                "
                                                            >

                                                                <div>

                                                                    <p
                                                                        className="
                                                                            font-semibold
                                                                            text-gray-700
                                                                        "
                                                                    >
                                                                        {
                                                                            library.libraryName
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            text-xs
                                                                            text-gray-400
                                                                            mt-1
                                                                        "
                                                                    >
                                                                        {
                                                                            library.description
                                                                        }
                                                                    </p>

                                                                </div>


                                                                {selectedDepartmentLibrary?._id ===
                                                                    library._id && (

                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faCheck
                                                                            }
                                                                            className="
                                                                            text-sky-600
                                                                        "
                                                                        />

                                                                    )}

                                                            </button>

                                                        )
                                                    )

                                                ) : (

                                                    <div
                                                        className="
                                                            py-8
                                                            text-center
                                                            text-gray-400
                                                            text-sm
                                                        "
                                                    >
                                                        No department library found
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    )}

                            </div>

                        </div>

                    </motion.div>


                    {/* ENTER LIBRARY BUTTON */}

                    <div
                        className="
                            w-[80%]
                            mt-8
                            flex
                            justify-center
                        "
                    >

                        <motion.button
                            type="button"
                            disabled={
                                !selectedCentralLibrary &&
                                !selectedDepartmentLibrary
                            }
                            onClick={handleContinue}
                            className={`
                                px-10
                                py-3.5
                                rounded-full
                                font-outfit
                                font-bold
                                text-sm
                                text-white
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition-all
                                duration-300

                                ${selectedCentralLibrary ||
                                    selectedDepartmentLibrary
                                    ? "bg-gradient-to-r from-violet-500 to-violet-700 shadow-luxury hover:-translate-y-0.5"
                                    : "bg-gray-300 cursor-not-allowed"
                                }
                            `}
                        >

                            Enter Library

                            <FontAwesomeIcon
                                icon={faArrowRight}
                            />

                        </motion.button>

                    </div>

                </div>

            </div>


            {/* ==========================================
                CREATE LIBRARY FORM POPUP
            =========================================== */}

            {showCreateLibraryPopup && (

                <FormPopUp
                    onClose={() =>
                        setShowCreateLibraryPopup(false)
                    }

                    onSubmit={handleCreateLibrary}

                    formElems={[
                        {
                            label: "Library Name",
                            name: "libraryName",
                            type: "text",
                            placeholder: "Enter library name",
                        },
                        {
                            label: "Fine Limit",
                            name: "fineLimit",
                            type: "number",
                            placeholder: "Enter fine limit",
                        },
                        {
                            label: "Return Days",
                            name: "returnDays",
                            type: "number",
                            placeholder: "Enter return days",
                        },
                    ]}
                >

                    {/* Library Type */}

                    <div
                        className="
                            mt-4
                            p-4
                            rounded-2xl
                            bg-gray-50
                            border
                            border-gray-100
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-gray-400
                                uppercase
                                tracking-wide
                                font-semibold
                            "
                        >
                            Library Type
                        </p>

                        <p
                            className="
                                font-semibold
                                text-gray-800
                                mt-1
                            "
                        >

                            {isCentralLibrary
                                ? "Central Library"
                                : "Department Library"}

                        </p>

                    </div>

                </FormPopUp>

            )}

        </div>
    );
};