import { Action } from '@/helper/interface';
import * as CONST from '../../constants/const';

const initState = {
    data: [],
    notRead: 0,
    relaod: false
}

const NotificationsReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case CONST.SET_LIST_NOTIFICATION:
            return {
                ...state,
                data: action.payload,
                reload: false
            }
        
        case CONST.SET_NOT_READ:
            return {
                ...state,
                notRead: action.payload,
                reload: true
            }

        default:
            return state;
    }
}

export default NotificationsReducer;