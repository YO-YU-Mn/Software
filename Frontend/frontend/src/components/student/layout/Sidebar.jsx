import { Link } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  return (
    <div className={`student-sidebar ${open ? "open" : ""}`}>
      <h2 className="sidebar-title">Student Portal</h2>
      <nav>
        <Link to="">Home</Link>
        <Link to="/home_page/registration">تسجيل المقررات</Link>
        <Link to="/home_page/schedule">جدولي الدراسي</Link>
        <Link to="/home_page">الملف الشخصي</Link>
        <Link to="/">تسجيل خروج</Link>
      </nav>
    </div>
  );
}

export default Sidebar;