import axios from "axios";

const TOKEN_KEY = "access_token";
const PASSWORD = "mamyk123";

export function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loginUser(email) {
  const response = await axios.post("http://localhost:8000/api/auth/login/", {
    email,
    password: PASSWORD,
  });
  return response.data?.access;
}

export async function ensureAuthToken(role = "buyer") {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  const email = role === "sponsor" ? "sponsor@example.com" : "buyer@example.com";
  const fullName = role === "sponsor" ? "Sponsor" : "Buyer";

  try {
    const response = await axios.post("http://localhost:8000/api/auth/register/", {
      email,
      full_name: fullName,
      password: PASSWORD,
      role,
    });
    token = response.data?.access;
  } catch (error) {
    token = await loginUser(email);
  }

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  }

  throw new Error("Не удалось получить токен авторизации");
}
