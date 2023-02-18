import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://tictactoesumit.onrender.com/connect/",
});
