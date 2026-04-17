import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Dashboard } from "./pages/Dashboard";
import { StudentsList } from "./pages/StudentsList";
import { CoursesList } from "./pages/CoursesList";
import { Reports } from "./pages/Reports";
import { AddStudentPage } from "./pages/AddStudentPage";
import { AdminFormPage } from "./pages/AdminFormPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NewsPage } from "./pages/NewsPage";
import { BulkImportPage } from "./pages/BulkImportPage";
import { BulkCourseImportPage } from "./pages/BulkCourseImportPage";
import "./style.css";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <ThemeProvider>
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
              icon: '',
              style: { background: '#22c55e' },
            },
            error: {
              icon: '',
              style: { background: '#ef4444' },
            },
          }}
        />
        <div className="app-container">
          {page === "dashboard" && <Dashboard setPage={setPage} />}
          {page === "students" && <StudentsList setPage={setPage} />}
          {page === "courses" && <CoursesList setPage={setPage} />}
          {page === "reports" && <Reports setPage={setPage} />}
          {page === "addStudent" && <AddStudentPage onBack={()=>setPage("dashboard")} />}
          {page === "addAdmin" && <AdminFormPage onBack={()=>setPage("dashboard")} />}
          {page === "notifications" && <NotificationsPage onBack={()=>setPage("dashboard")} />}
          {page === "settings" && <SettingsPage onBack={()=>setPage("dashboard")} />}
          {page === "news" && <NewsPage onBack={()=>setPage("dashboard")} />}
          {page === "bulkImport" && <BulkImportPage setPage={setPage} />}
          {page === "bulkCourseImport" && <BulkCourseImportPage setPage={setPage} />}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}