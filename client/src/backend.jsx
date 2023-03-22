import axios from "axios";
// set base url to http://localhost:8888
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8888",
});
