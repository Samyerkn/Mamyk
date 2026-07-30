import api from "./api";

export const getNews = async () => {
  const response = await api.get("/news/");
  return response.data;
};

export const getNewsItem = async (id) => {
  const response = await api.get(`/news/${id}/`);
  return response.data;
};
