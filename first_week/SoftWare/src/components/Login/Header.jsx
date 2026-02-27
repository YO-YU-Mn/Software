function Header() {
    return (
       <header className="header">
         <div className="logo" style={{ fontSize: "1.9rem" , fontWeight: "bold"}}> Faculty of Science </div>
         <div className="system-status" style={{ fontSize: "1.5rem" , fontWeight: "bold" , display: "flex" , alignItems: "center" , gap: "500px" ,textAlign: "center" }}>
         <span className="header_status-dot" ></span> System Online
         </div>
    </header>
    );
}   
export default Header;