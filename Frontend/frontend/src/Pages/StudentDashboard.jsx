import StudentInfoCard from "../components/student/StudentInfoCard";
import RegistrationStatusCard from "../components/student/RegistrationStatusCard";
import NewsCard from "../components/student/NewsCard";
import news from "../data/newsData";
import useStudent from "../hooks/useStudent"; // ← ضيف دي بس

function StudentDashboard() {
  const student = useStudent(); // ← ضيف دي بس

  if(!student) return <p>Loading...</p>; // ← ضيف دي بس

  return (
    <div className="dashboard">
      <StudentInfoCard student={student} />
      <RegistrationStatusCard status="open" />
      <div className="news-section">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;