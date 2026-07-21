import api from "./api";

// Получить все активные заявки
export const getHelpRequests = async () => {
  const response = await api.get("/requests/");
  return response.data;
};

// Получить мои заявки
export const getMyHelpRequests = async () => {
  const response = await api.get("/requests/me/");
  return response.data;
};

// Получить одну заявку
export const getHelpRequest = async (id) => {
  const response = await api.get(`/requests/${id}/`);
  return response.data;
};

// Создать заявку
export const createHelpRequest = async (requestData) => {
  const response = await api.post("/requests/", requestData);
  return response.data;
};
