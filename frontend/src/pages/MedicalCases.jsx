import { useEffect, useState } from "react";
import {
  getMedicalCases,
  createMedicalCase,
  createMedicalDonation,
} from "../services/medical";

import "../styles/MedicalCases.css";

function MedicalCases() {
  const [cases, setCases] = useState([]);

  const [form, setForm] = useState({
    patient_name: "",
    diagnosis: "",
    story: "",
    amount_needed: "",
  });

  const [donation, setDonation] = useState({});

  const loadCases = async () => {
    const data = await getMedicalCases();
    setCases(data);
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createMedicalCase({
      ...form,
      amount_needed: Number(form.amount_needed),
    });

    setForm({
      patient_name: "",
      diagnosis: "",
      story: "",
      amount_needed: "",
    });

    loadCases();
  };

  const handleDonate = async (caseId) => {
    await createMedicalDonation({
      medical_case: caseId,
      amount: Number(donation[caseId] || 0),
    });

    loadCases();
  };

  return (
    <div className="medical-page">

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

      <form
        className="medical-form"
        onSubmit={handleSubmit}
      >

        <h2>Создать заявку</h2>

        <input
          placeholder="Имя пациента"
          value={form.patient_name}
          onChange={(e) =>
            setForm({
              ...form,
              patient_name: e.target.value,
            })
          }
        />

        <input
          placeholder="Диагноз"
          value={form.diagnosis}
          onChange={(e) =>
            setForm({
              ...form,
              diagnosis: e.target.value,
            })
          }
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
        />

        <input
          type="number"
          placeholder="Необходимая сумма (₸)"
          value={form.amount_needed}
          onChange={(e) =>
            setForm({
              ...form,
              amount_needed: e.target.value,
            })
          }
        />

        <button type="submit">
          Создать заявку
        </button>

      </form>

      <div className="cases-grid">

        {cases.map((item) => (

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

            <div className="money-box">

              <div>
                <span>Необходимо</span>
                <strong>
                  {Number(item.amount_needed).toLocaleString("ru-RU")} ₸
                </strong>
              </div>

              <div>
                <span>Собрано</span>
                <strong>
                  {Number(item.amount_collected).toLocaleString("ru-RU")} ₸
                </strong>
              </div>

            </div>

            <input
              type="number"
              placeholder="Введите сумму"
              value={donation[item.id] || ""}
              onChange={(e) =>
                setDonation({
                  ...donation,
                  [item.id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => handleDonate(item.id)}
            >
              Помочь ребёнку
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MedicalCases;