import * as CONST from '@/constants/const';

export const changeTab = (data: any) => {
    return {
        type: CONST.SET_TAB_INDEX,
        payload: data
    }
}