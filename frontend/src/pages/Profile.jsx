import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const getRoleName = (role) => {
    if (role === "buyer") return "Покупатель";
    if (role === "sponsor") return "Спонсор";
    return role || "Не указана";
  };

  return (
    <main className="profile-page">
      {/* PROFILE HEADER */}
      <section className="profile-welcome">
        <div>
          <p className="profile-label">ЛИЧНЫЙ КАБИНЕТ</p>

          <h1>
            Добро пожаловать,{" "}
            <span>{user?.full_name || "Пользователь"}</span>!
          </h1>

          <p className="profile-description">
            Здесь вы можете управлять своим аккаунтом и отслеживать
            активность на платформе MAMYK.
          </p>
        </div>

        <div className="profile-avatar">
          {user?.full_name
            ? user.full_name.charAt(0).toUpperCase()
            : "U"}
        </div>
      </section>

      {/* USER INFORMATION */}
      <section className="profile-info-card">
        <div className="profile-section-header">
          <div>
            <h2>Мой профиль</h2>
            <p>Основная информация вашего аккаунта</p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Имя</span>
            <strong>{user?.full_name || "Не указано"}</strong>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <strong>{user?.email || "Не указан"}</strong>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Роль</span>
            <strong>{getRoleName(user?.role)}</strong>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="profile-dashboard">
        <div className="profile-section-title">
          <h2>Моя активность</h2>
          <p>Вся важная информация в одном месте</p>
        </div>

        <div className="dashboard-grid">
          {/* FRONTEND B */}
          <div className="dashboard-card dashboard-orders">
            <div className="dashboard-card-top">
              <div className="dashboard-icon">🛍️</div>
              <span className="dashboard-badge">Фронтенд B</span>
            </div>

            <h3>Мои заказы</h3>

            <p>
              Здесь будет отображаться история ваших заказов,
              информация о товарах и статусах покупки.
            </p>

            <div className="dashboard-placeholder">
              <span>Блок для интеграции</span>
            </div>
          </div>

          {/* FRONTEND C — REQUESTS */}
          <div className="dashboard-card dashboard-requests">
            <div className="dashboard-card-top">
              <div className="dashboard-icon">🤍</div>
              <span className="dashboard-badge">Фронтенд C</span>
            </div>

            <h3>Мои заявки</h3>

            <p>
              Здесь будут отображаться ваши заявки на помощь,
              их текущий статус и прогресс сбора средств.
            </p>

            <div className="dashboard-placeholder">
              <span>Блок для интеграции</span>
            </div>
          </div>

          {/* FRONTEND C — DONATIONS */}
          <div className="dashboard-card dashboard-donations">
            <div className="dashboard-card-top">
              <div className="dashboard-icon">✨</div>
              <span className="dashboard-badge">Фронтенд C</span>
            </div>

            <h3>История помощи</h3>

            <p>
              Здесь будет отображаться история вашей помощи
              и сделанных пожертвований.
            </p>

            <div className="dashboard-placeholder">
              <span>Блок для интеграции</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
