import api from "./api";

// =====================================================
// РЕГИСТРАЦИЯ
// =====================================================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register/", userData);

  const { access, refresh } = response.data;

  if (access) {
    localStorage.setItem("access_token", access);
  }

  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  }

  return response.data;
};

// =====================================================
// ВХОД
// =====================================================

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login/", userData);

  const { access, refresh } = response.data;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  return response.data;
};

// =====================================================
// ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// =====================================================

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};

// =====================================================
// ВЫХОД
// =====================================================

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    if (refreshToken) {
      await api.post("/auth/logout/", {
        refresh: refreshToken,
      });
    }
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};