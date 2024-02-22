import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import User from "./Components/User";
import Student from "./Components/Student";
import Teacher from "./Components/Teacher";
import Subject from "./Components/Subject";

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/subject" element={<Subject />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
