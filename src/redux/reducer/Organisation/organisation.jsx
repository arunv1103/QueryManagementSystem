import { SAVE_ORGANISATION_DETAILS } from "../../actionType/actionType";

const initialState = {
  organisation: {},
};

export default function organisationDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_ORGANISATION_DETAILS:
      console.log("SAVE_ORGANISATION_DETAILS payload:", action.payload);
      return {
        ...state,
        organisation: action.payload,
      };
    default:
      return state;
  }
}
