export const Base_Url = "https://localhost:7174/api";
// export const userSFormBase_Url = "https://localhost:44329";https://localhost:44329/api/Organisation/AddUpdateDeleteOrganisation

// For department-related APIs
export const SendOtp_Api="http://localhost:5000/send-otp"
export const Department_Api = {
  GetDropdownValues: Base_Url + "/Master/GetDropdownValues",
  InsertAndUpdate: `${Base_Url}/Department/AddUpdateDepartment`,
  DepartmentSummary: Base_Url + "/Department/GetDepartmentSummary",
  DeleteDepartment: Base_Url + "/Department/DeleteDepartmentDetails",
  makeVisible: Base_Url + "/Department/makeVisible",
  makePublic: Base_Url + "/Department/makePublic",
};
//Holiday Api
export const Holiday_Api = {
  AddUpdateDeleteHolidayList: Base_Url + "/Holiday/AddUpdateDeleteHoliday",
  AddUpdateDeleteHolidayName: Base_Url + "/Holiday/AddUpdateDeleteHolidayName",
  GetHoliday: Base_Url + "/Holiday/GetHolidayList",
  GetHolidayName: Base_Url + "/Holiday/GetHolidayName",
};
export const Login_Api={
  verifyUserDetails: `${Base_Url}/Login/verify/userDetails`,
  resetPassword: `${Base_Url}/Login/forgot/password`,
  userRegistration:`${Base_Url}/Login/user/registration`,
}

export const Language_Api = {
  AddUpdateLanguage: Base_Url+"/Language/AddUpdateLanguage",
};

export const TemplateVar_Api = {
  GetTemplateVariables: Base_Url+"/TemplateVariable/GetTemplateVariables",
  AddUpdateDeleteTemplateVariable : Base_Url+"/TemplateVariable/AddUpdateDeleteTemplateVariable",
};

export const ApiUrl = {
  GetOrganisation: Base_Url + "/Organisation/GetOrganisation",
  GetDropdownOrganisation: Base_Url + "/Master/GetDropdownOrganisation",
  AddUpdateDeleteOrganisation:
    Base_Url + "/Organisation/AddUpdateDeleteOrganisation",
  buisnessForm: {
    buisnessForm_Crud: `${Base_Url}/BuisnessForm/addUpdate/buisness/hours`,
  },
};
export const UsersForm_Api = {
  InsertAndUpdate: `${Base_Url}/UserForm/addUpdate/Users`,
  makeInActiveUsers: `${Base_Url}/UserForm/delete/Users`,
  getUsersData: `${Base_Url}/UserForm/select/Users`,
  makeAdmin: `${Base_Url}/UserForm/makeAdmin/Users`,
  makeAgent: `${Base_Url}/UserForm/makeAgent/Users`,
  getMasters: `${Base_Url}/Master/GetMaster`,
}; 

export const Master_Api = {
  GetVartypeDropdownValue : Base_Url + "/Master/GetVartypeDropdown",
  GetTicketDropdownValue : Base_Url + "/Master/GetTicketDropdownValues",
};

export const AssignMethod_Api = {
  getAssignmethodMaster: `${Base_Url}/AssignMethod/GetAssignmethodMaster`,
  deleteAssignMethod: `${Base_Url}/AssignMethod/DeleteAssignMethod`,
  undoAssignMethod: `${Base_Url}/AssignMethod/UndoDeleteAssignMethod`,
};

export const ServiceQueue_Api = {
  getAssignmethodMaster: `${Base_Url}/ServiceQueue/GetAssignmethodmaster`,
  summaryTableServiceQueue: `${Base_Url}/ServiceQueue/SummarytableServiceQueue`,
  insertUpdateServiceQueue: `${Base_Url}/ServiceQueue/InsertServiceQueue`,
  deleteServiceQueue: `${Base_Url}/ServiceQueue/DeleteServiceQueue`,
};

export const EmailServer_Api = {
  getEmailServerMaster: `${Base_Url}/ServiceQueue/EmailTypeMaster`,
  insertUpdateEmailServer: `${Base_Url}/EmailServer/InsertEmailServer`,
  deleteUndoEmailServer: `${Base_Url}/EmailServer/DeleteEmailServer`,
  summaryTableEmailserver: `${Base_Url}/EmailServer/EmailServerSummary`,
};

export const AgentDetails_Api = {
  getAgentDetailsMaster: `${Base_Url}/AgentDetails/GetAgentDetailMaster`,
  insertUpdateAgentDetails: `${Base_Url}/AgentDetails/InsertAgentDetails`,
  deleteUndoAgentDetails: `${Base_Url}/AgentDetails/DeleteAgentDetails`,
  summaryTableAgentDetails: `${Base_Url}/AgentDetails/AgentDetailsSummary`,
};
export const TemplateGroup_Api = {
  templateGroupCRUD: `${Base_Url}/TemplateGroup/addUpdate/TemplateGroup`, 
  templateListCRUD: `${Base_Url}/TemplateGroup/addUpdate/TemplateList`, 
}

export const Ticket_Api = {
  GetTicketsSummary : Base_Url + "/UserDashboard/GetTickets",
  AddUpdateTickets:Base_Url + "/UserDashboard/AddUpdateTickets",
  GetTicketStatusSummary: Base_Url + "/UserDashboard/GetTicketStatusSummary",
  GetPriorityCount: Base_Url + "/UserDashboard/GetTicketPriority",
  AddUpdateNotes: Base_Url + "/UserDashboard/AddUpdateNotes",
}
