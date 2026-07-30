import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Одежда, которая
            <br />
            <span>помогает жить</span>
          </h1>

          <p>
            MAMYK — платформа адаптивной одежды для детей и система помощи,
            которая объединяет семьи, нуждающиеся в поддержке, и людей,
            готовых помочь.
          </p>

          <div className="hero-buttons">
            <Link to="/catalog" className="primary-button">
              Перейти в каталог
            </Link>

            <Link to="/requests" className="secondary-button">
              Помочь ребёнку
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/src/assets/mamyk-hero.jpg"
            alt="Адаптивная одежда MAMYK"
          />
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">👕</div>
          <h2>Адаптивная одежда</h2>
          <p>
            Удобная одежда с адаптированными застёжками для особых потребностей
            детей.
          </p>
          <Link to="/catalog">Смотреть каталог →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤍</div>
          <h2>Помощь детям</h2>
          <p>
            Поддержите ребёнка, которому нужна помощь в приобретении
            адаптивной одежды.
          </p>
          <Link to="/requests">Посмотреть заявки →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h2>Мы вместе</h2>
          <p>
            Объединяем семьи и спонсоров, чтобы сделать помощь доступной и
            понятной.
          </p>
          <Link to="/register">Присоединиться →</Link>
        </div>
      </section>
    </main>
  );
}

export default Home;

