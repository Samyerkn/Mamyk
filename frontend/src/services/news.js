import api from "./api";

export const getNews = async () => {
  const response = await api.get("/news/");
  return response.data;
};

export const getNewsItem = async (id) => {
  const response = await api.get(`/news/${id}/`);
  return response.data;
};
export const getNewsById = async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/api/news/${id}/`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить новость");
  }

  return response.json();
};