import NewsCard from "./NewsCard";

function NewsSection() {
  return (
    <section className="news-section">
      <h2>Latest Announcements</h2>

      <div className="news-list">
        <NewsCard
          title="Midterm Exams Schedule Released"
          date="March 22, 2026"
          description="Students can now view the midterm schedule from their dashboard."
        />
        <NewsCard
          title="Registration Deadline Reminder"
          date="March 20, 2026"
          description="Course registration closes at 11:59 PM."
        />
         <NewsCard
          title="Final Exams Schedule Released"
          date="May 26, 2026"
          description="best of luck to all students"
        />
        <NewsCard
          title="homework 3 deadline extended"
          date="May 26, 2026"
          description="the deadline for homework 3 has been extended to June 5, 2026."
        />
        <NewsCard
          title="upcoming maintenance"
          date="May 26, 2026"
          description="the system will be down for maintenance on June 1, 2026."
        />
        <NewsCard
          title="keep up the good work"
          date="May 26, 2026"
          description="keep up the good work students!"
        />
      </div>
    </section>
  );
}

export default NewsSection;