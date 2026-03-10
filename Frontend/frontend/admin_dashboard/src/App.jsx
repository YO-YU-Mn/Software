import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { INIT_COURSES, INIT_STUDENTS } from "./data/initialData";
import { Dashboard } from "./pages/Dashboard";
import { StudentsList } from "./pages/StudentsList";
import { CoursesList } from "./pages/CoursesList";
import { Reports } from "./pages/Reports";
import { AddStudentPage } from "./pages/AddStudentPage";
import { AdminFormPage } from "./pages/AdminFormPage";
import "./style.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [courses, setCourses] = useState(INIT_COURSES.map(c => ({...c})));
  const [students, setStudents] = useState(INIT_STUDENTS.map(s => ({...s, code:"SC-2024-"+s.id})));
  const [enrollments, setEnrollments] = useState(
    INIT_STUDENTS.map(s => ({
      studentCode: "SC-2024-"+s.id,
      courseId: String(INIT_COURSES.find(c => c.name===s.course)?.id || 1),
      studentName: s.name,
      courseName: s.course,
      id: s.id,
    }))
  );

  return (
    <ThemeProvider>
      <div className="app-container">
        {page === "dashboard" && <Dashboard students={students} courses={courses} enrollments={enrollments} setPage={setPage} />}
        {page === "students" && <StudentsList students={students} setPage={setPage} />}
        {page === "courses" && <CoursesList courses={courses} setCourses={setCourses} enrollments={enrollments} setPage={setPage} />}
        {page === "reports" && <Reports students={students} setPage={setPage} />}
        {page === "addStudent" && <AddStudentPage onBack={()=>setPage("dashboard")} registeredStudents={students} setRegisteredStudents={setStudents} enrollments={enrollments} setEnrollments={setEnrollments} courses={courses} />}
        {page === "addAdmin" && <AdminFormPage onBack={()=>setPage("dashboard")} />}
      </div>
    </ThemeProvider>
  );
}