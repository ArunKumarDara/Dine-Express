import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://dine-express-server.vercel.app/",
  timeout: 10000,
  headers: {
    credentials: "include",
    "Content-Type": "application/json",
    Authorization: `bearer ${
      localStorage?.getItem("tokenForDineExpress") || ""
    }`,
  },
});
