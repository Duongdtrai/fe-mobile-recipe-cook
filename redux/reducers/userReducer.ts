import * as CONST from "../../constants/const";

const initState = {
  user: {},
  accessToken: "",
  notifyToken: "",
  isNotify: true,
};

const useReducer = (state = initState, action: any) => {
  switch (action.type) {
    case CONST.LOGIN_SUCCESS:
      const avatar = action.payload.user.avatar;
      return {
        ...state,
        user: { 
          ...action.payload.user, 
          avatar: avatar ? avatar + '?' + new Date() : null,
        },
        accessToken: action.payload.accessToken,
        reload: true,
      };

    case CONST.SET_TOKEN: {
      return {
        ...state,
        notifyToken: action.payload
      }
    }
    
    case CONST.SET_USER:
      return {
        ...state,
        user: {
          ...action.payload,
          avatar: action.payload.avatar + '?' + new Date()
        }, 
      }

    case CONST.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload + '?' + new Date(),
        },
      };

    case CONST.SET_NOTIFY_STATUS:
      return {
        ...state,
        isNotify: action.payload
      }

    default:
      return state;
  }
};

export default useReducer;
