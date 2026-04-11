import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPage';
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import RegistrationPage from "./Pages/RegistrationPage";
import SchedulePage from "./Pages/SchedulePage";
import ProtectedRoute from './components/ProtectedRoute';
import ScheduleRegistration from './Pages/ScheduleRegistration';



function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e2f',
            color: '#fff',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            direction: 'rtl',
          },
          success: {
            style: { background: '#22c55e' },
          },
          error: {
            style: { background: '#ea3535' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home_page" element={<ProtectedRoute> <StudentLayout /> </ProtectedRoute>}>
  <Route index element={<StudentDashboard />} />
  <Route path="registration" element={<RegistrationPage />} />
  <Route path="schedule" element={<SchedulePage />} />
  <Route path="schedule-registration" element={<ScheduleRegistration />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;