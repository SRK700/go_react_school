import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Register from "./Components/Register";

import User from "./Components/User";
import Student from "./Components/Student";
import Subject from "./Components/Subject";
import Teacher from "./Components/Teacher";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear(); // เคลียร์ข้อมูลใน localStorage
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />{" "}
      {/* ส่งฟังก์ชัน handleLogout เข้าไปใน Navbar */}
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/User"
          element={isLoggedIn ? <User /> : <Navigate to="/login" />}
        />
        <Route
          path="/Student"
          element={isLoggedIn ? <Student /> : <Navigate to="/login" />}
        />
        <Route
          path="/Subject"
          element={isLoggedIn ? <Subject /> : <Navigate to="/login" />}
        />
        <Route
          path="/Teacher"
          element={isLoggedIn ? <Teacher /> : <Navigate to="/login" />}
        />
      </Routes>

    </>
  );
}

export default App;