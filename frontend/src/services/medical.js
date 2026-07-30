import api from "./api";

export const getMedicalCases = async () => {
  const response = await api.get("/medical/");
  return response.data;
};

export const getMedicalCase = async (id) => {
  const response = await api.get(`/medical/${id}/`);
  return response.data;
};

export const createMedicalCase = async (data) => {
  const response = await api.post("/medical/", data);
  return response.data;
};

export const createMedicalDonation = async (data) => {
  const response = await api.post("/medical/donations/", data);
  return response.data;
};

export const getMyMedicalDonations = async () => {
  const response = await api.get("/medical/donations/me/");
  return response.data;
};
