import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
    faBook,
    faBookOpen,
    faMagnifyingGlass,
    faFilter,
    faChevronLeft,
    faChevronRight,
    faCalendarDays,
    faClock,
    faCircleCheck,
    faCircleExclamation,
    faXmark,
    faBookmark,
    faArrowRight,
    faFire,
    faStar,
    faHistory,
    faLayerGroup,
    faUser,
    faIndianRupeeSign,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../Components/Others/PopWindow";


// ======================================================
// DUMMY STUDENT DATA
// ======================================================

const dummyStudent = {
    studentId: "STU001",
    studentName: "Siva Sankar",
    fine: 40,
    fineLimit: 100,

    // Books previously rented by student
    booksRented: [
        "BK001",
        "BK005",
        "BK008",
    ],
};


// ======================================================
// DUMMY LIBRARY POLICY
// ======================================================

const dummyLibrary = {
    returnDays: 25,
    fineLimit: 100,
};


// ======================================================
// DUMMY BOOK DATA
// ======================================================

const dummyBooks = [
    {
        id: "BK001",
        name: "Database System Concepts",
        author: "Abraham Silberschatz",
        publisher: "McGraw Hill",
        published: "2022",
        stream: "Computer Science",
        subject: "DBMS",
        genre: "Database",
        description:
            "A comprehensive introduction to database systems, architecture and database design.",
        totalCopies: 8,
        availableCopies: 3,
        rating: 4.8,
        popular: true,
        recommended: true,
    },

    {
        id: "BK002",
        name: "Operating System Concepts",
        author: "Abraham Silberschatz",
        publisher: "Wiley",
        published: "2021",
        stream: "Computer Science",
        subject: "Operating System",
        genre: "Computer Science",
        description:
            "A detailed guide to operating systems, processes, memory management and file systems.",
        totalCopies: 10,
        availableCopies: 6,
        rating: 4.7,
        popular: true,
        recommended: false,
    },

    {
        id: "BK003",
        name: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        publisher: "Pearson",
        published: "2020",
        stream: "Computer Science",
        subject: "Computer Networks",
        genre: "Networking",
        description:
            "Fundamentals of computer networks, protocols, architecture and communication.",
        totalCopies: 7,
        availableCopies: 2,
        rating: 4.6,
        popular: true,
        recommended: true,
    },

    {
        id: "BK004",
        name: "Clean Code",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        published: "2019",
        stream: "Computer Science",
        subject: "Software Engineering",
        genre: "Programming",
        description:
            "Practical principles and techniques for writing clean and maintainable software.",
        totalCopies: 6,
        availableCopies: 0,
        rating: 4.9,
        popular: true,
        recommended: true,
    },

    {
        id: "BK005",
        name: "Artificial Intelligence",
        author: "Stuart Russell",
        publisher: "Pearson",
        published: "2021",
        stream: "Computer Science",
        subject: "Artificial Intelligence",
        genre: "AI",
        description:
            "Introduction to artificial intelligence, intelligent agents and machine learning.",
        totalCopies: 9,
        availableCopies: 5,
        rating: 4.9,
        popular: true,
        recommended: true,
    },

    {
        id: "BK006",
        name: "Machine Learning",
        author: "Tom Mitchell",
        publisher: "McGraw Hill",
        published: "2020",
        stream: "Computer Science",
        subject: "Machine Learning",
        genre: "AI",
        description:
            "Fundamental concepts and algorithms used in machine learning.",
        totalCopies: 8,
        availableCopies: 4,
        rating: 4.8,
        popular: false,
        recommended: true,
    },

    {
        id: "BK007",
        name: "Data Structures and Algorithms",
        author: "Mark Allen Weiss",
        publisher: "Pearson",
        published: "2022",
        stream: "Computer Science",
        subject: "DSA",
        genre: "Programming",
        description:
            "Algorithms and data structures with practical implementation examples.",
        totalCopies: 12,
        availableCopies: 7,
        rating: 4.7,
        popular: true,
        recommended: true,
    },

    {
        id: "BK008",
        name: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        publisher: "MIT Press",
        published: "2022",
        stream: "Computer Science",
        subject: "Algorithms",
        genre: "Programming",
        description:
            "A comprehensive reference for algorithms and computational problem solving.",
        totalCopies: 10,
        availableCopies: 3,
        rating: 4.9,
        popular: true,
        recommended: true,
    },

    {
        id: "BK009",
        name: "Engineering Mechanics",
        author: "R.C. Hibbeler",
        publisher: "Pearson",
        published: "2021",
        stream: "Mechanical",
        subject: "Mechanics",
        genre: "Engineering",
        description:
            "Fundamentals of engineering mechanics with practical examples.",
        totalCopies: 5,
        availableCopies: 2,
        rating: 4.5,
        popular: false,
        recommended: false,
    },

    {
        id: "BK010",
        name: "Fluid Mechanics",
        author: "Frank M. White",
        publisher: "McGraw Hill",
        published: "2020",
        stream: "Mechanical",
        subject: "Fluid Mechanics",
        genre: "Engineering",
        description:
            "Fundamental principles of fluid mechanics and engineering applications.",
        totalCopies: 6,
        availableCopies: 1,
        rating: 4.5,
        popular: false,
        recommended: false,
    },

    {
        id: "BK011",
        name: "Structural Analysis",
        author: "R.C. Hibbeler",
        publisher: "Pearson",
        published: "2021",
        stream: "Civil",
        subject: "Structural Engineering",
        genre: "Engineering",
        description:
            "Analysis and design concepts for structural engineering.",
        totalCopies: 5,
        availableCopies: 4,
        rating: 4.4,
        popular: false,
        recommended: false,
    },

    {
        id: "BK012",
        name: "Marketing Management",
        author: "Philip Kotler",
        publisher: "Pearson",
        published: "2020",
        stream: "Management",
        subject: "Marketing",
        genre: "Management",
        description:
            "Core concepts and strategies of modern marketing management.",
        totalCopies: 6,
        availableCopies: 3,
        rating: 4.6,
        popular: false,
        recommended: false,
    },
];


