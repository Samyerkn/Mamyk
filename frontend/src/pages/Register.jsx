import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = регистрация, 2 = карта

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [cardData, setCardData] = useState({
    card_number: "",
    card_date: "",
    card_cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      setStep(2); // переходим к шагу карты
    } catch (error) {
      if (error.response?.data) {
        const backendError = error.response.data;
        if (typeof backendError === "object") {
          const messages = Object.entries(backendError)
            .map(([field, errors]) => {
              const message = Array.isArray(errors) ? errors.join(", ") : String(errors);
              return `${field}: ${message}`;
            })
            .join(" ");
          setError(messages);
        } else {
          setError(String(backendError));
        }
      } else {
        setError("Не удалось подключиться к серверу.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();

    if (cardData.card_number.length !== 16) {
      setError("Номер карты должен содержать 16 цифр.");
      return;
    }
    if (!cardData.card_date) {
      setError("Введите срок действия карты.");
      return;
    }
    if (cardData.card_cvv.length !== 3) {
      setError("CVV должен содержать 3 цифры.");
      return;
    }

    localStorage.setItem("card_number", cardData.card_number);
    localStorage.setItem("card_date", cardData.card_date);
    localStorage.setItem("card_cvv", cardData.card_cvv);

    navigate("/");
  };

  if (step === 2) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Добавьте карту</h1>
          <p className="auth-subtitle">
            Карта нужна для оплаты заказов и донатов
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleCardSubmit}>
            <div className="form-group">
              <label>Номер карты</label>
              <input
                type="text"
                name="card_number"
                placeholder="0000 0000 0000 0000"
                maxLength={16}
                value={cardData.card_number}
                onChange={handleCardChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Срок действия</label>
              <input
                type="text"
                name="card_date"
                placeholder="MM/YY"
                value={cardData.card_date}
                onChange={handleCardChange}
                required
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                name="card_cvv"
                placeholder="•••"
                maxLength={3}
                value={cardData.card_cvv}
                onChange={handleCardChange}
                required
              />
            </div>

            <button type="submit" className="primary-button auth-submit">
              Сохранить карту
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Создать аккаунт</h1>
        <p className="auth-subtitle">Присоединяйтесь к платформе MAMYK</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Ваше имя</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              placeholder="Введите ваше имя"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Минимум 8 символов"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;