
import { Labels } from '../../utils/constants/labels';
import {
  allowEmailCharsOnly,
  emailValidation, toLowerCase, validNumber, validatePassword,
} from '../../utils/commonFunction/common';

const userFormFields = (state, setState) => {
  const inputs = [
    {
      id: 1,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_firstName,
      label: `${Labels.firstName}*`,
      value: state.txt_firstName,
      placeholder: Labels.firstName,
      helperText: state.errors.firstName,
      type: Labels.normal,
      maxLength: 50,
      disabled: !state.cb_isActive,
      autoFocus: true
    },
    {
      id: 2,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_lastName,
      label: `${Labels.lastName}*`,
      value: state.txt_lastName,
      placeholder: Labels.lastName,
      helperText: state.errors.lastName,
      maxLength: 50,
      disabled: !state.cb_isActive
    },
    {
      id: 3,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_department,
      label: `${Labels.department}*`,
      value: state.dd_department,
      options: (state.departmentValue || []).map((item) => ({
        label: item.DepartmentName,
        value: item.DepartmentId
      })),
      placeholder: Labels.department,
      helperText: state.errors.department,
      disabled: !state.cb_isActive
    },
    {
      id: 4,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_role,
      label: `${Labels.role}*`,
      value: state.dd_role,
      options: (state.role || []).map((item) => ({
        label: item.RoleName,
        value: item.Role
      })),
      helperText: state.errors.role,
      disabled: !state.cb_isActive
    },
    {
      id: 5,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_reportingTo,
      label: `${Labels.reportingTo}*`,
      value: state.dd_reportingTo,
      options: (state.reportingTo || []).map((item) => ({
        label: item.ReportingToName,
        value: item.ReportingTo
      })),
      helperText: state.errors.reportingTo,
      disabled: !state.cb_isActive
    },
    {
      id: 6,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_organization,
      label: `${Labels.organization}*`,
      value: state.dd_organization,
      options: (state.organizationValue || []).map((item) => ({
        label: item.OrganizationName,
        value: item.Organization
      })),
      helperText: state.errors.organization,
      disabled: !state.cb_isActive
    },
    {
      id: 7,
      pass: Labels.pass,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_password,
      label: `${Labels.password}*`,
      value: state.txt_password,
      placeholder: Labels.password,
      helperText: state.errors.password,
      validation: validatePassword,
      maxLength: 25,
      disabled: !state.cb_isActive
    },
    {
      id: 8,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_email,
      label: `${Labels.email}*`,
      value: state.txt_email,
      placeholder: Labels.email,
      helperText: state.errors.email,
      validation: emailValidation,
      maxLength: 75,
      disabled: !state.cb_isActive,
      onKeyPress:allowEmailCharsOnly ,
      onKeyUp: toLowerCase 
    },
    {
      id: 9,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_mobileNo,
      label: `${Labels.mobileNo}*`,
      value: state.txt_mobileNo,
      placeholder: Labels.mobileNo,
      helperText: state.errors.mobileNo,
      validation: validNumber,
      maxLength: 10,
      disabled: !state.cb_isActive
    },
    {
      id: 10,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_phoneNo,
      label: Labels.phoneNo,
      value: state.txt_phoneNo,
      placeholder: Labels.phoneNo,
      helperText: state.errors.phoneNo,
      validation: validNumber,
      maxLength: 10,
      disabled: !state.cb_isActive
    },
    {
      id: 11,
      flag: Labels.inputField,
      name: Labels.usersFormName.txt_signature,
      label: Labels.signature,
      value: state.txt_signature,
      placeholder: Labels.signature,
      maxLength: 50,
      disabled: !state.cb_isActive
    },
    {
      id: 12,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_language,
      label: `${Labels.language}*`,
      value: state.dd_language,
      options: (state.languageValues || []).map((item) => ({
        label: item.LanguageName,
        value: item.Language
      })),
      helperText: state.errors.language,
      disabled: !state.cb_isActive
    },
    {
      id: 13,
      flag: Labels.dropdown,
      name: Labels.usersFormName.dd_timeZone,
      label: `${Labels.timeZone}*`,
      value: state.dd_timeZone,
      options: (state.timeZoneValue || []).map((item) => ({
        label: item.TimeZoneName,
        value: item.TimeZoneId
      })),
      helperText: state.errors.timeZone,
      disabled: !state.cb_isActive
    }
  ];

  const checkBox = [
    {
      id: 14,
      flag: Labels.checkbox,
      name: Labels.usersFormName.isActive,
      label: Labels.isActive,
      value: state.cb_isActive,
      onChange: (val) => setState({ cb_isActive: val })
    },
    {
      id: 15,
      flag: Labels.checkbox,
      name: Labels.usersFormName.isVisible,
      label: Labels.isVisible,
      value: state.cb_isVisible,
      onChange: (val) => setState({ cb_isVisible: val }),
      disabled: !state.cb_isActive
    },
    {
      id: 16,
      flag: Labels.checkbox,
      name: Labels.usersFormName.isAdmin,
      label: Labels.isAdmin,
      value: state.cb_isAdmin,
      onChange: (val) => setState({ cb_isAdmin: val }),
      disabled: !state.cb_isActive
    },
    {
      id: 17,
      flag: Labels.checkbox,
      name: Labels.usersFormName.isAgent,
      label: Labels.isAgent,
      value: state.cb_isAgent,
      onChange: (val) => setState({ cb_isAgent: val }),
      disabled: !state.cb_isActive
    },

    {
      id: 18,
      flag: Labels.checkbox,
      name: Labels.usersFormName.isManager,
      label: Labels.isManager,
      value: state.cb_isManager,
      onChange: (val) => setState({ cb_isManager: val }),
      disabled: !state.cb_isActive
    }
  ];

  return { inputs, checkBox };
}
export default userFormFields
