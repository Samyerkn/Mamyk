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
        setError("Не удалось загрузить публичную ленту заявок.");
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  return (
    <>
      
      <div className="requests-page">
        <div className="page-title-row">
          <h1>Публичная лента заявок</h1>
          <button className="primary-button" onClick={() => navigate("/requests/new")}>Подать заявку</button>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="page-error">{error}</p>}

        {!loading && requests.length === 0 && (
          <p>Сейчас нет активных заявок. Вы можете создать первую.</p>
        )}

        <div className="request-list">
          {requests.map((request) => {
            const percent = request.amount_needed > 0
              ? Math.min(100, (request.amount_collected / request.amount_needed) * 100)
              : 0;

            return (
              <div key={request.id} className="request-card" onClick={() => navigate(`/requests/${request.id}`)}>
                <div className="request-card-header">
                  <div>
                    <h3>{request.child_name}</h3>
                    <p className="muted">{request.diagnosis}</p>
                  </div>
                  <span className={`status-pill status-${request.status}`}>{request.status.replace("_", " ")}</span>
                </div>

                <p className="request-story">{request.story}</p>

                <div className="request-tags">
                  <span>Тип: {request.fastening_type}</span>
                  <span>Размер: {request.size}</span>
                </div>

                <div className="progress-row">
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner" style={{ width: `${percent}%` }} />
                  </div>
                  <span>{Math.round(percent)}%</span>
                </div>

                <div className="request-footer">
                  <span>Собрано: {request.amount_collected} ₸</span>
                  <span>Нужно: {request.amount_needed} ₸</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default HelpRequestFeed;
