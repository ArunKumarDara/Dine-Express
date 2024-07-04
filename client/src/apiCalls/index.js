import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://dine-express-backend.onrender.com",
  timeout: 10000,
  headers: {
    credentials: "include",
    "Content-Type": "application/json",
    Authorization: `bearer ${
      localStorage?.getItem("tokenForDineExpress") || ""
    }`,
  },
});
