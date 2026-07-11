import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { ensureAuthToken, getAuthHeader } from "../services/auth";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const productId = params.get("product_id");
  const size = params.get("size") || "M";
  const productName = params.get("product_name") || "Товар";

  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("creating");

    try {
      await ensureAuthToken();

      const createResponse = await axios.post("http://localhost:8000/api/orders/", {
        product_id: Number(productId),
        size,
        delivery_address: address,
      }, {
        headers: getAuthHeader(),
      });

      const createdOrder = createResponse.data;
      setOrderId(createdOrder.id);

      const payResponse = await axios.post(`http://localhost:8000/api/orders/${createdOrder.id}/pay/`, {}, {
        headers: getAuthHeader(),
      });

      if (payResponse.data.status === "paid") {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      setStatus("failed");
      const message = err?.response?.data?.detail || err?.response?.data?.error || "Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.";
      setError(message);
    }
  };

  useEffect(() => {
    if (!productId) {
      setError("Товар не выбран. Вернитесь в каталог и выберите товар.");
    }
  }, [productId]);

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
        <h1>Оформление заказа</h1>
        <p>Товар: <strong>{productName}</strong></p>

        {status === "success" && (
          <div style={{ padding: 16, background: "#e8f5e9", borderRadius: 8 }}>
            <h2>Оплата прошла успешно</h2>
            <p>Заказ #{orderId} оформлен.</p>
            <button onClick={() => navigate("/catalog")}>Вернуться в каталог</button>
          </div>
        )}

        {status === "failed" && (
          <div style={{ padding: 16, background: "#ffebee", borderRadius: 8 }}>
            <h2>Оплата не прошла</h2>
            <p>{error || "Пожалуйста, попробуйте ещё раз или перейдите к форме заявки."}</p>
            <button onClick={() => navigate("/catalog")}>Вернуться в каталог</button>
          </div>
        )}

        {status === "idle" && (
          <form onSubmit={handlePay} style={{ display: "grid", gap: 16 }}>
            <label>
              Адрес доставки
              <input value={address} onChange={(e) => setAddress(e.target.value)} required style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <label>
              Номер карты
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required placeholder="4242 4242 4242 4242" style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }} />
            </label>

            <button type="submit">Оплатить</button>
          </form>
        )}

        {status === "creating" && <p>Оформляем заказ...</p>}
      </div>
    </>
  );
}

export default Checkout;