import { useEffect, useState } from "react";
import { getMyOrders, payOrder } from "../services/orders";
import "../styles/Requests.css";

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
    <div className="requests-page">

      <div className="requests-header">

        <span className="requests-tag">
          MAMYK SHOP
        </span>

        <h1>Мои заказы</h1>

        <p>
          Здесь отображаются все оформленные вами заказы.
        </p>

      </div>

      {loading && (
        <div className="loading-text">
          Загрузка...
        </div>
      )}

      {error && (
        <p className="page-error">
          {error}
        </p>
      )}

      {!loading && orders.length === 0 && (
        <div className="empty-box">
          📦 У вас пока нет заказов.
        </div>
      )}

      <div className="request-list">

        {orders.map((order) => {

          const status =
            order.status === "paid"
              ? "Оплачен"
              : order.status === "pending"
              ? "Ожидает оплаты"
              : order.status;

          return (

            <div
              key={order.id}
              className="request-card"
            >

              <span className="card-tag">
                Заказ №{order.id}
              </span>

              <div className="request-card-header">

                <div>

                  <h2>
                    {order.product?.name || "Товар"}
                  </h2>

                  <p className="diagnosis">
                    Размер: {order.size}
                  </p>

                </div>

                <span
                  className={`status-pill status-${order.status}`}
                >
                  {status}
                </span>

              </div>

              <div className="request-info">

                <div className="info-item">

                  <span className="info-title">
                    Адрес
                  </span>

                  <strong>
                    {order.delivery_address}
                  </strong>

                </div>

                <div className="info-item">

                  <span className="info-title">
                    Стоимость
                  </span>

                  <strong>
                    {Number(order.total_price).toLocaleString("ru-RU")} ₸
                  </strong>

                </div>

              </div>

              {order.status !== "paid" && (

                <button
                  className="primary-button"
                  style={{
                    width: "100%",
                    marginTop: 18,
                  }}
                  onClick={() => handlePay(order.id)}
                  disabled={payingId === order.id}
                >
                  {payingId === order.id
                    ? "Оплата..."
                    : "💳 Оплатить"}
                </button>

              )}

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default MyOrders;