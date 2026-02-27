function Header({ open,setOpen }) {
  return (
    <header className="student-header">
      <button onClick={() => setOpen(!open)} className="menu-btn">
        ☰
      </button>

      <h3>Welcome Youssef 👋</h3>

      <div className="notification">
        🔔
        <span className="badge">2</span>
      </div>
    </header>
  );
}

export default Header;