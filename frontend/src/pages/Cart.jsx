import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, payOrder } from "../services/orders";
import {
  getCart,
  clearCart,
  removeFromCart,
} from "../services/cart";

import "../styles/Requests.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const [showPayment, setShowPayment] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCVV, setCardCVV] = useState("");

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

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Корзина пуста.");
      return;
    }

    if (!address.trim()) {
      setError("Введите адрес доставки.");
      return;
    }

    setError("");
    setShowPayment(true);
  };

  const confirmPayment = async () => {

    if (
      !cardNumber ||
      !cardDate ||
      !cardCVV
    ) {
      setError("Заполните данные карты.");
      return;
    }

    setStatus("creating");

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

      const lastOrder =
        createdOrders[
          createdOrders.length - 1
        ];

      setOrderId(lastOrder?.id ?? null);

      clearCart();
      setCart([]);

      setShowPayment(false);

      setStatus("success");

    } catch (err) {

      setShowPayment(false);

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
      <div className="requests-page">

        <div
          className="request-detail-card"
          style={{ textAlign: "center" }}
        >

          <h1>🎉 Спасибо за покупку!</h1>

          <p
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Ваш заказ успешно оформлен
            и оплачен.
          </p>

          {orderId && (
            <h3
              style={{
                color: "#4f46e5",
              }}
            >
              Заказ №{orderId}
            </h3>
          )}

          <button
            className="primary-button"
            style={{
              marginTop: 25,
            }}
            onClick={() =>
              navigate("/orders")
            }
          >
            Мои заказы
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="requests-page">

      <div className="requests-header">

        <span className="requests-tag">
          MAMYK SHOP
        </span>

        <h1>Корзина</h1>

        <p>
          Проверьте выбранные товары
          перед оформлением заказа.
        </p>

      </div>

      {cart.length === 0 ? (
        <div className="empty-box">
          🛒 Ваша корзина пока пуста.
        </div>
      ) : (
        <>
          <div className="request-list">

            {cart.map((item, index) => (

              <div
                key={index}
                className="request-card"
              >

                <span className="card-tag">
                  Товар
                </span>

                <h2>{item.name}</h2>

                <div className="request-info">

                  <div className="info-item">
                    <span className="info-title">
                      Размер
                    </span>

                    <strong>
                      {item.size}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span className="info-title">
                      Цена
                    </span>

                    <strong>
                      {Number(
                        item.price
                      ).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₸
                    </strong>
                  </div>

                </div>

                <button
                  className="primary-button"
                  style={{
                    width: "100%",
                    marginTop: 18,
                    background: "#ef4444",
                  }}
                  onClick={() =>
                    deleteItem(index)
                  }
                >
                  Удалить
                </button>

              </div>

            ))}

          </div>
                    <div
            className="request-detail-card"
            style={{ marginTop: 35 }}
          >
            <h2
              style={{
                marginBottom: 25,
              }}
            >
              Итого:
              <span
                style={{
                  color: "#4f46e5",
                }}
              >
                {" "}
                {Number(totalPrice).toLocaleString(
                  "ru-RU"
                )}{" "}
                ₸
              </span>
            </h2>

            <form
              onSubmit={handleCheckout}
              className="request-form-card"
              style={{
                boxShadow: "none",
                padding: 0,
              }}
            >
              <label>
                Адрес доставки

                <input
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Введите адрес доставки"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                style={{
                  marginTop: 25,
                  width: "100%",
                }}
              >
                💳 Оформить заказ
              </button>

            </form>

            {status === "creating" && (
              <p
                style={{
                  marginTop: 20,
                  color: "#4f46e5",
                  fontWeight: 600,
                }}
              >
                Оформляем заказ...
              </p>
            )}

            {status === "failed" && (
              <p className="page-error">
                {error}
              </p>
            )}

          </div>

          {showPayment && (

            <div className="payment-overlay">

              <div className="payment-modal">

                <h2>
                  💳 Оплата заказа
                </h2>

                <p>
                  Для завершения покупки
                  заполните данные карты
                </p>

                <input
                  type="text"
                  placeholder="Номер карты"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value)
                  }
                />

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 15,
                  }}
                >

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDate}
                    onChange={(e) =>
                      setCardDate(e.target.value)
                    }
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCVV}
                    onChange={(e) =>
                      setCardCVV(e.target.value)
                    }
                  />

                </div>

                <h3
                  style={{
                    marginTop: 25,
                    color: "#4f46e5",
                  }}
                >
                  К оплате:
                  {" "}
                  {Number(totalPrice).toLocaleString("ru-RU")}
                  {" "}
                  ₸
                </h3>

                <div
                  className="payment-buttons"
                >

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      setShowPayment(false)
                    }
                  >
                    Отмена
                  </button>

                  <button
                    className="pay-btn"
                    onClick={confirmPayment}
                  >
                    Оплатить
                  </button>

                </div>

              </div>

            </div>

          )}

        </>
      )}

    </div>
  );
}

export default Cart;