import { useState } from "react";
import { INIT_COURSES, INIT_STUDENTS } from "./data/initialData";
import { Dashboard }       from "./pages/Dashboard";
import { StudentsList }    from "./pages/StudentsList";
import { CoursesList }     from "./pages/CoursesList";
import { Reports }         from "./pages/Reports";
import { AddStudentPage }  from "./pages/AddStudentPage";
import { AdminFormPage }   from "./pages/AdminFormPage";

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [courses, setCourses]     = useState(INIT_COURSES.map(c => ({...c})));
  const [students, setStudents]   = useState(INIT_STUDENTS.map(s => ({...s, code:"SC-2024-"+s.id})));
  const [enrollments, setEnrollments] = useState(
    INIT_STUDENTS.map(s => ({
      studentCode: "SC-2024-"+s.id,
      courseId:    String(INIT_COURSES.find(c => c.name===s.course)?.id || 1),
      studentName: s.name,
      courseName:  s.course,
      id:          s.id,
    }))
  );

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#050914", fontFamily:"'IBM Plex Mono','Courier New',monospace", color:"#e2eaf6" }}>
      <style>{`
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: #112240 #080f1e; }
        *::-webkit-scrollbar { width: 5px; height: 5px; }
        *::-webkit-scrollbar-track { background: #080f1e; }
        *::-webkit-scrollbar-thumb { background: #112240; border-radius: 10px; }
        *::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
        select option { background: #0b1528; }
      `}</style>

      {page==="dashboard"  && <Dashboard     students={students} courses={courses} enrollments={enrollments} setPage={setPage} />}
      {page==="students"   && <StudentsList  students={students} setPage={setPage} />}
      {page==="courses"    && <CoursesList   courses={courses} setCourses={setCourses} enrollments={enrollments} setPage={setPage} />}
      {page==="reports"    && <Reports       students={students} setPage={setPage} />}
      {page==="addStudent" && <AddStudentPage onBack={()=>setPage("dashboard")} registeredStudents={students} setRegisteredStudents={setStudents} enrollments={enrollments} setEnrollments={setEnrollments} courses={courses} />}
      {page==="addAdmin"   && <AdminFormPage  onBack={()=>setPage("dashboard")} />}
    </div>
  );
}
