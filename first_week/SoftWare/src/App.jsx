import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './Pages/LandingPage'
import './App.css'
import AppRoutes from "./router/AppRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import RegistrationPage from "./Pages/RegistrationPage";
import SchedulePage from "./Pages/SchedulePage";  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        </Route>      </Routes>
    </BrowserRouter>
  );
}

export default App;
