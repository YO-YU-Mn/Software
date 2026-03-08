import { GraduationCap } from "lucide-react";
function Header() {
    return (
       <header className="header">
      <div className="logo-container">
        <GraduationCap className="logo-icon" />
        <div className="logo-text">
          <h2>Faculty of Science</h2>
          <span>Academic Registration System</span>
        </div>
      </div>

      <div className="system-status">
        <span className="status-dot"></span>
        System Online
      </div>
    </header>
    );
}   
export default Header;