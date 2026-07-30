import { useEffect, useState } from "react";
import { getNews } from "../services/news";

function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getNews();
      setNews(data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Новости</h2>
      {news.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
}

export default NewsFeed;
