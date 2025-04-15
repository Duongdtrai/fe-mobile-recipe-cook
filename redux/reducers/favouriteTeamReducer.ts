import { Action } from '@/helper/interface';
import * as CONST from '../../constants/const';

const initState = {
    data: []
}

const FavouriteTeamReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case CONST.SET_FAVOURITE_TEAMS:
            return {
                ...state,
                data: [...action.payload]
            }
        
        default:
            return state;
    }
}

export default FavouriteTeamReducer;