import useStudent from "../../../hooks/useStudent";
function Header({ open,setOpen }) {

  const student = useStudent(); 

  return (
    <header className="student-header">
      <button onClick={() => setOpen(!open)} className="menu-btn">
        ☰
      </button>
      <h3>Welcome {student?.name} 👋</h3>
      {/*
      <div className="notification">
        🔔
        <span className="badge">1</span>
      </div>*/}
    </header>
  );
}
export default Header;