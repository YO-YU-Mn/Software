import { useState ,useEffect} from "react";
import NewsCard from "./NewsCard";

function NewsSection() {

  const [news ,setNews] =useState([]);
  useEffect(()=>{
    async function getNews(){
      const respond = await fetch(`${import.meta.env.VITE_API_URL}/news/allnews`,{method:'Get'});
      const data = await respond.json();
      setNews(data);
    }
    getNews();
  },[]);

  return (
    <>
    <section className="news-section">
       <h2>Latest Announcements</h2>
        </section>
      <div className="news-card"> 
       {news.map(item => (  
                <NewsCard
                    key={item.id}
                    title={item.title}
                    date={item.date}
                    description={item.description}
                />
            ))}
    </div>
     </>
    );
}
export default NewsSection;