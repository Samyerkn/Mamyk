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

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Корзина пуста.");
      return;
    }

    if (!address.trim()) {
      setError("Введите адрес доставки.");
      return;
    }

    // Проверяем карту из localStorage
    const savedCard = localStorage.getItem("card_number");
    if (!savedCard) {
      setError("Для оплаты нужно добавить карту в профиле.");
      navigate("/profile");
      return;
    }

    setError("");
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

      const lastOrder = createdOrders[createdOrders.length - 1];
      setOrderId(lastOrder?.id ?? null);

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
      <main className="requests-page cart-page">
        <section className="cart-success">
          <div className="cart-success-mark">✓</div>

          <span className="cart-eyebrow">
            Заказ оформлен
          </span>

          <h1>Спасибо за покупку</h1>

          <p>
            Ваш заказ успешно оформлен и оплачен.
            Информация о покупке доступна в разделе
            «Мои заказы».
          </p>

          {orderId && (
            <div className="cart-order-number">
              Заказ №{orderId}
            </div>
          )}

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/orders")}
          >
            Перейти к моим заказам
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="requests-page cart-page">
      <div className="requests-header cart-header">
        <span className="requests-tag">
          MAMYK SHOP
        </span>

        <h1>Корзина</h1>

        <p>
          Проверьте выбранные товары перед оформлением заказа.
        </p>
      </div>

      {cart.length === 0 ? (
        <section className="cart-empty">
          <h2>Корзина пока пуста</h2>

          <p>
            Добавьте товары из каталога, чтобы оформить заказ.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/catalog")}
          >
            Перейти в каталог
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-products">
            <div className="cart-section-heading">
              <div>
                <span className="cart-eyebrow">
                  Выбранные товары
                </span>

                <h2>
                  Корзина
                  <span className="cart-count">
                    {cart.length}
                  </span>
                </h2>
              </div>
            </div>

            <div className="cart-items">
              {cart.map((item, index) => (
                <article
                  key={`${item.id}-${item.size}-${index}`}
                  className="cart-item"
                >
                  <div className="cart-item-main">
                    <span className="cart-item-type">
                      Адаптивная одежда
                    </span>

                    <h3>{item.name}</h3>

                    <div className="cart-item-meta">
                      <div>
                        <span>Размер</span>
                        <strong>{item.size}</strong>
                      </div>

                      <div>
                        <span>Цена</span>
                        <strong>
                          {Number(item.price).toLocaleString("ru-RU")} ₸
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button
                    className="cart-remove-button"
                    type="button"
                    onClick={() => deleteItem(index)}
                  >
                    Удалить
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-checkout">
            <div className="cart-checkout-heading">
              <span className="cart-eyebrow">
                Оформление
              </span>

              <h2>Ваш заказ</h2>
            </div>

            <div className="cart-summary-row">
              <span>Товаров</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="cart-summary-row cart-total-row">
              <span>Итого</span>
              <strong>
                {Number(totalPrice).toLocaleString("ru-RU")} ₸
              </strong>
            </div>

            {/* Показываем последние 4 цифры карты если есть */}
            {localStorage.getItem("card_number") && (
              <div className="cart-summary-row">
                <span>Карта</span>
                <strong>
                  **** {localStorage.getItem("card_number").slice(-4)}
                </strong>
              </div>
            )}

            <form
              className="cart-checkout-form"
              onSubmit={handleCheckout}
            >
              <label>
                <span>Адрес доставки</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Введите адрес доставки"
                  required
                />
              </label>

              {error && (
                <div className="cart-error">{error}</div>
              )}

              <button
                type="submit"
                className="primary-button cart-checkout-button"
                disabled={status === "creating"}
              >
                {status === "creating"
                  ? "Оформление..."
                  : "Оформить и оплатить"}
              </button>
            </form>

            <p className="cart-checkout-note">
              После оформления вы сможете просмотреть
              заказ в личном кабинете.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;