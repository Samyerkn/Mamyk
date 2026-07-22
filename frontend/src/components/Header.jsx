import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        MAMYK
      </Link>

      <nav className="header-nav">
        <Link to="/catalog">Каталог</Link>
        <Link to="/requests">Помощь детям</Link>
        <Link to="/requests/me">Мои заявки</Link>
        <Link to="/donations/history">История помощи</Link>
        <Link to="/cart">
    🛒 Корзина
</Link>
        <Link to="/orders">Мои заказы</Link>
      </nav>

      <div className="header-user">
        {user ? (
          <>
            <Link to="/profile" className="header-user-name">
              {user.full_name || "Профиль"}
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-user-name">
              Войти
            </Link>

            <Link to="/register" className="primary-button">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;