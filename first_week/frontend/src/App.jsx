import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Pages/LandingPage'
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import RegistrationPage from "./Pages/RegistrationPage";
import SchedulePage from "./Pages/SchedulePage"; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />  
        <Route path="/home_page" element={  <ProtectedRoute> <StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
