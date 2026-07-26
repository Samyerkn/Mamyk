import { useEffect, useState } from "react";
import { getMyOrders, payOrder } from "../services/orders";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      setError("Не удалось загрузить заказы.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handlePay = async (orderId) => {
    setPayingId(orderId);
    try {
      await payOrder(orderId);
      await loadOrders();
    } catch {
      setError("Не удалось оплатить заказ.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>Мои заказы</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}

      {!loading && orders.length === 0 && <p>У вас пока нет заказов.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h3>Заказ #{order.id}</h3>
            <p>Товар: {order.product?.name || "Товар"}</p>
            <p>Размер: {order.size}</p>
            <p>Адрес: {order.delivery_address}</p>
            <p>Статус: {order.status}</p>
            <p>Сумма: {order.total_price} т.</p>
            {order.status !== "paid" && (
              <button onClick={() => handlePay(order.id)} disabled={payingId === order.id}>
                {payingId === order.id ? "Оплата..." : "Оплатить"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;