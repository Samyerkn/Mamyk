import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNewsById } from "../services/news";
import "../styles/NewsDetail.css";

const API_URL = "http://127.0.0.1:8000";

function NewsDetail() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
      } catch (err) {
        setError("Не удалось загрузить новость.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id]);

  if (loading) {
    return <div className="news-detail-state">Загрузка...</div>;
  }

  if (error || !news) {
    return <div className="news-detail-state">{error}</div>;
  }

  return (
    <main className="news-detail">
      <Link to="/news" className="news-back">
        ← Все новости
      </Link>

      <article>
        <div className="news-detail-date">
          {new Date(news.created_at).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        <h1>{news.title}</h1>

        {news.image && (
          <img
            src={`${API_URL}${news.image}`}
            alt={news.title}
            className="news-detail-image"
          />
        )}

        <div className="news-detail-content">
          {news.content}
        </div>
      </article>
    </main>
  );
}

export default NewsDetail;