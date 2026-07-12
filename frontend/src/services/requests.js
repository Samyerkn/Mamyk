import axios from "axios";
import { getAuthHeader, ensureAuthToken } from "./auth";

const API_BASE = "http://localhost:8000";

export async function fetchPublicHelpRequests() {
  const response = await axios.get(`${API_BASE}/api/requests/`);
  return response.data;
}

export async function fetchHelpRequest(id) {
  const response = await axios.get(`${API_BASE}/api/requests/${id}/`);
  return response.data;
}

export async function fetchMyHelpRequests() {
  await ensureAuthToken();
  const response = await axios.get(`${API_BASE}/api/requests/me/`, {
    headers: getAuthHeader(),
  });
  return response.data;
}

export async function createHelpRequest(payload) {
  await ensureAuthToken();
  const response = await axios.post(`${API_BASE}/api/requests/`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
}

export async function createDonation(payload) {
  await ensureAuthToken("sponsor");
  const response = await axios.post(`${API_BASE}/api/donations/`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
}

export async function fetchMyDonations() {
  await ensureAuthToken("sponsor");
  const response = await axios.get(`${API_BASE}/api/donations/me/`, {
    headers: getAuthHeader(),
  });
  return response.data;
}

export async function fetchDonationsByRequest(id) {
  const response = await axios.get(`${API_BASE}/api/donations/by_request/${id}/`);
  return response.data;
}
