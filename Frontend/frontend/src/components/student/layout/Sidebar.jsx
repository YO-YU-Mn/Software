import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Sidebar({ open, setOpen, registrationOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <div className={`student-sidebar ${open ? "open" : ""}`}>
      <h2 className="sidebar-title">Student Portal</h2>
      <nav>
        <NavLink
          to="/home_page"
          end
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={handleLinkClick}
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
              handleLinkClick();
            }
          }}
        >
          تسجيل المقررات
        </NavLink>

        <NavLink
          to="/home_page/schedule"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          جدولي الدراسي
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          تسجيل خروج
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;