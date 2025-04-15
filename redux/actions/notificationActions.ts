import * as CONST from '@/constants/const'

export const setNotifications = (data: any) => {
    return {
        type: CONST.SET_LIST_NOTIFICATION,
        payload: data
    }
}

export const setNotRead = (data: number) => {
    return {
        type: CONST.SET_NOT_READ,
        payload: data
    }
}