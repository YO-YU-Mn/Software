import StudentInfoCard from "../components/student/StudentInfoCard";
import RegistrationStatusCard from "../components/student/RegistrationStatusCard";
import NewsCard from "../components/student/NewsCard";
import student from "../data/studentData";
import news from "../data/newsData";


function StudentDashboard() {
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