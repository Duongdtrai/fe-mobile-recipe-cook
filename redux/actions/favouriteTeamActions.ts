import * as CONST from '@/constants/const'

export const setFavouriteTeams = (data: number[]) => {
    return {
        type: CONST.SET_FAVOURITE_TEAMS,
        payload: data
    }
}