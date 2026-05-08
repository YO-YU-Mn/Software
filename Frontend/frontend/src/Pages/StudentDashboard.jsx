import { useState, useEffect } from "react";
import useStudent from "../hooks/useStudent";
import StudentInfoCard from "../components/student/StudentInfoCard";
import RegistrationStatusCard from "../components/student/RegistrationStatusCard";
import NewsCard from "../components/student/NewsCard";


function StudentDashboard() {
  const student = useStudent();
  const [notifications, setNotifications] = useState([]);
  const [regStatus, setRegStatus] = useState("closed");
  const [loadingStatus, setLoadingStatus] = useState(true);
 

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9000/notifications/get', {
        headers: { Authorization: token }
      });
      const data = await response.json();
      setNotifications(data);
    };
    const fetchRegistrationStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:9000/settings/status', {
          headers: { Authorization: token }
        });
        const data = await res.json();
        setRegStatus(data.registrationOpen ? "open" : "closed");
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchNotifications();
    fetchRegistrationStatus();
  }, []);




  if (!student) return <p>Loading...</p>;

  return (
    <div className="dashboard">

      <StudentInfoCard student={student} />
      <RegistrationStatusCard status={regStatus} />
      <section className="news-section">
        <h2>Notifications</h2>
        <div className="news-section">
          {notifications.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;