import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await login(formData.email, formData.password);

      navigate("/profile");
    } catch (error) {
      console.error("Ошибка входа:", error);

      if (error.response?.data) {
        const backendError = error.response.data;

        if (backendError.error) {
          setError(backendError.error);
        } else if (typeof backendError === "object") {
          const messages = Object.entries(backendError)
            .map(([field, errors]) => {
              return `${field}: ${
                Array.isArray(errors)
                  ? errors.join(", ")
                  : errors
              }`;
            })
            .join(" ");

          setError(messages);
        } else {
          setError(String(backendError));
        }
      } else {
        setError(
          "Ошибка соединения с сервером. Проверьте, запущен ли Django."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Войти в аккаунт</h1>

        <p className="auth-subtitle">
          С возвращением в платформу «Мамык»
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="auth-footer">
          Ещё нет аккаунта?{" "}
          <Link to="/register">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

