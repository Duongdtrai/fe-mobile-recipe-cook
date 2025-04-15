import API from "@/config/api";
import axios from "axios";

const USER_API_ENDPOINT = "http://192.168.32.101:8080/api/v1/user";

export const login = async (data: any) => {
  try {
    const response = await API.login(data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const signUp = async (data: any) => {
  try {
    const response = await API.signUp(data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await API.forgotPassword(data);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const verifyOTP = async (data: any) => {
  try {
    const response = await API.otp(data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (data: any) => {
  try {
    const response = await API.changePassword(data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateInfo = async (data: any, token: string) => {
  try {
    const response = await axios.patch(
      `${USER_API_ENDPOINT}/change-info`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadImage = async (data: any, token: string) => {
  try {
    const response = await axios.post(
      `${USER_API_ENDPOINT}/upload-image`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async (token: string) => {
  try {
    const response = await axios.get(`${USER_API_ENDPOINT}/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    console.log(e);
  }
};
