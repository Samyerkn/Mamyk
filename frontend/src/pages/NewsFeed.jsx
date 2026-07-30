import { useEffect, useState } from "react";
import { getNews } from "../services/news";
import "../styles/NewsFeed.css";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

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
    <main className="news-page">
      <section className="news-header">
        <span className="news-label">MAMYK</span>
        <h1>Новости</h1>
        <p>
          Новости платформы, благотворительные инициативы
          и истории нашей работы.
        </p>
      </section>

      <section className="news-grid">
        {news.map((item) => (
          <article className="news-card" key={item.id}>
            {item.image && (
              <div className="news-image-wrapper">
                <img
                  src={`${API_URL}${item.image}`}
                  alt={item.title}
                  className="news-image"
                />
              </div>
            )}

            <div className="news-card-content">
              <span className="news-date">
                {new Date(item.created_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <h2>{item.title}</h2>

              <p>
                {item.content.length > 180
                  ? `${item.content.slice(0, 180)}...`
                  : item.content}
              </p>

              <Link to={`/news/${item.id}`} className="news-more">
  Читать далее →
</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default NewsFeed;