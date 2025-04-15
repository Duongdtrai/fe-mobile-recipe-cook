import { getItem } from "@/helper/func";
import { http } from "@/helper/http";
import { httpAuth } from "@/helper/httpAuth";
import { ENDPOINT_API } from "@/ts/enums";
import axios from "axios";

export const BearerToken = async () => {
  return `Bearer ${await getItem("token")}`;
};

const API = {
  /** Auth */
  login: (data: any) => http.post(ENDPOINT_API.login, data),
  signUp: (data: any) => http.post(ENDPOINT_API.signUp, data),
  forgotPassword: (data: any) => http.post(ENDPOINT_API.forgotPassword, data),
  otp: (data: any) => http.post(ENDPOINT_API.otp, data),

  /** User */
  changePassword: async (data: any) =>
    httpAuth.post(ENDPOINT_API.changePassword, data),
  logout: async () => httpAuth.post(ENDPOINT_API.signout),
  deleteAccount: async () => httpAuth.delete(ENDPOINT_API.deleteAccount),

  editComment: (data: any) => httpAuth.put(ENDPOINT_API.editComment, data),
  updateInfo: async (data: any) =>
    httpAuth.patch(ENDPOINT_API.updateInfo, data),

  /** News */
  getListNews: (page: number, size: number = 10) =>
    // console.log(ENDPOINT_API.getListNews, page, size);
    http.get(ENDPOINT_API.getListNews, {
      params: {
        page,
        size,
      },
    }),

  getDetailNews: (id: number) =>
    http.get(ENDPOINT_API.getDetailNews, {
      params: {
        id,
      },
    }),

  getListComments: (id: string, page: number, size: number = 5) =>
    http.get(ENDPOINT_API.getListComments, {
      params: {
        newsId: id,
        page,
        size,
      },
    }),

  postComment: (data: any) => httpAuth.post(ENDPOINT_API.createComment, data),
  likeComment: (data: any) => httpAuth.post(ENDPOINT_API.likeComment, data),
  deleteComment: (id: number) =>
    httpAuth.delete(ENDPOINT_API.deleteComment, {
      params: {
        commentId: id,
      },
    }),
  /** Teams  */
  getListTeams: (type: string) =>
    http.get(ENDPOINT_API.getListTeams, {
      params: {
        type,
      },
    }),

  /** Favourite */
  getListFavourite: () => httpAuth.get(ENDPOINT_API.getListFavourite),
  updateListFavourite: (data: any) =>
    httpAuth.post(ENDPOINT_API.updateListFavourite, data),

  /** Matches */
  getListMatches: (type: string) =>
    http.get(ENDPOINT_API.getListMatches, {
      params: {
        type,
      },
    }),

  getDetailMatches: (id: number) =>
    http.get(`${ENDPOINT_API.getDetailMatches}/${id}`),

  /** Notify */
  createTokenService: (data: any) => {
    return http.post(`${ENDPOINT_API.createTokenService}`, data);
  },
  getNotifications: (data: any) => {
    return http.get(
      `${ENDPOINT_API.getNotifications}?token=${data.token}&page=${data.page}&size=${data.size}`
    );
  },
  updateStatus: (data: any) =>
    http.post(`${ENDPOINT_API.updateStatus}/${data.id}?token=${data.token}`),
  updateSetting: (data: any) => http.put(ENDPOINT_API.updateSetting, data),

  /** Categories */
  getListCategories: (page: number, size: number = 10) =>
    // console.log(ENDPOINT_API.getListNews, page, size);
    httpAuth.get(ENDPOINT_API.getListCategories, {
      params: {
        page,
        size,
      },
    }),

  /** Recipes */
  getListRecipes: (categoryId: number, page: number, size: number = 10) =>
    // console.log(ENDPOINT_API.getListNews, page, size);
    httpAuth.get(ENDPOINT_API.getListRecipes, {
      params: {
        page,
        size,
        categoryId,
      },
    }),
  getRecipeDetail: (recipe_id: number) =>
    httpAuth.get(ENDPOINT_API.getDetailRecipes + recipe_id),

  getListCommentsRecipes: (recipe_id: number) =>
    httpAuth.get(ENDPOINT_API.getListCommentRecipes + recipe_id),

  createCommentsRecipes: (recipe_id: number, data: any) =>
    httpAuth.post(ENDPOINT_API.createCommentRecipes + recipe_id, data),
};

export default API;
