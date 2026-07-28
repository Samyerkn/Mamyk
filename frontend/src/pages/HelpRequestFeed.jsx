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
        setError("Не удалось загрузить список заявок.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <div className="requests-page">

      <div className="requests-header">

        <span className="requests-tag">
          MAMYK CARE
        </span>

        <h1>
          Помощь детям
        </h1>

        <p>
          Каждая заявка помогает ребёнку получить адаптивную одежду,
          которая сделает повседневную жизнь комфортнее.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/requests/new")}
        >
          Подать заявку
        </button>

      </div>

      {loading && (
        <p className="loading-text">
          Загрузка...
        </p>
      )}

      {error && (
        <p className="page-error">
          {error}
        </p>
      )}

      {!loading && requests.length === 0 && (
        <div className="empty-box">
          Пока нет активных заявок.
        </div>
      )}

      <div className="request-list">

        {requests.map((request) => {

          const percent =
            request.amount_needed > 0
              ? Math.min(
                  100,
                  (request.amount_collected /
                    request.amount_needed) *
                    100
                )
              : 0;

          const fasteningType =
            request.fastening_type === "buttons"
              ? "На кнопках"
              : request.fastening_type === "magnets"
              ? "На магнитах"
              : request.fastening_type === "velcro"
              ? "На липучках"
              : request.fastening_type;

          const status =
            request.status === "pending"
              ? "Ожидает"
              : request.status === "in_progress"
              ? "В процессе"
              : request.status === "completed"
              ? "Завершено"
              : request.status;

          return (

            <div
              key={request.id}
              className="request-card"
              onClick={() =>
                navigate(`/requests/${request.id}`)
              }
            >

              <span className="card-tag">
                ❤️ Помощь ребёнку
              </span>

              <div className="request-card-header">

                <div>

                  <h2>
                    {request.child_name}
                  </h2>

                  <p className="diagnosis">
                    {request.diagnosis}
                  </p>

                </div>

                <span
                  className={`status-pill status-${request.status}`}
                >
                  {status}
                </span>

              </div>

              <p className="request-story">

                {request.story.length > 170
                  ? request.story.slice(0, 170) + "..."
                  : request.story}

              </p>

              <div className="request-info">

                <div className="info-item">

                  <span className="info-title">
                    Тип одежды
                  </span>

                  <strong>
                    👕 {fasteningType}
                  </strong>

                </div>

                <div className="info-item">

                  <span className="info-title">
                    Размер
                  </span>

                  <strong>
                    📏 {request.size}
                  </strong>

                </div>

              </div>

              <div className="progress-row">

                <div className="progress-bar-outer">

                  <div
                    className="progress-bar-inner"
                    style={{
                      width: `${percent}%`,
                    }}
                  />

                </div>

                <span>
                  {Math.round(percent)}%
                </span>

              </div>

              <div className="requests-money-box">

                <div>

                  <span>
                    Собрано
                  </span>

                  <strong>
                    {Number(
                      request.amount_collected
                    ).toLocaleString("ru-RU")} ₸
                  </strong>

                </div>

                <div>

                  <span>
                    Необходимо
                  </span>

                  <strong>
                    {Number(
                      request.amount_needed
                    ).toLocaleString("ru-RU")} ₸
                  </strong>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default HelpRequestFeed;
