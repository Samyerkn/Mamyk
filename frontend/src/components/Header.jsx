import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h2>MAMYK</h2>

      <nav>
        <Link to="/catalog">Каталог</Link>
        <Link to="/requests">Заявки</Link>
        <Link to="/requests/me">Мои заявки</Link>
        <Link to="/donations/history">История помощи</Link>
        <Link to="/checkout">Оформление</Link>
        <Link to="/orders">Мои заказы</Link>
      </nav>
    </header>
  );
}

export default Header;