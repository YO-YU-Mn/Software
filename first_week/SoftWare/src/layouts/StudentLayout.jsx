import { Outlet } from "react-router-dom";
import Header from "../components/student/layout/Header";
import Sidebar from "../components/student/layout/Sidebar";
import { useState } from "react";

function StudentLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="content">
        <Header open ={open} setOpen={setOpen} />
        <main className="main-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;