import { combineReducers } from "redux";
import userDetailsReducer from "./reducer/UserDetail/userDetailReducer";
import organisationDetailReducer from "./reducer/Organisation/organisation";

const rootReducer = combineReducers({
  userDetails: userDetailsReducer,
  organisationDetails: organisationDetailReducer,
});

export default rootReducer;
