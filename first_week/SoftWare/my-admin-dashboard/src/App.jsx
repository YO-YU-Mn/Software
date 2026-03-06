import React, { useState } from "react";
import { INIT_COURSES, INIT_STUDENTS } from "./data";
import Sidebar        from "./Sidebar";
import Dashboard      from "./Dashboard";
import StudentsList   from "./StudentsList";
import CoursesList    from "./CoursesList";
import Reports        from "./Reports";
import AddStudentPage from "./AddStudentPage";
import AdminFormPage  from "./AdminFormPage";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const [courses, setCourses] = useState(
    INIT_COURSES.map(c => ({ ...c }))
  );

  const [students, setStudents] = useState(
    INIT_STUDENTS.map(s => ({ ...s, code: "SC-2024-" + s.id }))
  );

  const [enrollments, setEnrollments] = useState(
    INIT_STUDENTS.map(s => ({
      studentCode: "SC-2024-" + s.id,
      courseId:    String(INIT_COURSES.find(c => c.name === s.course)?.id || 1),
      studentName: s.name,
      courseName:  s.course,
      id:          s.id,
    }))
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050914", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", color: "#e2eaf6" }}>
      <style>{`* { box-sizing: border-box; } select option { background: #0b1528; }`}</style>

      <Sidebar page={page} setPage={setPage} />

      {page === "dashboard"  && <Dashboard  students={students} courses={courses} enrollments={enrollments} setPage={setPage} />}
      {page === "students"   && <StudentsList students={students} />}
      {page === "courses"    && <CoursesList  courses={courses} setCourses={setCourses} enrollments={enrollments} />}
      {page === "reports"    && <Reports      students={students} />}
      {page === "addStudent" && (
        <AddStudentPage
          onBack={() => setPage("dashboard")}
          registeredStudents={students}
          setRegisteredStudents={setStudents}
          enrollments={enrollments}
          setEnrollments={setEnrollments}
          courses={courses}
        />
      )}
      {page === "addAdmin" && <AdminFormPage onBack={() => setPage("dashboard")} />}
    </div>
  );
}
