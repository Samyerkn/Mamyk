import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, payOrder } from "../services/orders";
import { getCart, clearCart, removeFromCart } from "../services/cart";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const deleteItem = (index) => {
    removeFromCart(index);
    setCart(getCart());
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Корзина пуста.");
      return;
    }

    setStatus("creating");
    setError("");

    try {
      const createdOrders = [];

      for (const item of cart) {
        const order = await createOrder({
          product_id: item.id,
          size: item.size,
          delivery_address: address,
        });
        createdOrders.push(order);
        await payOrder(order.id);
      }

      const lastOrder = createdOrders[createdOrders.length - 1];
      setOrderId(lastOrder?.id ?? null);
      clearCart();
      setCart([]);
      setStatus("success");
    } catch (err) {
      setStatus("failed");
      setError(err?.response?.data?.detail || err?.response?.data?.error || "Не удалось оформить заказ.");
    }
  };

  if (status === "success") {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto" }}>
        <h1>✅ Спасибо за покупку!</h1>
        <p>Заказ успешно оформлен и оплачен.</p>
        {orderId && <p>Номер заказа: #{orderId}</p>}
        <button onClick={() => navigate("/orders")}>Посмотреть мои заказы</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>🛒 Корзина</h1>

      {cart.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} style={{ border: "1px solid #ddd", padding: 15, marginBottom: 15, borderRadius: 10 }}>
              <h3>{item.name}</h3>
              <p>Размер: {item.size}</p>
              <p>Цена: {item.price} ₸</p>
              <button onClick={() => deleteItem(index)}>Удалить</button>
            </div>
          ))}

          <h2>Итого: {totalPrice} ₸</h2>

          <form onSubmit={handleCheckout} style={{ display: "grid", gap: 15, marginTop: 25 }}>
            <label>
              Адрес доставки
              <input value={address} onChange={(e) => setAddress(e.target.value)} required />
            </label>

            <button type="submit">💳 Оформить заказ</button>
          </form>
        </>
      )}

      {status === "creating" && <p>Оформляем заказ...</p>}
      {status === "failed" && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Cart;