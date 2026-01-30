import { SAVE_ORGANISATION_DETAILS } from "../../actionType/actionType";

export const saveOrganisationDetails = (organisationData) => {
  return {
    type: SAVE_ORGANISATION_DETAILS,
    payload: organisationData,
  };
};
