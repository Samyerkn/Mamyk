import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchHelpRequest, fetchDonationsByRequest, createDonation } from "../services/requests";
import "../styles/Requests.css";
import Header from "../components/Header";
function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [donationLoading, setDonationLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const loadRequest = async () => {
    try {
      const data = await fetchHelpRequest(id);
      setRequest(data);
      if (data.status === "completed") {
        setNotification("Сбор закрыт — заявка завершена.");
      }
    } catch (err) {
      setError("Не удалось загрузить заявку.");
    }
  };

  const loadDonations = async () => {
    try {
      const data = await fetchDonationsByRequest(id);
      setDonations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadRequest(), loadDonations()]);
      setLoading(false);
    };
    loadAll();
  }, [id]);

  const refetch = async () => {
    await Promise.all([loadRequest(), loadDonations()]);
  };

  const handleDonate = async (isFullPayment = false) => {
    if (!request) return;
    const rawAmount = isFullPayment
      ? request.amount_needed - request.amount_collected
      : parseFloat(amount);

    if (!rawAmount || rawAmount <= 0) {
      setError("Укажите сумму для взноса.");
      return;
    }

    setDonationLoading(true);
    setError("");
    setNotification("");

    try {
      await createDonation({
        help_request: request.id,
        amount: rawAmount,
        is_full_payment: isFullPayment,
      });
      await refetch();
      if (isFullPayment || request.amount_collected + rawAmount >= request.amount_needed) {
        setNotification("Поздравляем! Заявка закрыта по полной оплате.");
      } else {
        setNotification("Взнос зарегистрирован, прогресс обновлён.");
      }
      setAmount("");
    } catch (err) {
      setError("Не удалось выполнить платёж. Попробуйте ещё раз.");
    } finally {
      setDonationLoading(false);
    }
  };

  if (loading) {
    
    return (
      <>
        <Header />
        <div className="requests-page"><p>Загрузка...</p></div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Header />
        <div className="requests-page"><p>Заявка не найдена.</p></div>
      </>
    );
  }

  const percent = request.amount_needed > 0
    ? Math.min(100, (request.amount_collected / request.amount_needed) * 100)
    : 0;

  return (
    <>
     
      <div className="requests-page request-detail-page">
        <button className="secondary-button" onClick={() => navigate(-1)}>Назад</button>

        <div className="request-detail-card">
          <div className="request-detail-header">
            <div>
              <h1>{request.child_name}</h1>
              <p className="muted">{request.diagnosis}</p>
            </div>
            <span className={`status-pill status-${request.status}`}>{request.status.replace("_", " ")}</span>
          </div>

          <p className="request-story-detail">{request.story}</p>

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

          <div className="request-footer detail-footer">
            <span>Собрано: {request.amount_collected} ₸</span>
            <span>Нужно: {request.amount_needed} ₸</span>
          </div>

          {notification && <div className="notification success">{notification}</div>}
          {error && <div className="notification error">{error}</div>}

          <div className="donation-form-card">
            <h2>Внести помощь</h2>
            <label>
              Сумма (₸)
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                min="0"
                step="0.01"
                disabled={request.status === "completed"}
              />
            </label>
            <div className="donation-actions">
              <button
                className="primary-button"
                type="button"
                disabled={request.status === "completed" || donationLoading}
                onClick={() => handleDonate(false)}
              >
                {donationLoading ? "Запрос..." : "Пожертвовать"}
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={request.status === "completed" || donationLoading}
                onClick={() => handleDonate(true)}
              >
                Закрыть полностью
              </button>
            </div>
          </div>

          <div className="donation-history-card">
            <h2>История донатов</h2>
            {!donations.length && <p>Пока нет пожертвований.</p>}
            {donations.map((donation) => (
              <div key={donation.id} className="donation-row">
                <span>{new Date(donation.created_at).toLocaleString()}</span>
                <span>{donation.amount} ₸</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestDetail;
