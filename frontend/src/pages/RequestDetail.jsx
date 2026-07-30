import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchHelpRequest,
  fetchDonationsByRequest,
  createDonation,
} from "../services/requests";
import "../styles/Requests.css";

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

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getStatusLabel = (status) => {
    const statuses = {
      pending: "Ожидает помощи",
      in_progress: "Сбор открыт",
      completed: "Сбор завершён",
    };

    return statuses[status] || status;
  };

  const getFasteningLabel = (type) => {
    const fasteningTypes = {
      velcro: "На липучках",
      magnets: "На магнитах",
      magnetic: "На магнитах",
      buttons: "На кнопках",
      button: "На кнопках",
    };

    return fasteningTypes[type] || type;
  };

  const loadRequest = async () => {
    try {
      const data = await fetchHelpRequest(id);
      setRequest(data);

      if (data.status === "completed") {
        setNotification("Сбор завершён.");
      }
    } catch (err) {
      console.error(err);
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

  const refetch = async () => {
    await Promise.all([
      loadRequest(),
      loadDonations(),
    ]);
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      await Promise.all([
        loadRequest(),
        loadDonations(),
      ]);

      setLoading(false);
    };

    loadAll();
  }, [id]);

  const handleDonate = async (isFullPayment = false) => {
    if (!request) return;

    // Проверка карты
    const cardNumber = localStorage.getItem("card_number");
    if (!cardNumber) {
      navigate("/profile");
      setError("Для доната нужно добавить карту в профиле.");
      return;
    }

    const remaining =
      Number(request.amount_needed) -
      Number(request.amount_collected);

    const rawAmount = isFullPayment
      ? remaining
      : parseFloat(amount);

    if (!rawAmount || rawAmount <= 0) {
      setError("Укажите сумму для взноса.");
      return;
    }

    if (rawAmount > remaining) {
      setError(
        `Осталось собрать ${formatMoney(
          remaining
        )} ₸. Укажите сумму не больше остатка.`
      );
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

      const willBeCompleted =
        isFullPayment ||
        Number(request.amount_collected) + rawAmount >=
          Number(request.amount_needed);

      await refetch();

      if (willBeCompleted) {
        setNotification(
          "Спасибо за поддержку. Сбор полностью закрыт."
        );
      } else {
        setNotification(
          "Спасибо за поддержку. Ваш взнос зарегистрирован."
        );
      }

      setAmount("");
    } catch (err) {
      console.error(err);

      setError(
        "Не удалось выполнить платёж. Попробуйте ещё раз."
      );
    } finally {
      setDonationLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="requests-page request-detail-page">
        <div className="request-state">
          Загрузка заявки...
        </div>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="requests-page request-detail-page">
        <div className="request-state">
          <h2>Заявка не найдена</h2>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            Вернуться назад
          </button>
        </div>
      </main>
    );
  }

  const amountNeeded = Number(
    request.amount_needed || 0
  );

  const amountCollected = Number(
    request.amount_collected || 0
  );

  const remaining = Math.max(
    0,
    amountNeeded - amountCollected
  );

  const percent =
    amountNeeded > 0
      ? Math.min(
          100,
          (amountCollected / amountNeeded) * 100
        )
      : 0;

  const isCompleted =
    request.status === "completed" ||
    percent >= 100;

  return (
    <main className="requests-page request-detail-page">
      <button
        className="detail-back-button"
        type="button"
        onClick={() => navigate(-1)}
      >
        ← Назад к заявкам
      </button>

      <section className="request-detail-card">
        <div className="request-detail-header">
          <div className="request-detail-title">
            <span className="detail-category">
              Заявка на адаптивную одежду
            </span>

            <h1>{request.child_name}</h1>

            <p className="detail-diagnosis">
              {request.diagnosis}
            </p>
          </div>

          <span
            className={`status-pill status-${request.status}`}
          >
            {getStatusLabel(request.status)}
          </span>
        </div>

        <div className="detail-story-section">
          <h2>О заявке</h2>

          <p className="request-story-detail">
            {request.story}
          </p>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-card">
            <span className="detail-info-label">
              Тип застёжки
            </span>

            <strong>
              {getFasteningLabel(
                request.fastening_type
              )}
            </strong>
          </div>

          <div className="detail-info-card">
            <span className="detail-info-label">
              Размер
            </span>

            <strong>{request.size}</strong>
          </div>
        </div>

        <section className="detail-fundraising">
          <div className="detail-section-heading">
            <div>
              <span className="detail-eyebrow">
                Финансирование
              </span>

              <h2>Ход сбора</h2>
            </div>

            <strong className="detail-percent">
              {Math.round(percent)}%
            </strong>
          </div>

          <div className="progress-bar-outer detail-progress">
            <div
              className="progress-bar-inner"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          <div className="detail-money-grid">
            <div className="detail-money-card">
              <span>Собрано</span>

              <strong>
                {formatMoney(amountCollected)} ₸
              </strong>
            </div>

            <div className="detail-money-card">
              <span>Необходимо</span>

              <strong>
                {formatMoney(amountNeeded)} ₸
              </strong>
            </div>

            <div className="detail-money-card">
              <span>Осталось</span>

              <strong>
                {formatMoney(remaining)} ₸
              </strong>
            </div>
          </div>
        </section>

        {notification && (
          <div className="notification success">
            {notification}
          </div>
        )}

        {error && (
          <div className="notification error">
            {error}
          </div>
        )}

        {!isCompleted ? (
          <section className="donation-form-card detail-donation">
            <div className="donation-heading">
              <span className="detail-eyebrow">
                Поддержать сбор
              </span>

              <h2>Внести помощь</h2>

              <p>
                Вы можете внести любую сумму или
                полностью закрыть оставшуюся часть
                сбора.
              </p>
            </div>

            <label className="donation-amount-field">
              Сумма взноса

              <div className="amount-input-wrapper">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="Введите сумму"
                  min="1"
                  max={remaining}
                  step="1"
                  disabled={donationLoading}
                />

                <span>₸</span>
              </div>
            </label>

            <div className="donation-actions">
              <button
                className="primary-button"
                type="button"
                disabled={donationLoading}
                onClick={() => handleDonate(false)}
              >
                {donationLoading
                  ? "Обработка..."
                  : "Пожертвовать"}
              </button>

              <button
                className="secondary-button"
                type="button"
                disabled={donationLoading}
                onClick={() => handleDonate(true)}
              >
                Закрыть сбор полностью
              </button>
            </div>
          </section>
        ) : (
          <div className="fundraising-completed">
            <div className="completed-mark">
              ✓
            </div>

            <div>
              <strong>Сбор завершён</strong>

              <p>
                Необходимая сумма полностью собрана.
                Спасибо всем, кто поддержал эту заявку.
              </p>
            </div>
          </div>
        )}

        <section className="donation-history-card detail-history">
          <div className="history-heading">
            <div>
              <span className="detail-eyebrow">
                Пожертвования
              </span>

              <h2>История помощи</h2>
            </div>

            {donations.length > 0 && (
              <span className="history-count">
                {donations.length}
              </span>
            )}
          </div>

          {!donations.length ? (
            <div className="history-empty">
              <strong>
                Пожертвований пока нет
              </strong>

              <p>
                Первый взнос появится здесь после
                поддержки сбора.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="donation-row"
                >
                  <div>
                    <span className="donation-date">
                      {new Date(
                        donation.created_at
                      ).toLocaleDateString(
                        "ru-RU",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <small>
                      Взнос в поддержку заявки
                    </small>
                  </div>

                  <strong>
                    + {formatMoney(
                      donation.amount
                    )} ₸
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default RequestDetail;