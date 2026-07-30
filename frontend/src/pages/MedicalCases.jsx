import { useEffect, useState } from "react";
import {
  getMedicalCases,
  createMedicalCase,
  createMedicalDonation,
} from "../services/medical";

import "../styles/MedicalCases.css";

function MedicalCases() {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    patient_name: "",
    diagnosis: "",
    story: "",
    amount_needed: "",
  });

  const [donation, setDonation] = useState({});

  // Получение медицинских заявок
  const loadCases = async () => {
    try {
      const data = await getMedicalCases();
      setCases(data);
    } catch (error) {
      console.error("Ошибка загрузки медицинских заявок:", error);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Создание новой заявки
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createMedicalCase({
        ...form,
        amount_needed: Number(form.amount_needed),
      });

      // Очищаем форму
      setForm({
        patient_name: "",
        diagnosis: "",
        story: "",
        amount_needed: "",
      });

      // Обновляем список
      await loadCases();

      // Закрываем форму
      setShowForm(false);
    } catch (error) {
      console.error("Ошибка создания заявки:", error);
    }
  };

  // Пожертвование
  const handleDonate = async (caseId) => {
    const amount = Number(donation[caseId] || 0);

    if (amount <= 0) {
      return;
    }

    try {
      await createMedicalDonation({
        medical_case: caseId,
        amount,
      });

      // Очищаем поле пожертвования
      setDonation((prev) => ({
        ...prev,
        [caseId]: "",
      }));

      // Обновляем суммы
      await loadCases();
    } catch (error) {
      console.error("Ошибка пожертвования:", error);
    }
  };

  return (
    <div className="medical-page">
      {/* Заголовок */}
      <div className="medical-header">
        <span className="medical-tag">
          MAMYK CARE
        </span>

        <h1>Медицинская помощь</h1>

        <p>
          Помогите семьям собрать средства
          на необходимое лечение детей.
        </p>
      </div>

      {/* Кнопка добавления заявки */}
      <div className="medical-create-section">
        <button
          type="button"
          className="medical-add-btn"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Закрыть" : "+ Добавить заявку"}
        </button>

        {/* Форма появляется только после нажатия */}
        {showForm && (
          <form
            className="medical-form"
            onSubmit={handleSubmit}
          >
            <h2>Создать заявку</h2>

            <input
              type="text"
              placeholder="Имя пациента"
              value={form.patient_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient_name: e.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Диагноз"
              value={form.diagnosis}
              onChange={(e) =>
                setForm({
                  ...form,
                  diagnosis: e.target.value,
                })
              }
              required
            />

            <textarea
              placeholder="Опишите историю и необходимую помощь"
              value={form.story}
              onChange={(e) =>
                setForm({
                  ...form,
                  story: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              min="1"
              placeholder="Необходимая сумма (₸)"
              value={form.amount_needed}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount_needed: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              Отправить заявку
            </button>
          </form>
        )}
      </div>

      {/* Медицинские сборы */}
      <div className="cases-grid">
        {cases.map((item) => {
          const needed = Number(item.amount_needed) || 0;
          const collected = Number(item.amount_collected) || 0;

          const progress =
            needed > 0
              ? Math.min(
                  Math.round((collected / needed) * 100),
                  100
                )
              : 0;

          return (
            <div
              key={item.id}
              className="case-card"
            >
              <span className="case-tag">
                Медицинская помощь
              </span>

              <h2>{item.patient_name}</h2>

              <h4>{item.diagnosis}</h4>

              <p>{item.story}</p>

              {/* Прогресс сбора */}
              <div className="medical-progress">
                <div className="medical-progress-info">
                  <span>Собрано</span>
                  <strong>{progress}%</strong>
                </div>

                <div className="medical-progress-track">
                  <div
                    className="medical-progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Суммы */}
              <div className="money-box">
                <div>
                  <span>Собрано</span>

                  <strong>
                    {collected.toLocaleString("ru-RU")} ₸
                  </strong>
                </div>

                <div>
                  <span>Необходимо</span>

                  <strong>
                    {needed.toLocaleString("ru-RU")} ₸
                  </strong>
                </div>
              </div>

              {/* Пожертвование */}
              {progress < 100 && (
                <div className="medical-donation">
                  <input
                    type="number"
                    min="1"
                    placeholder="Сумма пожертвования"
                    value={donation[item.id] || ""}
                    onChange={(e) =>
                      setDonation((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => handleDonate(item.id)}
                  >
                    Поддержать сбор
                  </button>
                </div>
              )}

              {progress >= 100 && (
                <div className="medical-completed">
                  Сбор завершён
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MedicalCases;