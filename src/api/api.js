import axios from "axios";   // ⬅️ ini wajib!

const api = axios.create({
  baseURL: "https://frontend-ecommerce-production.up.railway.app", // atau 5000 kalau kamu pakai port itu
  timeout: 5000,
});

export default api;
