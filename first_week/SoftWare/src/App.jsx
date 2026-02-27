import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './Pages/LandingPage'
import './App.css'
import AppRoutes from "./router/AppRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "./Pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
