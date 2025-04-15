import axios from "axios";
import ENVIRONMENT_CONFIG from "../config/env";

export const http = axios.create({
  baseURL: ENVIRONMENT_CONFIG.host,
  timeout: 180000,
});
