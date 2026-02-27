import { Link } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  return (
    <div className={`student-sidebar ${open ? "open" : ""}`}>
      <h2 className="sidebar-title">Student Portal</h2>

      <nav>
        <Link to="/student">Dashboard</Link>
        <Link to="/dashboard/registration">تسجيل المقررات</Link>
        <Link to="/dashboard/schedule">جدولي الدراسي</Link>
        <Link to="/student/results">النتائج</Link>
        <Link to="/student/fees">الرسوم الدراسية</Link>
        <Link to="/student/profile">الملف الشخصي</Link>
        <Link to="/">تسجيل خروج</Link>
      </nav>
    </div>
  );
}

export default Sidebar;