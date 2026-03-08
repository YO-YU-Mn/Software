function NewsCard({ title, date, description }) {
  return (
    <div className="news-card">
      <h3>{title}</h3>
      <small>{date}</small>
      <p>{description}</p>
    </div>
  );
}

export default NewsCard;