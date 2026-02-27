function Header({ setOpen }) {
  return (
    <header className="student-header">
      <button onClick={() => setOpen(true)} className="menu-btn">
        ☰
      </button>

      <h3>أهلاً Youssef 👋</h3>

      <div className="notification">
        🔔
        <span className="badge">2</span>
      </div>
    </header>
  );
}

export default Header;