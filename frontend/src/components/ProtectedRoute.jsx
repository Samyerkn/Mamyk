import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Пока проверяем авторизацию
  if (loading) {
    return (
      <main className="loading-page">
        <div className="loading-content">
          <div className="loading-spinner"></div>

          <p>Загрузка личного кабинета...</p>
        </div>
      </main>
    );
  }

  // Если пользователь не авторизован —
  // отправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован —
  // показываем защищённую страницу
  return children;
};

export default ProtectedRoute;