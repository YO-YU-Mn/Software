import NewsCard from "./NewsCard";

function NewsSection() {
  return (
    <section className="news-section">
      <h2>Latest Announcements</h2>

      <div className="news-list">
        <NewsCard
          title="Midterm Exams Schedule Released"
          date="Oct 12, 2026"
          description="Students can now view the midterm schedule from their dashboard."
        />
        <NewsCard
          title="Registration Deadline Reminder"
          date="Oct 20, 2026"
          description="Course registration closes at 11:59 PM."
        />
      </div>
    </section>
  );
}

export default NewsSection;