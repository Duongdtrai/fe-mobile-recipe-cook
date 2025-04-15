import axios from "axios";
import ENVIRONMENT_CONFIG from "@/config/env";
import { HTTP_STATUS_CODE } from "@/ts/enums";
import { getItem } from "./func";

export const API_STATUS_TEXT = {
  unauthorized: "Unauthorized",
};

export const httpAuth = axios.create({
  baseURL: ENVIRONMENT_CONFIG.host,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});


httpAuth.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ` + await getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    if (
      config &&
      response &&
      response.status === HTTP_STATUS_CODE.UNAUTHORIZED
    ) {
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