// ======================================================
// DUMMY CURRENT RENTALS
// ======================================================

const dummyRentals = [
    {
        bookId: "BK001",
        bookName: "Database System Concepts",
        rentDate: "2026-08-10",
        returnDate: "2026-08-24",
        status: "Active",
    },

    {
        bookId: "BK005",
        bookName: "Artificial Intelligence",
        rentDate: "2026-08-15",
        returnDate: "2026-08-29",
        status: "Active",
    },
];


// ======================================================
// DUMMY RESERVATIONS
// ======================================================

const dummyReservations = [
    {
        bookId: "BK004",
        bookName: "Clean Code",
        queuePosition: 2,
        reservedDate: "2026-08-20",
        status: "Waiting",
    },
];


// ======================================================
// COMPONENT
// ======================================================

const LibraryPage = () => {

    // --------------------------------------------------
    // STATES
    // --------------------------------------------------

    const [books] = useState(dummyBooks);
    const [cancelReservationState, setCancelReservationState] = useState(false);

    const [activeTab, setActiveTab] =
        useState("books");

    const [search, setSearch] =
        useState("");

    const [streamFilter, setStreamFilter] =
        useState("All");

    const [subjectFilter, setSubjectFilter] =
        useState("All");

    const [authorFilter, setAuthorFilter] =
        useState("All");

    const [publisherFilter, setPublisherFilter] =
        useState("All");

    const [genreFilter, setGenreFilter] =
        useState("All");

    const [showFilters, setShowFilters] =
        useState(false);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [showRentPopup, setShowRentPopup] =
        useState(false);

    const [rentDate, setRentDate] =
        useState("");

    const [page, setPage] =
        useState(1);

    const booksPerPage = 6;


    // --------------------------------------------------
    // FILTER OPTIONS
    // --------------------------------------------------

    const streams = [
        "All",
        ...new Set(books.map((book) => book.stream)),
    ];

    const subjects = [
        "All",
        ...new Set(books.map((book) => book.subject)),
    ];

    const authors = [
        "All",
        ...new Set(books.map((book) => book.author)),
    ];

    const publishers = [
        "All",
        ...new Set(books.map((book) => book.publisher)),
    ];

    const genres = [
        "All",
        ...new Set(books.map((book) => book.genre)),
    ];


    // ==================================================
    // PERSONALIZED RECOMMENDATION
    // ==================================================

    const rentedBooks = books.filter((book) =>
        dummyStudent.booksRented.includes(book.id)
    );

    const rentedGenres = [
        ...new Set(
            rentedBooks.map((book) => book.genre)
        ),
    ];

    const recommendedBooks = books.filter(
        (book) =>
            !dummyStudent.booksRented.includes(book.id) &&
            (
                book.recommended ||
                rentedGenres.includes(book.genre)
            )
    );


    // ==================================================
    // SEARCH + FILTER
    // ==================================================

    const filteredBooks = useMemo(() => {

        return books.filter((book) => {

            const matchesSearch =
                book.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                book.author
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                book.subject
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                book.publisher
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStream =
                streamFilter === "All" ||
                book.stream === streamFilter;

            const matchesSubject =
                subjectFilter === "All" ||
                book.subject === subjectFilter;

            const matchesAuthor =
                authorFilter === "All" ||
                book.author === authorFilter;

            const matchesPublisher =
                publisherFilter === "All" ||
                book.publisher === publisherFilter;

            const matchesGenre =
                genreFilter === "All" ||
                book.genre === genreFilter;

            return (
                matchesSearch &&
                matchesStream &&
                matchesSubject &&
                matchesAuthor &&
                matchesPublisher &&
                matchesGenre
            );
        });

    }, [
        books,
        search,
        streamFilter,
        subjectFilter,
        authorFilter,
        publisherFilter,
        genreFilter,
    ]);


    // ==================================================
    // PAGINATION
    // ==================================================

    const totalPages =
        Math.ceil(
            filteredBooks.length /
            booksPerPage
        );

    const paginatedBooks =
        filteredBooks.slice(
            (page - 1) * booksPerPage,
            page * booksPerPage
        );


    // ==================================================
    // FINE CHECK
    // ==================================================

    const canBorrow =
        dummyStudent.fine <
        dummyStudent.fineLimit;


    // ==================================================
    // OPEN BOOK
    // ==================================================

    const openBook = (book) => {

        setSelectedBook(book);

        setRentDate("");

        setReturnDate("");

    };


    // ==================================================
    // CALCULATE RETURN DATE
    // ==================================================

    const calculateReturnDate = (date) => {

        if (!date) return "";

        const selectedDate = new Date(date);

        selectedDate.setDate(
            selectedDate.getDate() +
            dummyLibrary.returnDays
        );

        return selectedDate
            .toISOString()
            .split("T")[0];
    };


    // ==================================================
    // RENT BOOK
    // ==================================================

    const handleRent = () => {

        if (!canBorrow) {
            toast(
                "You cannot borrow a book because your fine has exceeded the limit."
            );

            return;
        }

        if (!rentDate) {
            toast("Please select rental date.");

            return;
        }

        if (
            selectedBook &&
            selectedBook.availableCopies <= 0
        ) {
            toast(
                "This book is currently unavailable."
            );

            return;
        }

        toast(
            `Book "${selectedBook.name}" booked successfully!`
        );

        setShowRentPopup(false);

        setSelectedBook(null);
    };


    // ==================================================
    // RESERVE BOOK
    // ==================================================

    const handleReserve = () => {

        if (!canBorrow) {

            toast(
                "You cannot reserve a book because your fine has exceeded the limit."
            );

            return;
        }

        toast(
            `You have been added to the queue for "${selectedBook.name}".`
        );

        setSelectedBook(null);
    };


    // ==================================================
    // CANCEL RESERVATION
    // ==================================================

    const cancelReservation = (bookId) => {

        setCancelReservationState(true);
    };


    // ==================================================
    // RESET FILTER
    // ==================================================

    const resetFilters = () => {

        setStreamFilter("All");
        setSubjectFilter("All");
        setAuthorFilter("All");
        setPublisherFilter("All");
        setGenreFilter("All");

        setSearch("");

        setPage(1);
    };


    // ==================================================
    // BOOK CARD
    // ==================================================

    const BookCard = ({ book }) => {

        return (

            <motion.div
                layout
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    shadow-luxury
                    overflow-hidden
                    hover:-translate-y-1
                    transition-all
                    duration-300
                "
            >
                {/* Top */}

                <div
                    className="
                        h-32
                        bg-gradient-to-br
                        from-violet-100
                        to-purple-50
                        flex
                        items-center
                        justify-center
                        relative
                    "
                >

                    <FontAwesomeIcon
                        icon={faBookOpen}
                        className="
                            text-5xl
                            text-violet-400
                        "
                    />


                    {book.popular && (

                        <span
                            className="
                                absolute
                                top-3
                                left-3
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-bold
                                text-white
                                bg-gradient-to-r
                                from-orange-400
                                to-red-500
                            "
                        >

                            <FontAwesomeIcon
                                icon={faFire}
                                className="mr-1"
                            />

                            Popular

                        </span>

                    )}

                </div>


                {/* Content */}

                <div className="p-5">

                    <h3
                        className="
                            font-extrabold
                            text-gray-800
                            text-lg
                            line-clamp-2
                        "
                    >
                        {book.name}
                    </h3>


                    <p
                        className="
                            text-sm
                            text-gray-400
                            mt-1
                        "
                    >
                        {book.author}
                    </p>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                            mt-3
                        "
                    >

                        <span
                            className="
                                px-2.5
                                py-1
                                rounded-full
                                bg-violet-50
                                text-violet-600
                                text-xs
                                font-semibold
                            "
                        >
                            {book.subject}
                        </span>

                        <span
                            className="
                                px-2.5
                                py-1
                                rounded-full
                                bg-sky-50
                                text-sky-600
                                text-xs
                                font-semibold
                            "
                        >
                            {book.genre}
                        </span>

                    </div>


                    <div
                        className="
                            flex
                            justify-between
                            items-center
                            mt-4
                        "
                    >

                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >

                            <FontAwesomeIcon
                                icon={faStar}
                                className="
                                    text-yellow-400
                                    mr-1
                                "
                            />

                            {book.rating}

                        </span>


                        <span
                            className={`
                                text-xs
                                font-bold
                                ${book.availableCopies > 0
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                }
                            `}
                        >

                            {book.availableCopies > 0
                                ? `${book.availableCopies} available`
                                : "Unavailable"}

                        </span>

                    </div>


                    <button
                        onClick={() =>
                            openBook(book)
                        }
                        className="
                            w-full
                            mt-4
                            py-2.5
                            rounded-full
                            bg-gradient-to-r
                            from-violet-400
                            to-violet-600
                            text-white
                            font-bold
                            text-sm
                            flex
                            items-center
                            justify-center
                            gap-2
                            border-none
                            cursor-pointer
                        "
                    >

                        View Details

                        <FontAwesomeIcon
                            icon={faArrowRight}
                        />

                    </button>

                </div>

            </motion.div>

        );
    };


    // ==================================================
    // RETURN UI
    // ==================================================

    return (

        <div
            className="
                min-h-[90vh]
                bg-gradient-to-br
                from-peach
                via-cream
                to-blush-light/60
                px-5
                py-8
                overflow-y-auto
            "
        >

            <div className="max-w-7xl mx-auto">


                {/* ======================================
                    HEADER
                ======================================= */}

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5
                        mb-8
                    "
                >

                    <div>

                        <span className="section-label">
                            Institute Library
                        </span>

                        <h1
                            className="
                                text-4xl
                                font-extrabold
                                text-gray-800
                                mt-2
                            "
                        >
                            Library
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-1
                            "
                        >
                            Discover, borrow and manage your books.
                        </p>

                    </div>


                    {/* Fine */}

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            px-5
                            py-3
                            shadow-luxury
                            border
                            border-gray-100
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-gray-400
                            "
                        >
                            Outstanding Fine
                        </p>

                        <p
                            className={`
                                text-xl
                                font-extrabold
                                ${dummyStudent.fine >=
                                    dummyStudent.fineLimit
                                    ? "text-red-500"
                                    : "text-gray-800"
                                }
                            `}
                        >

                            ₹{dummyStudent.fine}

                            <span
                                className="
                                    text-xs
                                    text-gray-400
                                    font-normal
                                    ml-1
                                "
                            >
                                / ₹{dummyStudent.fineLimit}
                            </span>

                        </p>

                    </div>

                </div>


                {/* ======================================
                    RETURN POLICY
                ======================================= */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        p-5
                        shadow-luxury
                        border
                        border-gray-100
                        mb-8
                    "
                >
                    <div className="flex items-center gap-3 mb-4">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-violet-50
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <FontAwesomeIcon
                                icon={faClock}
                                className="text-violet-500"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-extrabold text-gray-800">
                                Return Policy
                            </h2>
                            <p className="text-xs text-gray-400">
                                Library borrowing policy
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="p-4 rounded-2xl bg-violet-50">
                            <p className="text-xs text-gray-400">
                                Return Period
                            </p>
                            <p className="text-xl font-extrabold text-violet-600 mt-1">
                                {dummyLibrary.returnDays} Days
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Books must be returned within this period.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50">
                            <p className="text-xs text-gray-400">
                                Fine Limit
                            </p>
                            <p className="text-xl font-extrabold text-amber-600 mt-1">
                                ₹{dummyLibrary.fineLimit}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Borrowing is blocked when the fine exceeds this limit.
                            </p>
                        </div>

                    </div>
                </div>


                {/* ======================================
                    NAVIGATION TABS
                ======================================= */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        p-2
                        shadow-luxury
                        border
                        border-gray-100
                        flex
                        gap-2
                        overflow-x-auto
                        mb-8
                    "
                >

                    {[
                        ["books", faBook, "Browse Books"],
                        ["recommended", faStar, "Recommended"],
                        ["rented", faBookOpen, "My Books"],
                        ["reservations", faBookmark, "Reservations"],
                        ["history", faHistory, "History"],
                    ].map(
                        ([
                            key,
                            icon,
                            label,
                        ]) => (

                            <button
                                key={key}
                                onClick={() =>
                                    setActiveTab(key)
                                }
                                className={`
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    whitespace-nowrap
                                    font-semibold
                                    text-sm
                                    flex
                                    items-center
                                    gap-2
                                    border-none
                                    cursor-pointer
                                    transition

                                    ${activeTab === key
                                        ? "bg-violet-500 text-white"
                                        : "bg-transparent text-gray-500 hover:bg-violet-50"
                                    }
                                `}
                            >

                                <FontAwesomeIcon
                                    icon={icon}
                                />

                                {label}

                            </button>

                        )
                    )}

                </div>


                {/* ======================================
                    RECOMMENDED
                ======================================= */}

                {activeTab === "recommended" && (

                    <section>

                        <div className="mb-6">

                            <h2
                                className="
                                    text-2xl
                                    font-extrabold
                                    text-gray-800
                                "
                            >
                                Recommended For You
                            </h2>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-1
                                "
                            >
                                Based on your previous rented books
                            </p>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            {recommendedBooks.map(
                                (book) => (

                                    <BookCard
                                        key={book.id}
                                        book={book}
                                    />

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* ======================================
                    BROWSE BOOKS
                ======================================= */}

                {activeTab === "books" && (

                    <section>


                        {/* Search */}

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                p-5
                                shadow-luxury
                                border
                                border-gray-100
                                mb-7
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        relative
                                        flex-1
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faMagnifyingGlass}
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
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(
                                                e.target.value
                                            );
                                            setPage(1);
                                        }}
                                        placeholder="Search books, authors, subjects or publishers..."
                                        className="
                                            w-full
                                            py-3
                                            pl-11
                                            pr-4
                                            rounded-2xl
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            outline-none
                                            focus:border-violet-400
                                        "
                                    />

                                </div>


                                <button
                                    onClick={() =>
                                        setShowFilters(
                                            !showFilters
                                        )}
                                    className="
                                        px-6
                                        py-3
                                        rounded-2xl
                                        bg-violet-50
                                        text-violet-600
                                        border-none
                                        font-bold
                                        cursor-pointer
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faFilter}
                                    />

                                    Filters

                                </button>

                            </div>


                            {/* Filters */}

                            <AnimatePresence>

                                {showFilters && (

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        className="
                                            grid
                                            grid-cols-1
                                            md:grid-cols-2
                                            lg:grid-cols-5
                                            gap-3
                                            mt-5
                                            overflow-hidden
                                        "
                                    >

                                        {[
                                            [
                                                "Stream",
                                                streamFilter,
                                                setStreamFilter,
                                                streams,
                                            ],
                                            [
                                                "Subject",
                                                subjectFilter,
                                                setSubjectFilter,
                                                subjects,
                                            ],
                                            [
                                                "Author",
                                                authorFilter,
                                                setAuthorFilter,
                                                authors,
                                            ],
                                            [
                                                "Publisher",
                                                publisherFilter,
                                                setPublisherFilter,
                                                publishers,
                                            ],
                                            [
                                                "Genre",
                                                genreFilter,
                                                setGenreFilter,
                                                genres,
                                            ],
                                        ].map(
                                            ([
                                                label,
                                                value,
                                                setter,
                                                options,
                                            ]) => (

                                                <select
                                                    key={label}
                                                    value={value}
                                                    onChange={(e) => {
                                                        setter(
                                                            e.target.value
                                                        );
                                                        setPage(1);
                                                    }}
                                                    className="
                                                        py-3
                                                        px-3
                                                        rounded-xl
                                                        border
                                                        border-gray-200
                                                        bg-white
                                                        text-sm
                                                        outline-none
                                                    "
                                                >

                                                    {options.map(
                                                        (option) => (

                                                            <option
                                                                key={
                                                                    option
                                                                }
                                                                value={
                                                                    option
                                                                }
                                                            >
                                                                {label}:{" "}
                                                                {option}
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            )
                                        )}


                                        <button
                                            onClick={
                                                resetFilters
                                            }
                                            className="
                                                rounded-xl
                                                bg-gray-100
                                                border-none
                                                text-gray-500
                                                font-semibold
                                                cursor-pointer
                                            "
                                        >
                                            Reset Filters
                                        </button>

                                    </motion.div>

                                )}

                            </AnimatePresence>

                        </div>


                        {/* Books */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            {paginatedBooks.length > 0 ? (

                                paginatedBooks.map(
                                    (book) => (

                                        <BookCard
                                            key={book.id}
                                            book={book}
                                        />

                                    )
                                )

                            ) : (

                                <div
                                    className="
                                        col-span-full
                                        py-20
                                        text-center
                                        text-gray-400
                                    "
                                >
                                    No books found.
                                </div>

                            )}

                        </div>


                        {/* Pagination */}

                        {totalPages > 1 && (

                            <div
                                className="
                                    flex
                                    justify-center
                                    items-center
                                    gap-3
                                    mt-8
                                "
                            >

                                <button
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage(page - 1)
                                    }
                                    className="
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-white
                                        border
                                        border-gray-200
                                        disabled:opacity-40
                                        cursor-pointer
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                    />

                                </button>


                                <span
                                    className="
                                        font-semibold
                                        text-gray-600
                                    "
                                >
                                    Page {page} of {totalPages}
                                </span>


                                <button
                                    disabled={
                                        page === totalPages
                                    }
                                    onClick={() =>
                                        setPage(page + 1)
                                    }
                                    className="
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-white
                                        border
                                        border-gray-200
                                        disabled:opacity-40
                                        cursor-pointer
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                    />

                                </button>

                            </div>

                        )}

                    </section>

                )}


                {/* ======================================
                    MY BOOKS
                ======================================= */}

                {activeTab === "rented" && (

                    <section>

                        <h2
                            className="
                                text-2xl
                                font-extrabold
                                text-gray-800
                                mb-6
                            "
                        >
                            My Books
                        </h2>


                        <div className="grid gap-4">

                            {dummyRentals.map(
                                (rental) => (

                                    <div
                                        key={rental.bookId}
                                        className="
                                            bg-white
                                            rounded-2xl
                                            p-5
                                            border
                                            border-gray-100
                                            shadow-luxury
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                            gap-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                            "
                                        >

                                            <div
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-xl
                                                    bg-violet-50
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >

                                                <FontAwesomeIcon
                                                    icon={faBook}
                                                    className="
                                                        text-violet-500
                                                        text-xl
                                                    "
                                                />

                                            </div>


                                            <div>

                                                <h3
                                                    className="
                                                        font-bold
                                                        text-gray-800
                                                    "
                                                >
                                                    {
                                                        rental.bookName
                                                    }
                                                </h3>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-gray-400
                                                        mt-1
                                                    "
                                                >
                                                    Rented:{" "}
                                                    {
                                                        rental.rentDate
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-5
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-gray-400
                                                    "
                                                >
                                                    Return Date
                                                </p>

                                                <p
                                                    className="
                                                        font-bold
                                                        text-gray-700
                                                    "
                                                >
                                                    {
                                                        rental.returnDate
                                                    }
                                                </p>

                                            </div>


                                            <span
                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-emerald-50
                                                    text-emerald-600
                                                    text-xs
                                                    font-bold
                                                "
                                            >
                                                Active
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* ======================================
                    RESERVATIONS
                ======================================= */}

                {activeTab === "reservations" && (

                    <section>

                        <h2
                            className="
                                text-2xl
                                font-extrabold
                                text-gray-800
                                mb-6
                            "
                        >
                            My Reservations
                        </h2>


                        <div className="grid gap-4">

                            {dummyReservations.map(
                                (reservation) => (

                                    <div
                                        key={
                                            reservation.bookId
                                        }
                                        className="
                                            bg-white
                                            rounded-2xl
                                            p-5
                                            border
                                            border-gray-100
                                            shadow-luxury
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-center
                                                md:justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <h3
                                                    className="
                                                        font-bold
                                                        text-gray-800
                                                    "
                                                >
                                                    {
                                                        reservation.bookName
                                                    }
                                                </h3>

                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-400
                                                        mt-1
                                                    "
                                                >
                                                    Reserved on{" "}
                                                    {
                                                        reservation.reservedDate
                                                    }
                                                </p>

                                            </div>


                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        text-center
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                        "
                                                    >
                                                        Queue Position
                                                    </p>

                                                    <p
                                                        className="
                                                            text-2xl
                                                            font-extrabold
                                                            text-violet-600
                                                        "
                                                    >
                                                        #
                                                        {
                                                            reservation.queuePosition
                                                        }
                                                    </p>

                                                </div>


                                                <button
                                                    onClick={() =>
                                                        cancelReservation(
                                                            reservation.bookId
                                                        )
                                                    }
                                                    className="
                                                        px-4
                                                        py-2
                                                        rounded-full
                                                        bg-red-50
                                                        text-red-500
                                                        border-none
                                                        font-semibold
                                                        cursor-pointer
                                                    "
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* ======================================
                    HISTORY
                ======================================= */}

                {activeTab === "history" && (

                    <section>

                        <h2
                            className="
                                text-2xl
                                font-extrabold
                                text-gray-800
                                mb-6
                            "
                        >
                            Rental History
                        </h2>


                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-luxury
                                border
                                border-gray-100
                                overflow-hidden
                            "
                        >

                            <div className="overflow-x-auto">

                                <table
                                    className="
                                        w-full
                                        text-left
                                    "
                                >

                                    <thead
                                        className="
                                            bg-gray-50
                                        "
                                    >

                                        <tr>

                                            <th className="p-4">
                                                Book
                                            </th>

                                            <th className="p-4">
                                                Rent Date
                                            </th>

                                            <th className="p-4">
                                                Return Date
                                            </th>

                                            <th className="p-4">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {dummyRentals.map(
                                            (rental) => (

                                                <tr
                                                    key={
                                                        rental.bookId
                                                    }
                                                    className="
                                                        border-t
                                                        border-gray-100
                                                    "
                                                >

                                                    <td className="p-4 font-semibold">
                                                        {
                                                            rental.bookName
                                                        }
                                                    </td>

                                                    <td className="p-4 text-gray-500">
                                                        {
                                                            rental.rentDate
                                                        }
                                                    </td>

                                                    <td className="p-4 text-gray-500">
                                                        {
                                                            rental.returnDate
                                                        }
                                                    </td>

                                                    <td className="p-4">

                                                        <span
                                                            className="
                                                                px-3
                                                                py-1
                                                                rounded-full
                                                                bg-emerald-50
                                                                text-emerald-600
                                                                text-xs
                                                                font-bold
                                                            "
                                                        >
                                                            Returned
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>

                )}

            </div>


            {/* ==================================================
                BOOK DETAILS POPUP
            ================================================== */}

            <AnimatePresence>

                {selectedBook && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-[1000]
                            flex
                            items-center
                            justify-center
                            p-5
                        "
                    >

                        {/* Overlay */}

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            onClick={() =>
                                setSelectedBook(null)
                            }
                            className="
                                absolute
                                inset-0
                                bg-gray-900/50
                                backdrop-blur-sm
                            "
                        />


                        {/* Modal */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20,
                            }}
                            className="
                                relative
                                bg-white
                                rounded-3xl
                                shadow-luxury-xl
                                w-full
                                max-w-2xl
                                max-h-[90vh]
                                overflow-y-auto
                                z-10
                            "
                        >

                            {/* Top */}

                            <div
                                className="
                                    h-40
                                    bg-gradient-to-br
                                    from-violet-100
                                    to-purple-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <FontAwesomeIcon
                                    icon={faBookOpen}
                                    className="
                                        text-6xl
                                        text-violet-400
                                    "
                                />

                            </div>


                            <button
                                onClick={() =>
                                    setSelectedBook(null)
                                }
                                className="
                                    absolute
                                    top-4
                                    right-4
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-white
                                    text-gray-500
                                    border-none
                                    shadow
                                    cursor-pointer
                                "
                            >

                                <FontAwesomeIcon
                                    icon={faXmark}
                                />

                            </button>


                            <div className="p-7">

                                <div
                                    className="
                                        flex
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div>

                                        <h2
                                            className="
                                                text-2xl
                                                font-extrabold
                                                text-gray-800
                                            "
                                        >
                                            {
                                                selectedBook.name
                                            }
                                        </h2>

                                        <p
                                            className="
                                                text-gray-400
                                                mt-1
                                            "
                                        >
                                            {
                                                selectedBook.author
                                            }
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            text-yellow-500
                                            font-bold
                                        "
                                    >

                                        <FontAwesomeIcon
                                            icon={faStar}
                                        />

                                        {
                                            selectedBook.rating
                                        }

                                    </span>

                                </div>


                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                        leading-relaxed
                                        mt-5
                                    "
                                >
                                    {
                                        selectedBook.description
                                    }
                                </p>


                                {/* Details */}

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        md:grid-cols-4
                                        gap-3
                                        mt-6
                                    "
                                >

                                    {[
                                        [
                                            "Stream",
                                            selectedBook.stream,
                                        ],
                                        [
                                            "Subject",
                                            selectedBook.subject,
                                        ],
                                        [
                                            "Publisher",
                                            selectedBook.publisher,
                                        ],
                                        [
                                            "Published",
                                            selectedBook.published,
                                        ],
                                    ].map(
                                        ([label, value]) => (

                                            <div
                                                key={label}
                                                className="
                                                    p-3
                                                    rounded-xl
                                                    bg-gray-50
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-xs
                                                        text-gray-400
                                                    "
                                                >
                                                    {label}
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-bold
                                                        text-gray-700
                                                        mt-1
                                                    "
                                                >
                                                    {value}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* Availability */}

                                <div
                                    className="
                                        mt-5
                                        p-4
                                        rounded-2xl
                                        bg-gray-50
                                        flex
                                        justify-between
                                        items-center
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-gray-400
                                            "
                                        >
                                            Availability
                                        </p>

                                        <p
                                            className="
                                                font-bold
                                                text-gray-800
                                                mt-1
                                            "
                                        >
                                            {
                                                selectedBook.availableCopies
                                            }{" "}
                                            /{" "}
                                            {
                                                selectedBook.totalCopies
                                            }{" "}
                                            copies available
                                        </p>

                                    </div>


                                    <FontAwesomeIcon
                                        icon={
                                            selectedBook.availableCopies >
                                                0
                                                ? faCircleCheck
                                                : faCircleExclamation
                                        }
                                        className={`
                                            text-2xl
                                            ${selectedBook.availableCopies >
                                                0
                                                ? "text-emerald-500"
                                                : "text-red-500"
                                            }
                                        `}
                                    />

                                </div>


                                {/* Fine warning */}

                                {!canBorrow && (

                                    <div
                                        className="
                                            mt-4
                                            p-4
                                            rounded-2xl
                                            bg-red-50
                                            border
                                            border-red-100
                                            text-red-600
                                            text-sm
                                        "
                                    >

                                        <FontAwesomeIcon
                                            icon={
                                                faCircleExclamation
                                            }
                                            className="mr-2"
                                        />

                                        Your outstanding fine has
                                        exceeded the borrowing limit.

                                    </div>

                                )}


                                {/* Actions */}

                                <div
                                    className="
                                        flex
                                        gap-3
                                        mt-6
                                    "
                                >

                                    {selectedBook.availableCopies >
                                        0 ? (

                                        <button
                                            disabled={
                                                !canBorrow
                                            }
                                            onClick={() =>
                                                setShowRentPopup(
                                                    true
                                                )
                                            }
                                            className="
                                                flex-1
                                                py-3
                                                rounded-full
                                                bg-gradient-to-r
                                                from-violet-400
                                                to-violet-600
                                                text-white
                                                font-bold
                                                border-none
                                                disabled:bg-gray-300
                                                disabled:opacity-50
                                                cursor-pointer
                                            "
                                        >
                                            Rent Book
                                        </button>

                                    ) : (

                                        <button
                                            disabled={
                                                !canBorrow
                                            }
                                            onClick={
                                                handleReserve
                                            }
                                            className="
                                                flex-1
                                                py-3
                                                rounded-full
                                                bg-gradient-to-r
                                                from-sky-400
                                                to-sky-600
                                                text-white
                                                font-bold
                                                border-none
                                                disabled:bg-gray-300
                                                disabled:opacity-50
                                                cursor-pointer
                                            "
                                        >

                                            Join Queue

                                        </button>

                                    )}

                                </div>

                            </div>

                        </motion.div>

                    </div>

                )}

            </AnimatePresence>


            {/* ==================================================
                RENT POPUP
            ================================================== */}

            <AnimatePresence>

                {showRentPopup && selectedBook && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-[1100]
                            flex
                            items-center
                            justify-center
                            p-5
                        "
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="
                                absolute
                                inset-0
                                bg-gray-900/50
                                backdrop-blur-sm
                            "
                        />


                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            className="
                                relative
                                bg-white
                                rounded-3xl
                                shadow-luxury-xl
                                w-full
                                max-w-md
                                p-7
                                z-10
                            "
                        >

                            <button
                                onClick={() =>
                                    setShowRentPopup(false)
                                }
                                className="
                                    absolute
                                    top-4
                                    right-4
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-gray-100
                                    border-none
                                    cursor-pointer
                                "
                            >

                                <FontAwesomeIcon
                                    icon={faXmark}
                                />

                            </button>


                            <h2
                                className="
                                    text-2xl
                                    font-extrabold
                                    text-gray-800
                                "
                            >
                                Rent Book
                            </h2>


                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-1
                                "
                            >
                                {selectedBook.name}
                            </p>


                            {/* Availability */}

                            <div
                                className="
                                    mt-5
                                    p-4
                                    rounded-2xl
                                    bg-emerald-50
                                    text-emerald-700
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    {selectedBook.availableCopies}{" "}
                                    copies currently available
                                </p>

                            </div>


                            {/* Rent Date */}

                            <div className="mt-5">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-600
                                        mb-2
                                    "
                                >
                                    Rent Date
                                </label>

                                <div className="relative">

                                    <FontAwesomeIcon
                                        icon={faCalendarDays}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="date"
                                        value={rentDate}
                                        onChange={(e) =>
                                            setRentDate(
                                                e.target.value
                                            )
                                        }
                                        min={new Date().toISOString().split("T")[0]}
                                        className="
                                            w-full
                                            pl-11
                                            pr-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-gray-200
                                            outline-none
                                            focus:border-violet-400
                                        "
                                    />

                                </div>

                            </div>


                            {/* Return Date */}

                            <div className="mt-4">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-600
                                        mb-2
                                    "
                                >
                                    Expected Return Date
                                </label>

                                <div
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        flex
                                        items-center
                                        gap-3
                                        text-gray-700
                                        font-semibold
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faCalendarDays}
                                        className="text-violet-500"
                                    />

                                    {rentDate
                                        ? calculateReturnDate(rentDate)
                                        : "Select rent date first"
                                    }

                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Automatically calculated based on the library return policy of {" "}
                                    <span className="font-semibold text-gray-500">
                                        {dummyLibrary.returnDays} days
                                    </span>.
                                </p>

                            </div>


                            {/* Buttons */}

                            <div
                                className="
                                    flex
                                    gap-3
                                    mt-6
                                "
                            >

                                <button
                                    onClick={() =>
                                        setShowRentPopup(
                                            false
                                        )
                                    }
                                    className="
                                        flex-1
                                        py-3
                                        rounded-full
                                        bg-gray-100
                                        border-none
                                        font-semibold
                                        text-gray-600
                                        cursor-pointer
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={handleRent}
                                    className="
                                        flex-1
                                        py-3
                                        rounded-full
                                        bg-gradient-to-r
                                        from-emerald-400
                                        to-emerald-600
                                        text-white
                                        border-none
                                        font-bold
                                        cursor-pointer
                                    "
                                >
                                    Confirm Rent
                                </button>

                            </div>

                        </motion.div>

                    </div>

                )}

            </AnimatePresence>
            {cancelReservationState && <PopWindow userType="library" onClose={() => setCancelReservationState(false)} onProceed={() => { toast("Reservation cancelled."); setCancelReservationState(false); }} />}

        </div>
    );
}

export default LibraryPage;