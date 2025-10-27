import axios from "axios";
import { backendUrl } from "../config";

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // optional: if using cookies or JWTs
});

export default api;
