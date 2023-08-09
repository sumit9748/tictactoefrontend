import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://tictactoebaackend.onrender.com/connect/",
});
