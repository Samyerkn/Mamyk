import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(formData);

      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);

      if (error.response?.data) {
        const backendError = error.response.data;

        if (typeof backendError === "object") {
          const messages = Object.entries(backendError)
            .map(([field, errors]) => {
              const message = Array.isArray(errors)
                ? errors.join(", ")
                : String(errors);

              return `${field}: ${message}`;
            })
            .join(" ");

          setError(messages);
        } else {
          setError(String(backendError));
        }
      } else {
        setError(
          "Не удалось подключиться к серверу. Проверьте, запущен ли Django."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Создать аккаунт</h1>

        <p className="auth-subtitle">
          Присоединяйтесь к платформе MAMYK
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">
              Ваше имя
            </label>

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
            <label htmlFor="email">
              Email
            </label>

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
            <label htmlFor="password">
              Пароль
            </label>

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

          <div className="form-group">
            <label htmlFor="role">
              Кто вы?
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="buyer">
                Покупатель
              </option>

              <option value="sponsor">
                Спонсор
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Регистрация..."
              : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-footer">
          Уже есть аккаунт?{" "}
          <Link to="/login">
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;