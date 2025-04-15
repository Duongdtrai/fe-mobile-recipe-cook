import { Action } from "@/helper/interface";
import * as CONST from '@/constants/const';

const initState = {
    index: 0,
}

const TabReducer = (state = initState, action: Action) => {
    switch (action.type) {
        case CONST.SET_TAB_INDEX: 
            return {
                ...state,
                index: action.payload
            }
        
        default: 
            return state;
    }
}

export default TabReducer;