import api from "./api";

// =====================================================
// ЗАЯВКИ
// =====================================================

// Получить все активные заявки
export const getHelpRequests = async () => {
  const response = await api.get("/requests/");
  return response.data;
};

// Старое название (для совместимости)
export const fetchPublicHelpRequests = getHelpRequests;

// Получить одну заявку
export const getHelpRequest = async (id) => {
  const response = await api.get(`/requests/${id}/`);
  return response.data;
};

// Старое название
export const fetchHelpRequest = getHelpRequest;

// Получить мои заявки
export const getMyHelpRequests = async () => {
  const response = await api.get("/requests/me/");
  return response.data;
};

// Старое название
export const fetchMyHelpRequests = getMyHelpRequests;

// Создать заявку
export const createHelpRequest = async (requestData) => {
  const response = await api.post("/requests/", requestData);
  return response.data;
};

// =====================================================
// ПОЖЕРТВОВАНИЯ
// =====================================================

// Создать пожертвование
export const createDonation = async (donationData) => {
  const response = await api.post("/donations/", donationData);
  return response.data;
};

// История моих пожертвований
export const getMyDonations = async () => {
  const response = await api.get("/donations/me/");
  return response.data;
};

// Старое название
export const fetchMyDonations = getMyDonations;

// Пожертвования по заявке
export const getDonationsByRequest = async (id) => {
  const response = await api.get(`/donations/by_request/${id}/`);
  return response.data;
};

// Старое название
export const fetchDonationsByRequest = getDonationsByRequest;