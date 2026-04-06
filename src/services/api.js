// Notes for studying
import axios from "axios";

// Hämtar bas-URL (t.ex. localhost:8080 eller din Koyeb-länk) från miljövariabler
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * --- 1. PUBLIK INSTANS ---
 * Används för anrop som inte kräver inloggning.
 * Denna har INGA "interceptors". Det betyder att den aldrig skickar med en token,
 * vilket är lösningen på varför du fick 401-fel på öppna sidor tidigare.
 */
const publicAPI = axios.create({
  baseURL: BASE_URL,
});

/**
 * --- 2. PRIVAT INSTANS ---
 * Används för anrop som KRÄVER inloggning (t.ex. lägga bud, se profil).
 * withCredentials: true ser till att webbläsaren skickar med Cookies (behövs för Refresh-token).
 */
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * --- 3. REQUEST INTERCEPTOR (Vaktmästaren) ---
 * Denna funktion körs precis innan ett anrop skickas iväg med den PRIVATA instansen.
 */
API.interceptors.request.use((config) => {
  // Hämtar din accessToken från webbläsarens minne (localStorage)
  const token = localStorage.getItem("token");

  // Om vi hittar en token, lägg till den i Authorization-headern som "Bearer [token]"
  // Det är detta som talar om för din Java-backend vem du är.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Returnera konfigurationen så att anropet kan skickas iväg
  return config;
});

/**
 * --- 4. REFRESH-LOGIK (Livräddaren) ---
 * Om en accessToken har gått ut får vi en 401:a. Denna kod försöker då
 * automatiskt hämta en ny token utan att användaren märker något.
 */
let isRefreshing = false; // Flagga för att se om vi redan håller på att förnya en token
let failedQueue = []; // En kö för att spara anrop som "pausas" medan vi hämtar ny token

// Funktion som körs när vi fått en ny token. Den "släpper fram" alla pausade anrop i kön.
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []; // Töm kön när vi är klara
};

// Response Interceptor: Hanterar svaret som kommer tillbaka från servern
API.interceptors.response.use(
  (response) => response, // Om allt gick bra (200 OK), skicka bara tillbaka svaret
  async (error) => {
    const originalRequest = error.config; // Spara infon om det anrop som precis misslyckades

    // Om vi får 401 (Obehörig) och inte redan har försökt igen (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Om en refresh redan pågår: lägg detta anrop i kön och vänta på svar
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // När nya token kommer, uppdatera headern och kör anropet igen
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Markera att vi nu påbörjar en förnyelse (refresh)
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Vi anropar /auth/refresh för att få en ny accessToken via vår Refresh-cookie.
        // Vi använder "axios" direkt (inte API) för att inte fastna i en loop.
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = refreshResponse.data.accessToken; // Hämta den nya koden
        localStorage.setItem("token", newToken); // Spara den nya koden lokalt
        window.dispatchEvent(new Event("authChange"));
        processQueue(null, newToken); // Säg till kön att det är fritt fram

        // Uppdatera det ursprungliga anropet med den NYA koden och skicka iväg det igen
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Om även förnyelsen misslyckas (sessionen är helt slut)
        processQueue(refreshError, null);
        localStorage.removeItem("token"); // Rensa den gamla trasiga koden
        window.dispatchEvent(new Event("authChange"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Återställ flaggan
      }
    }
    // Om det är något annat fel än 401, bara skicka vidare felet
    return Promise.reject(error);
  },
);

/**
 * --- 5. EXPORTERADE FUNKTIONER ---
 * Här delar vi upp vilka anrop som använder vilken instans.
 */

// PUBLIKA ANROP: Använder 'publicAPI'. Ingen token skickas = Ingen risk för 401 pga utgången session.
export const getCategories = () => publicAPI.get("/auctions/categories");
export const getSubCategories = () => publicAPI.get("/auctions/subcategories");
export const getActiveAuctions = (filters) =>
  publicAPI.get("/auctions", { params: filters });
export const getAuctionById = (id) => publicAPI.get(`/auctions/${id}`);
export const getBidHistory = (id) => publicAPI.get(`/auctions/${id}/bids`);

// PRIVATA ANROP: Använder 'API'. Dessa kräver inloggning och sköter auto-refresh.
export const placeBid = (id, bidData) =>
  API.post(`/auctions/${id}/bid`, bidData);
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

// AUTH ANROP:
export const registerUser = (registerData) =>
  API.post("/auth/register", registerData);
export const loginUser = (loginData) => API.post("/auth/login", loginData);
export const refreshToken = () => API.post("/auth/refresh", {});
export const logoutUser = () => API.post("/auth/logout");

// payment
export const createCheckoutSession = (orderId) =>
  API.post(`/payments/checkout-session/${orderId}`);
