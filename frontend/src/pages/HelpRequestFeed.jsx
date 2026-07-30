import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicHelpRequests } from "../services/requests";
import "../styles/Requests.css";

function HelpRequestFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchPublicHelpRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить список заявок.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const getFasteningType = (type) => {
    if (type === "buttons") return "На кнопках";
    if (type === "magnets") return "На магнитах";
    if (type === "velcro") return "На липучках";
    return type;
  };

  const getStatus = (status) => {
    if (status === "pending") return "Ожидает помощи";
    if (status === "in_progress") return "Сбор открыт";
    if (status === "completed") return "Сбор завершён";
    return status;
  };

  return (
    <main className="requests-page">
      <section className="requests-header">
        <span className="requests-tag">MAMYK CARE</span>

        <h1>Помощь детям</h1>

        <p>
          Поддержите семьи в приобретении адаптивной одежды
          для детей с особыми потребностями.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/requests/new")}
        >
          Подать заявку на помощь
        </button>
      </section>

      {loading && (
        <p className="loading-text">Загрузка заявок...</p>
      )}

      {error && (
        <p className="page-error">{error}</p>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="empty-box">
          В настоящее время активных заявок нет.
        </div>
      )}

      <section className="request-list">
        {requests.map((request) => {
          const needed = Number(request.amount_needed) || 0;
          const collected = Number(request.amount_collected) || 0;

          const percent =
            needed > 0
              ? Math.min(100, (collected / needed) * 100)
              : 0;

          const remaining = Math.max(needed - collected, 0);

          return (
            <article
              key={request.id}
              className="request-card"
              onClick={() => navigate(`/requests/${request.id}`)}
            >
              <div className="request-card-top">
                <span className="card-tag">
                  Заявка на помощь
                </span>

                <span
                  className={`status-pill status-${request.status}`}
                >
                  {getStatus(request.status)}
                </span>
              </div>

              <div className="request-main">
                <h2>{request.child_name}</h2>

                <p className="diagnosis">
                  {request.diagnosis}
                </p>

                <p className="request-story">
                  {request.story?.length > 135
                    ? `${request.story.slice(0, 135)}...`
                    : request.story}
                </p>
              </div>

              <div className="request-meta">
                <div>
                  <span>Тип одежды</span>
                  <strong>
                    {getFasteningType(request.fastening_type)}
                  </strong>
                </div>

                <div>
                  <span>Размер</span>
                  <strong>{request.size}</strong>
                </div>
              </div>

              <div className="fundraising">
                <div className="fundraising-header">
                  <div>
                    <span>Собрано</span>
                    <strong>
                      {collected.toLocaleString("ru-RU")} ₸
                    </strong>
                  </div>

                  <div className="fundraising-percent">
                    {Math.round(percent)}%
                  </div>
                </div>

                <div className="progress-bar-outer">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="fundraising-footer">
                  <span>
                    Цель: {needed.toLocaleString("ru-RU")} ₸
                  </span>

                  {remaining > 0 && (
                    <span>
                      Осталось: {remaining.toLocaleString("ru-RU")} ₸
                    </span>
                  )}
                </div>
              </div>

              <div className="request-card-footer">
                <span>Подробнее</span>
                <span aria-hidden="true">→</span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default HelpRequestFeed;