import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCart, clearCart, removeFromCart } from "../services/cart";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const deleteItem = (index) => {
    removeFromCart(index);
    setCart(getCart());
  };

  const handlePay = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Корзина пуста.");
      return;
    }

    setStatus("creating");
    setError("");

    try {
      let lastOrder = null;

      // создаем заказ для каждого товара
      for (const item of cart) {
        const response = await api.post("/orders/", {
          product_id: item.id,
          size: item.size,
          delivery_address: address,
        });

        lastOrder = response.data;

        await api.post(`/orders/${lastOrder.id}/pay/`, {});
      }

      setOrderId(lastOrder.id);

      clearCart();
      setCart([]);

      setStatus("success");
    } catch (err) {
      setStatus("failed");

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Не удалось оформить заказ."
      );
    }
  };

  if (status === "success") {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto" }}>
        <h1>✅ Спасибо за покупку!</h1>

        <p>Последний заказ №{orderId} успешно оформлен.</p>

        <button onClick={() => navigate("/catalog")}>
          Вернуться в каталог
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1>🛒 Корзина</h1>

      {cart.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
              }}
            >
              <h3>{item.name}</h3>

              <p>Размер: {item.size}</p>

              <p>Цена: {item.price} ₸</p>

              <button
                onClick={() => deleteItem(index)}
              >
                Удалить
              </button>
            </div>
          ))}

          <h2>Итого: {totalPrice} ₸</h2>

          <form
            onSubmit={handlePay}
            style={{
              display: "grid",
              gap: 15,
              marginTop: 25,
            }}
          >
            <label>
              Адрес доставки

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>

            <label>
              Номер карты

              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>

            <button type="submit">
              💳 Оформить заказ
            </button>
          </form>
        </>
      )}

      {status === "creating" && (
        <p>Оформляем заказ...</p>
      )}

      {status === "failed" && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}
export default Cart;