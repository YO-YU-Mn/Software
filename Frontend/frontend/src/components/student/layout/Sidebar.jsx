import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

function Sidebar({ open, setOpen, registrationOpen }) {
  const closeSidebar = () => setOpen(false);

  return (
    <div className={`student-sidebar ${open ? "open" : ""}`}>
      <h2 className="sidebar-title">Student Portal</h2>
      <nav>
        <NavLink
          to="/home_page"
          end
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={closeSidebar}
        >
          الملف الشخصي
        </NavLink>

        <NavLink
          to="/home_page/registration"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""} ${!registrationOpen ? "disabled" : ""}`
          }
          onClick={(e) => {
            if (!registrationOpen) {
              e.preventDefault();
              toast.error("تسجيل المواد مغلق حالياً");
            } else {
              closeSidebar();
            }
          }}
        >
          تسجيل المقررات
        </NavLink>

        <NavLink
          to="/home_page/schedule"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={closeSidebar}
        >
          جدولي الدراسي
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={closeSidebar}
        >
          تسجيل خروج
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;