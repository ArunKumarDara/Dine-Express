import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://dine-express.onrender.com" || "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
