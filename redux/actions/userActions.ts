import * as CONST from "../../constants/const";

export const loginRequest = (data: any) => {
  return {
    type: CONST.LOGIN_REQUEST,
    payload: data,
  };
};

export const loginSuccess = (data: any) => {
  return {
    type: CONST.LOGIN_SUCCESS,
    payload: data,
  };
};

export const getUserRequest = (token: string) => {
  return {
    type: CONST.GET_USER_REQUEST,
    payload: token,
  };
};

export const getUserSuccess = (data: any) => {
  return {
    type: CONST.GET_USER_SUCCESS,
    payload: data,
  };
};

export const updateInfoRequest = (data: any, token: string) => {
  return {
    type: CONST.CHANGE_INFO_REQUEST,
    payload: {
      data: data,
      token: token,
    },
  };
};

export const updateInfoSuccess = (data: any) => {
  return {
    type: CONST.CHANGE_INFO_SUCCESS,
    payload: data,
  };
};

export const uploadImageRequest = (data: any, token: string) => {
  const formData = new FormData();
  formData.append("file", data);
  return {
    type: CONST.UPLOAD_IMAGE_REQUEST,
    payload: {
      data: formData,
      token: token,
    },
  };
};

export const uploadImageSuccess = (data: any) => {
  return {
    type: CONST.UPLOAD_IMAGE_SUCCESS,
    payload: data,
  };
};

export const setUser = (data: any) => {
  return {
    type: CONST.SET_USER,
    payload: data,
  };
};

export const setToken = (data: any) => {
  return {
    type: CONST.SET_TOKEN,
    payload: data,
  };
};

export const setNotifyStatus = (data: any) => {
  return {
    type: CONST.SET_NOTIFY_STATUS,
    payload: data
  }
}
