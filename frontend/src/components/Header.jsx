import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h2>MAMYK</h2>

      <nav>
        <Link to="/catalog">Каталог</Link>
        <Link to="/checkout">Оформление</Link>
      </nav>
    </header>
  );
}

export default Header;