import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchMyHelpRequests } from "../services/requests";
import "../styles/Requests.css";

function MyHelpRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyRequests = async () => {
      try {
        const data = await fetchMyHelpRequests();
        setRequests(data);
      } catch (err) {
        setError("Не удалось загрузить ваши заявки.");
      } finally {
        setLoading(false);
      }
    };
    loadMyRequests();
  }, []);

  return (
    <>
      <Header />
      <div className="requests-page">
        <div className="page-title-row">
          <h1>Мои заявки</h1>
          <button className="primary-button" onClick={() => navigate("/requests/new")}>Новая заявка</button>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="page-error">{error}</p>}

        {!loading && requests.length === 0 && (
          <p>У вас ещё нет заявок. Создайте первую заявку, чтобы её увидели спонсоры.</p>
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
                    <p className="muted">Статус: {request.status.replace("_", " ")}</p>
                  </div>
                  <span className={`status-pill status-${request.status}`}>{Math.round(percent)}%</span>
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

export default MyHelpRequests;
