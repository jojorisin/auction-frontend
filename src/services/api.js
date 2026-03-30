import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// sends token if request requires
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Hämta sparad JWT
  // Don't send token for auth endpoints
  if (token && !config.url.includes("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors by refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await API.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = refreshResponse.data.accessToken;

        localStorage.setItem("token", newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// returns list of categories for filtering auctions
export const getCategories = () => API.get("/auctions/categories");

//returns a Map with Category and Subcategory for filtering
export const getSubCategories = () => API.get("auctions/subcategories");

//returns a list of auctions with optional filters for category, subcategory, page and sorting
export const getActiveAuctions = (filters) =>
  API.get("/auctions", { params: filters });

export const getAuctionById = (id) => API.get(`/auctions/${id}`);

export const placeBid = (id, bidData) =>
  API.post(`/auctions/${id}/bid`, bidData);

//endpoints for logged in user

export const getMe = () => API.get("/me");

export const getMyBids = () => API.get("/me/bids");

export const getMyWonAuctions = () => API.get("/me/won");

export const getAllMyOrders = () => API.get("/me/orders");

export const getMyOrderById = (id) => API.get(`/me/orders/${id}`);

export const getAllMyItems = () => API.get("/me/items");

export const getMyItemById = (id) => API.get(`/me/items/${id}`);

export const getMyMaxBidForAuction = (id) =>
  API.get(`/auctions/${id}/my-max-bid`);

export const updateAddress = (addressData) =>
  API.put("/me/address", addressData);

export const updateContactInfo = (contactData) =>
  API.put("/me/contact", contactData);

export const updatePassword = (passwordData) =>
  API.put("/me/password", passwordData);

// Auth endpoints
export const registerUser = (registerData) =>
  API.post("/auth/register", registerData);

export const loginUser = (loginData) => API.post("/auth/login", loginData);

export const refreshToken = () => API.post("/auth/refresh");

export const logoutUser = () => API.post("/auth/logout");

export const getBidHistory = (id) => API.get(`/auctions/${id}/bids`);
