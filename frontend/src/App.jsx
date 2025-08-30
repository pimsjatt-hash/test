 import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import FooterBar from "./components/FooterBar";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LogIn from "./pages/Login";
import SignUp from "./pages/SignUp";
import SearchBar from "./components/SearchBar";
import WhatsappButoon from "./components/WhatsappButoon";
import CoursePage from "./pages/CoursePage";
import TeacherPage from "./pages/TeacherPage";
import Studentpage from "./pages/StudentPage";

export default function App() {
  const location = useLocation();

  const hiddenRoutesNavbar = ["/admin"]; 
  const hiddenRoutesSearchbar = ["/login", "/signup", "/contact", "/about"];

  return (
    <div>
      {/* Navbar, Searchbar, WhatsApp button */}
      {!hiddenRoutesNavbar.includes(location.pathname) && (
        <div>
          <Navbar />
          {!hiddenRoutesSearchbar.includes(location.pathname) && <SearchBar />}
          <WhatsappButoon />
        </div>
      )}

      {/* Routes */}
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/student" element={<Studentpage />} />  {/* 👈 Added */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>

      {/* Footer */}
      {!hiddenRoutesNavbar.includes(location.pathname) && <FooterBar />}
    </div>
  );
}
