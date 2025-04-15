import { combineReducers } from "redux";
import userReducer from './userReducer';
import FavouriteTeamReducer from "./favouriteTeamReducer";
import NotificationsReducer from "./notificationReducer";
import TabReducer from "./tabReducer";

const rootReducer = combineReducers({
    user: userReducer,
    favouriteTeam: FavouriteTeamReducer,
    notification: NotificationsReducer,
    tab: TabReducer,
})

export default rootReducer;