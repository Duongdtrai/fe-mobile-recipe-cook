import { call, put, takeEvery } from "redux-saga/effects";
import * as CONST from "../../constants/const";
import {
  getUser,
  login,
  updateInfo,
  uploadImage,
} from "@/services/userServices";
import {
  getUserSuccess,
  loginSuccess,
  updateInfoSuccess,
  uploadImageSuccess,
} from "../actions/userActions";
import { Action, Response } from "@/helper/interface";
import { HTTP_STATUS_CODE } from "@/ts/enums";

function* getUserSaga(action: Action) {
  const response: Response = yield call(getUser, action.payload);
  if (response?.status === HTTP_STATUS_CODE.OK) {
    yield put(getUserSuccess(response?.data));
  }
}

function* uploadImageSaga(action: Action) {
  const { data, token } = action.payload;
  const response: Response = yield call(uploadImage, data, token);
  if (response?.status === HTTP_STATUS_CODE.OK) {
    yield put(uploadImageSuccess(response?.data));
  }
}

function* updateInfoSaga(action: Action) {
  const { data, token } = action.payload;
  const response: Response = yield call(updateInfo, data, token);
  if (response?.status === HTTP_STATUS_CODE.OK) {
    yield put(updateInfoSuccess(response?.data));
  }
}

export default function* userSaga() {
  yield takeEvery(CONST.CHANGE_INFO_REQUEST, updateInfoSaga);
  yield takeEvery(CONST.GET_USER_REQUEST, getUserSaga);
  yield takeEvery(CONST.UPLOAD_IMAGE_REQUEST, uploadImageSaga);
}
