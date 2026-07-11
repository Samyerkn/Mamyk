import axios from "axios";

const TOKEN_KEY = "access_token";

export function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function ensureAuthToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  const response = await axios.post("http://localhost:8000/api/auth/register/", {
    email: "buyer@example.com",
    full_name: "Buyer",
    password: "mamyk123",
    role: "buyer",
  });

  const newToken = response.data?.access;
  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    return newToken;
  }

  throw new Error("Не удалось получить токен авторизации");
}
