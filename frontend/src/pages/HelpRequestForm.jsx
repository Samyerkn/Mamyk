import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createHelpRequest } from "../services/requests";
import "../styles/Requests.css";

function HelpRequestForm() {
  const [searchParams] = useSearchParams();
  const [childName, setChildName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [story, setStory] = useState("");
  const [fasteningType, setFasteningType] = useState(searchParams.get("type") || "buttons");
  const availableSizes = ["S", "M", "L", "XL"];
  const [size, setSize] = useState(searchParams.get("size") || "S");
  const [amountNeeded, setAmountNeeded] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const priceBySize = {
    S: 5000,
    M: 5000,
    L: 5000,
    XL:5000,
  };

  const productPrice = parseFloat(searchParams.get("product_price")) || priceBySize[size] || 12000;
  const maxAmount = productPrice;

  useEffect(() => {
    const prefillType = searchParams.get("type");
    const prefillSize = searchParams.get("size");
    if (prefillType) setFasteningType(prefillType);
    if (prefillSize) setSize(prefillSize);
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const amount = parseFloat(amountNeeded);

    if (!childName || !diagnosis || !story || !amountNeeded) {
      setError("Пожалуйста, заполните все поля формы.");
      setSuccess("");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setError("Введите корректную сумму для сбора.");
      setSuccess("");
      return;
    }

    if (amount > maxAmount) {
      setError(`Сумма не должна превышать сумму товара: ${maxAmount} ₸.`);
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createHelpRequest({
        child_name: childName,
        diagnosis,
        story,
        fastening_type: fasteningType,
        size,
        amount_needed: amount,
      });
      setSuccess("Заявка успешно отправлена. Она появится в публичной ленте.");
      setChildName("");
      setDiagnosis("");
      setStory("");
      setAmountNeeded("");
      navigate("/requests");
    } catch (error) {
      console.error("Help request submit error:", error);
      const message = error?.response?.data?.error || error?.message || "Не удалось отправить заявку. Попробуйте ещё раз.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="requests-page request-form-page">
        <h1>Подача заявки на помощь</h1>
        <div className="request-form-card">
          <form onSubmit={handleSubmit}>
            <label>
              Имя ребёнка
              <input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Имя ребёнка" />
            </label>
            <label>
              Диагноз
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Диагноз" />
            </label>
            <label>
              История
              <textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Расскажите о ребёнке и семье" rows={5} />
            </label>
            <div className="field-row">
              <label>
                Тип товара
                <select value={fasteningType} onChange={(e) => setFasteningType(e.target.value)}>
                  <option value="buttons">Кнопки</option>
                  <option value="magnets">Магниты</option>
                  <option value="velcro">Липучки</option>
                </select>
              </label>
              <label>
                Размер футболки
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  {availableSizes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Необходимая сумма (₸)
              <input
                type="number"
                value={amountNeeded}
                onChange={(e) => setAmountNeeded(e.target.value)}
                placeholder="Введите сумму"
                min="0"
                max={maxAmount}
                step="0.01"
              />
            </label>
            <p className="muted">Максимальная сумма для выбранного размера: {maxAmount} ₸</p>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Сохраняем..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default HelpRequestForm;
