import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/connect"
    ? "http://localhost:8000/connect"
    : "https://tictactoebaackend.onrender.com/connect",
});
