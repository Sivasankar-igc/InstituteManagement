import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateInstitute from "./Pages/createInstitute";
import Login from "./Pages/login";
import Home from "./Pages/Home";
import IndexPage from "./Pages/indexPage";
import UserPage from "./Pages/userPage";
import AdminPage from "./Pages/adminPage";
import DepartmentPage from "./Pages/departmentPage";
import BatchPage from "./Pages/batchPage";
import FacultyPage from "./Pages/facultyPage";
import CreateExamPage from "./Pages/createExamPage";
import StudentPage from "./Pages/studentPage";
import AttendExam from "./Pages/attendExam";
import ResultPage from "./Pages/resultPaper";
import VisitStudentList from "./Pages/visitStudentList";
import ChangePasswordPage from "./Pages/changePassword";
import OtpPage from "./Pages/OtpPage";
import Contact from "./Pages/Contact";
import Service from "./Pages/Service";
import About from "./Pages/About";
import { AuthenticateProvider } from "./Context_API/Authentication";
import { useLoadingContext } from "./Context_API/LoadingContext";
import ScrollToTop from "./Components/Others/ScrollToTop";

import "./CSS/tailwind.css"
import "./CSS/luxury-theme.css"
import "./CSS/userPanel.css"
import "./CSS/account.css"
import "./CSS/general.css"
import "./CSS/announcement.css"
import "./CSS/popUp.css"
import "./CSS/table.css"
import "./CSS/createExamPage.css"
import "./CSS/changePassword.css"
import "./CSS/attendExam.css"
import "./CSS/showStudentInfo_exam.css"
import "./CSS/visitStudentList.css"
import "./CSS/login.css"
import "./CSS/footer.css"
import "./CSS/navigation.css"
import "./CSS/contact.css"
import "./CSS/service.css"
import "./CSS/about.css"
import "./CSS/home.css"
import "./CSS/userPage.css"
import "./CSS/premium.css"
import "./CSS/privacyPolicy.css"
import "./CSS/termsAndConditions.css"
import "./CSS/shippingAndDelivery.css"
import "./CSS/cancellationRefunding.css"
import "./CSS/batchAttendance.css"
import "./CSS/punchIn.css"
import "./CSS/attendance.css"
import "./CSS/resumeScanner.css"
import "./CSS/careerBot.css"
import "./CSS/mockExamBot.css"
import TermsAndConditions from "./Pages/TermsAndCondition";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import CancellationRefundPolicy from "./Pages/CancellationRefundingPolicy";
import ShippingAndDelivery from "./Pages/ShippingAndDelivery";
import PunchIn from "./Pages/punchIn";
import PunchOut from "./Pages/punchOut";


axios.defaults.baseURL = "http://localhost:8000/api/v1/"
// axios.defaults.baseURL = "/api/v1/"

const App = () => {

  const { isAuthenticating } = useLoadingContext()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthenticateProvider>
        {
          isAuthenticating
            ? "Loading..."
            : <Routes>
              <Route path="/" element={<Home />}>
                <Route index element={<IndexPage />} />
                <Route path="login/:loginType" element={<Login />} />
                <Route path="createInstitute" element={<CreateInstitute />} />
                <Route path="contact" element={<Contact />} />
                <Route path="services" element={<Service />} />
                <Route path="about" element={<About />} />
                <Route path="changePassword" element={<ChangePasswordPage />} />
                <Route path="generateOtp/:userType" element={<OtpPage />} />
                <Route path="terms&conditions" element={<TermsAndConditions />} />
                <Route path="privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="cancellationAndRefunding" element={<CancellationRefundPolicy />} />
                <Route path="shippingAndDelivery" element={<ShippingAndDelivery />} />
              </Route>
              <Route path="institute/:instituteId" element={<Home />} >
                <Route index element={<UserPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="department/:departmentName" element={<DepartmentPage />} />
                <Route path="department/:departmentName/batch/:batchName" element={<BatchPage />} />
                <Route path="department/:departmentName/faculty/:facultyId" element={<FacultyPage />} />
                <Route path="department/:departmentName/exam/:params" element={<CreateExamPage />} />
                <Route path="department/:departmentName/exam/:examId/studentList" element={<VisitStudentList />} />
                <Route path="student/:studentId" element={<StudentPage />} />
              </Route>
              <Route path="student/:studentId/attendExam/:examId" element={<AttendExam />} />
              <Route path="student/:studentId/resultPaper/:examId" element={<ResultPage />} />
              <Route path="department/punchIn" element={<PunchIn/>}/>
              <Route path="department/punchOut" element={<PunchOut/>}/>
            </Routes>
        }
        <ToastContainer />
      </AuthenticateProvider>
    </BrowserRouter>
  )
}

export default App;