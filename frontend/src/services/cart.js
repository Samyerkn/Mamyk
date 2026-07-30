const CART_KEY = "mamyk_cart";

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function addToCart(product) {
  const token = localStorage.getItem("access_token");
  
  if (!token) {
    return false; // не авторизован
  }
  
  const cart = getCart();
  cart.push(product);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return true; // успешно добавлено
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}