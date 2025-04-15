export enum ENDPOINT_API {
  /** Auth */
  login = "/auth/sign-in",
  signUp = "/auth/sign-up",
  forgotPassword = "/auth/forgot-password",
  otp = "/auth/otp",

  /** USER */
  getDetailUser = "/user/get-detail-user",
  signout = "/user/logout",
  changePassword = "/user/change-password",
  deleteAccount = "/user/delete-account",
  updateInfo = "/user/change-info",

  /** News */
  getListNews = "/news/get-news",
  getDetailNews = "/news/get-one",
  getListComments = "/news/comment/get-news-comments",
  createComment = "/user/news/comment/save",
  likeComment = "/user/news/comment/like",
  deleteComment = "/user/news/comment/delete",
  editComment = "/user/news/comment/update",
  /** Teams */
  getListTeams = "/teams",

  /** Favourite */
  getListFavourite = "/favourite",
  updateListFavourite = "/favourite",

  /** Matches */
  getListMatches = "/matches",
  getDetailMatches = "/matches",

  /** Notify */
  createTokenService = "/notification/token",
  updateSetting = "/notification/token",
  getNotifications = "/notification",
  updateStatus = "notification/is-read",

  /** Categories */
  getListCategories = "/categories",

  /** Recipes */
  getListRecipes = "/recipes",
  getDetailRecipes = "/recipes/",

  /** List Comments Recipes */
  getListCommentRecipes = "/comments/by-recipe/",
  createCommentRecipes = "/comments/recipe/",
}

export enum ROUTE_PATH {
  home = "index",
  dietFilterScreen = "diets/DietFilterScreen",
  dietDetailScreenDetail = "diets/DietDetailScreen",
  login = "login/index",
  signUp = "sign-up/index",
  favouriteTeam = "favourite-team/index",
  teamDetails = "favourite-team/details",
  matchesResult = "matches-result/index",
  matchesDetail = "matches-result/detail",
  matchesTeams = "matches-result/teams",
  matchesScheduleTeam = "matches-result/schedule_team",
  userInformation = "user-information/index",
  forgotPassword = "forgot-password/index",
  otp = "forgot-password/otp",
  changePassword = "change-password/index",
  accountSetting = "account-setting/index",
  notifications = "notifications/index",
  notFound = "+not-found",
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  PAYMENT_REQUIRED = 402,
  NOT_FOUND = 404,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum IMAGE_TYPES {
  jpeg = "image/jpeg",
  png = "image/png",
  jpg = "image/jpg",
}
