import { Outlet } from "react-router-dom";
import Header from "../components/student/layout/Header";
import Sidebar from "../components/student/layout/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  useEffect(() => {
    const fetchRegStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/settings/status', {
          headers: { Authorization: token }
        });
        setRegistrationOpen(res.data.registrationOpen);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegStatus();
  }, []);

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen} registrationOpen={registrationOpen} />
      <div className="content">
        <Header open={open} setOpen={setOpen} />
        <main className="main-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;