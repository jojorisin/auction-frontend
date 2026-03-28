import axios from "axios";

const API = axios.create({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

// sends token if request requires
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Hämta sparad JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getActiveAuctions = (filters) =>
  API.get("/auctions", { params: filters });

export const getAuctionById = (id) => API.get(`/auctions/${id}`);

export const placeBid = (bidData) => API.post(`/auctions/${id}/bid`, bidData);
