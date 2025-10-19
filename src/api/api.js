import axios from "axios";   // ⬅️ ini wajib!

const api = axios.create({
  baseURL: "http://localhost:5500", // atau 5000 kalau kamu pakai port itu
  timeout: 5000,
});

export default api;
