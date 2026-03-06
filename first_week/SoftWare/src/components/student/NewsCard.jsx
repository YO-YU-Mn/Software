function NewsCard({ news }) {
  return (
    <div className="news-card">
      <h3>{news.title}</h3>
      <small>{news.date}</small>
      <p>{news.description}</p>
    </div>
  );
}

export default NewsCard;