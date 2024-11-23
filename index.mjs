import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { router as adminRouter } from "./Routes/AdminRoutes/adminRoute.mjs"
import { router as studentRouter } from "./Routes/StudentRoutes/studentRoute.mjs"
import { router as teacherRouter } from "./Routes/TeacherRoutes/teacherRoutes.mjs"
import instituteLogin from "./Controllers/instituteLogin.mjs"
import cors from "cors"
import { cloudinary_upload } from "./cloudinaryConfig/storage.mjs"
import handleUpload from "./cloudinaryConfig/handleUpload.mjs"
import checkExamTimeOver from "./Cron_Schedule/checkExamTimeOver.mjs"
import bodyParser from "body-parser"
import handleDownload from "./cloudinaryConfig/handleDownload.mjs"
import changePassword from "./Controllers/changePassword.mjs"
import sendOtp from "./Controllers/sendOtp.mjs"
import { checkUserAuthentication, logout } from "./Authenticate/authenticate.mjs"
import cookieParser from "cookie-parser";

import path, { dirname } from "path"
import { fileURLToPath } from "url";
import handleContactus from "./Controllers/handleContactus.mjs"

const PORT = process.env.PORT || 8000
const web = express()

dotenv.config()

web.use(cors())
web.use(express.json())
web.use(cookieParser())
web.use(bodyParser.json({ limit: "100mb" }))
web.use(bodyParser.urlencoded({ limit: "100mb", extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error(`Database connection error --> ${err}`))

checkExamTimeOver()

web.use("/api/v1/admin", adminRouter)
web.use("/api/v1/student", studentRouter)
web.use("/api/v1/faculty", teacherRouter)
web.post("/api/v1/institute/login", instituteLogin)

web.post("/api/v1/uploadPDF", cloudinary_upload.single("pdf"), handleUpload)
web.post("/api/v1/downloadPDF", handleDownload)

web.patch("/api/v1/changePassword", changePassword)
web.post("/api/v1/sendOtp", sendOtp)

web.get("/api/v1/authenticate", checkUserAuthentication);

web.get("/api/v1/logout", logout)

web.post("/api/v1/contactUs", handleContactus)

web.use(express.static(path.join(__dirname, "./dist")))
web.get("*", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "./dist/index.html"))
    } catch (error) {
        console.error(`Server error : couldn't get clientside files --> ${error}`)
    }
})

web.listen(PORT, () => console.log(`Server listening at port number ${PORT}`))