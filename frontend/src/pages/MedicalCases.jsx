import { useEffect, useState } from "react";
import { getMedicalCases, createMedicalCase, createMedicalDonation } from "../services/medical";

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
    await createMedicalCase({ ...form, amount_needed: Number(form.amount_needed) });
    setForm({ patient_name: "", diagnosis: "", story: "", amount_needed: "" });
    loadCases();
  };

  const handleDonate = async (caseId) => {
    await createMedicalDonation({ medical_case: caseId, amount: Number(donation[caseId] || 0) });
    loadCases();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Медицинская помощь</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} placeholder="Имя пациента" />
        <input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} placeholder="Диагноз" />
        <textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} placeholder="История" />
        <input type="number" value={form.amount_needed} onChange={(e) => setForm({ ...form, amount_needed: e.target.value })} placeholder="Сумма" />
        <button type="submit">Создать кейс</button>
      </form>

      {cases.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <h3>{item.patient_name}</h3>
          <p>{item.diagnosis}</p>
          <p>{item.story}</p>
          <p>Нужно: {item.amount_needed} ₸ | Собрано: {item.amount_collected} ₸</p>
          <input value={donation[item.id] || ""} onChange={(e) => setDonation({ ...donation, [item.id]: e.target.value })} placeholder="Сумма доната" />
          <button onClick={() => handleDonate(item.id)}>Пожертвовать</button>
        </div>
      ))}
    </div>
  );
}

export default MedicalCases;
