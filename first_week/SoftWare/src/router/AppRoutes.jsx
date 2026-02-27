import { Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../Pages/StudentDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;