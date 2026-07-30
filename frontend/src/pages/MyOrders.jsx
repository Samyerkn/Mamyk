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
    setError("");

    try {
      await payOrder(orderId);
      await loadOrders();
    } catch {
      setError("Не удалось оплатить заказ.");
    } finally {
      setPayingId(null);
    }
  };

  const getStatus = (status) => {
    if (status === "paid") {
      return "Оплачен";
    }

    if (status === "pending") {
      return "Ожидает оплаты";
    }

    return status;
  };

  return (
    <main className="requests-page orders-page">

      <div className="requests-header">
        <span className="requests-tag">
          MAMYK SHOP
        </span>

        <h1>Мои заказы</h1>

        <p>
          Здесь отображаются оформленные вами заказы
          и информация об их статусе.
        </p>
      </div>

      {loading && (
        <div className="loading-text">
          Загрузка...
        </div>
      )}

      {error && (
        <div className="notification error">
          {error}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="orders-empty">
          <h2>Заказов пока нет</h2>

          <p>
            После оформления товара информация о заказе
            появится на этой странице.
          </p>
        </div>
      )}

      <div className="orders-list">

        {orders.map((order) => (
          <article
            key={order.id}
            className="order-card"
          >

            <div className="order-top">

              <span className="order-number">
                Заказ №{order.id}
              </span>

              <span
                className={`order-status order-status-${order.status}`}
              >
                {getStatus(order.status)}
              </span>

            </div>

            <div className="order-product">

              <h2>
                {order.product?.name || "Товар"}
              </h2>

              <span className="order-size">
                Размер: <strong>{order.size}</strong>
              </span>

            </div>

            <div className="order-details">

              <div className="order-detail-card">

                <span className="order-detail-label">
                  Адрес доставки
                </span>

                <strong>
                  {order.delivery_address}
                </strong>

              </div>

              <div className="order-detail-card">

                <span className="order-detail-label">
                  Стоимость
                </span>

                <strong className="order-price">
                  {Number(order.total_price).toLocaleString("ru-RU")} ₸
                </strong>

              </div>

            </div>

            {order.status !== "paid" ? (

              <div className="order-payment">

                <div>
                  <span className="order-payment-label">
                    Статус оплаты
                  </span>

                  <p>
                    Заказ ожидает оплаты.
                  </p>
                </div>

                <button
                  className="primary-button order-pay-button"
                  type="button"
                  onClick={() => handlePay(order.id)}
                  disabled={payingId === order.id}
                >
                  {payingId === order.id
                    ? "Обработка..."
                    : "Оплатить заказ"}
                </button>

              </div>

            ) : (

              <div className="order-paid-message">

                <span className="order-paid-check">
                  ✓
                </span>

                <div>
                  <strong>Заказ оплачен</strong>

                  <p>
                    Оплата успешно зарегистрирована.
                  </p>
                </div>

              </div>

            )}

          </article>
        ))}

      </div>

    </main>
  );
}

export default MyOrders;