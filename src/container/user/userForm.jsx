

import React, { Component } from 'react';
import ZButton from '../../component/ZButton/zbutton';
import { Labels } from '../../utils/constants/labels';
import ZTextField from '../../component/ZTextField/ztextfield';
import ZDropdown from '../../component/ZDropdown/zdropdown';
import "../../App.css"
import { GetApi, PostApi } from "../../utils/api/networking"
import ZCheckBox from '../../component/ZCheckBox/ZCheckBox';
import { AppNavigation } from '../../navigations/appNavigation';
import {
  allowOnlyAlphabets, allowOnlyNumbers, getErrorKey
} from '../../utils/commonFunction/common';
import ZCard from '../../component/ZCard/zcard';
import { UsersForm_Api } from '../../utils/api/apiUrl';
import ZToasterMsg from '../../component/ZToasterMessage/ztoasterMessage';
import { encryptPassword, decryptPassword } from "../../utils/encryption/cryptoUtil"
import { labelRoutes } from '../../navigations/labelRoutes';
import userFormFields from './userFormField';
import { connect } from 'react-redux';


class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt_firstName: "",
      txt_lastName: "",
      dd_department: "",
      dd_role: "",
      dd_reportingTo: "",
      txt_password: "",
      txt_email: "",
      txt_mobileNo: "",
      txt_phoneNo: "",
      txt_signature: "",
      dd_language: "",
      dd_timeZone: "",
      dd_organization: "",
      cb_isActive: true,
      cb_isAdmin: false,
      cb_isVisible: true,
      cb_isAgent: false,
      cb_isManager: false,
      btn_Update: Labels.submit,
      languageValues: [],
      timeZoneValue: [],
      organizationValue: [],
      reportingTo: [],
      departmentValue: [],
      userId: "",
      role: [],
      errors: {},
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      }
    };
  }
  getDropdownValues = async () => {
    try {
      const res = await GetApi(UsersForm_Api.getMasters);
      const { table2, table3, table4, table5, table0, table1 } = res.data.data;

      this.setState({
        languageValues: table2,
        timeZoneValue: table3,
        role: table4,
        reportingTo: table5,
        organizationValue: table0,
        departmentValue: table1
      });
    } catch (error) {
      console.log("Dropdown fetch failed:", error);
    }
  }
  async componentDidMount() {
    this.getDropdownValues();
    const editData = this.props.location?.state;


    if (editData) {
      this.setState({
        txt_firstName: editData.FirstName,
        txt_lastName: editData.LastName,
        dd_department: editData.Department || "",
        dd_role: editData.Role || "",
        dd_reportingTo: editData.ReportingTo || "",
        txt_password: decryptPassword(editData.Password),
        txt_email: editData.Email,
        txt_mobileNo: editData.MobileNo,
        txt_phoneNo: editData.PhoneNo,
        txt_signature: editData.Signature,
        dd_language: editData.Language || "",
        dd_timeZone: editData.TimeZone || "",
        dd_organization: editData.Organization || "",
        cb_isActive: editData.IsActive,
        cb_isAdmin: editData.IsAdmin,
        cb_isVisible: editData.IsVisible,
        cb_isAgent: editData.IsAgent,
        cb_isManager: editData.IsManager,
        btn_Update: Labels.update,
        userId: editData.UserId,
      });
    }
    window.history.replaceState({}, document.title);
  }

  validateFields = () => {
    const requiredFields = [
      Labels.usersFormName.txt_firstName,
      Labels.usersFormName.txt_lastName,
      Labels.usersFormName.dd_department,
      Labels.usersFormName.dd_role,
      Labels.usersFormName.dd_reportingTo,
      Labels.usersFormName.dd_organization,
      Labels.usersFormName.txt_email,
      Labels.usersFormName.txt_password,
      Labels.usersFormName.txt_mobileNo,
      Labels.usersFormName.dd_language,
      Labels.usersFormName.dd_timeZone
    ];
    const errors = {};
    requiredFields.forEach((field) => {
      const value = this.state[field];
      const errorKey = getErrorKey(field)
      if (!value || value.toString().trim() === "") {
        errors[errorKey] = Labels.required;
      }
    });
    this.setState({ errors });
    return Object.keys(errors).length === Labels.num_0;
  };

  handleChange = (e, validation) => {
    const { name } = e.target;
    const errorKey = getErrorKey(name);
    let value = e.target.value;
    if (name === Labels.usersFormName.txt_firstName || name === Labels.usersFormName.txt_lastName) {
      value = allowOnlyAlphabets(value);
    }
    if (name === Labels.usersFormName.txt_mobileNo || name === Labels.usersFormName.txt_phoneNo) {
      value = allowOnlyNumbers(value);
    }
    const verifiedValue = value;
    this.setState((prev) => ({
      errors: {
        ...prev.errors,
        [errorKey]: "",
      },
    }));
    this.setState({ [name]: verifiedValue }, () => {
      if (typeof validation !== Labels.function) return
      const errorMsg = validation(verifiedValue);
      this.setState((prev) => ({
        errors: {
          ...prev.errors,
          [errorKey]: errorMsg,
        },
      }));
    });
  };

  handleSubmit = () => {
    const validate = this.validateFields();
    if (!validate) return;

    const url = UsersForm_Api.InsertAndUpdate;
    const flagValue = this.state.btn_Update === Labels.update ? Labels.flag.update : Labels.flag.insert;
    const update = this.state.btn_Update === Labels.update ? this.props.user?.UserId : 0;
    const formData = new FormData();
    formData.append("FirstName", this.state.txt_firstName);
    formData.append("LastName", this.state.txt_lastName);
    formData.append("Department", this.state.dd_department);
    formData.append("ReportingTo", this.state.dd_reportingTo);
    formData.append("Role", this.state.dd_role);
    formData.append("Organization", this.state.dd_organization);
    formData.append("Password", encryptPassword(this.state.txt_password));
    formData.append("Email", this.state.txt_email);
    formData.append("MobileNo", this.state.txt_mobileNo);
    formData.append("PhoneNo", this.state.txt_phoneNo || "");
    formData.append("Signature", this.state.txt_signature);
    formData.append("Language", this.state.dd_language);
    formData.append("TimeZone", this.state.dd_timeZone);
    formData.append("Flag", flagValue);
    formData.append("IsActive", this.state.cb_isActive);
    formData.append("IsAdmin", this.state.cb_isAdmin);
    formData.append("IsVisible", this.state.cb_isVisible);
    formData.append("IsAgent", this.state.cb_isAgent);
    formData.append("IsManager", this.state.cb_isManager);
    formData.append("UserId", this.state.userId || 0);
    formData.append("CreatedBy", this.props.user?.UserId);
    formData.append("ModifiedBy", update);

    PostApi(url, formData).then((res) => {
      if (res.status == Labels.res.status) {
        this.handleReset();
        this.props.navigate(labelRoutes.userSummary, { state: res.message });
      } else {
        this.setState((prevState) => ({
          ...prevState,
          toast: {
            open: true,
            message: res.message,
            severity: Labels.res.error,
            duration: Labels.num_1000,
            position: { vertical: Labels.bottom, horizontal: Labels.right },
          },
        }));
        setTimeout(() => {
          this.setState((prevState) => ({
            ...prevState,
            toast: { ...prevState.toast, open: false },
          }));
        }, Labels.num_1000);
      }
    });
  };

  handleReset = () => {
    this.setState({
      txt_firstName: "",
      txt_lastName: "",
      dd_department: "",
      dd_role: "",
      dd_reportingTo: "",
      txt_password: "",
      txt_email: "",
      txt_mobileNo: "",
      txt_phoneNo: "",
      txt_signature: "",
      dd_language: "",
      dd_timeZone: "",
      dd_organization: "",
      cb_isActive: true,
      cb_isAdmin: false,
      cb_isVisible: false,
      cb_isAgent: false,
      cb_isManager: false,
    });
  };

  render() {
    const { inputs, checkBox } = userFormFields(this.state, (val) => this.setState(val));
    return (
      <>
        <ZCard title={Labels.userFormTitle} onBackClick={() => { this.props.navigate(labelRoutes.userSummary) }}>

          <div className="form-container">

            <div className="form-grid">
              {inputs.map((data, index) => {
                if (data.flag === Labels.inputField) {
                  return (
                    <div key={index} className="form-field">
                      <ZTextField
                        flag={data.pass}
                        name={data.name}
                        label={data.label}
                        eyeIcon={20}
                        value={data.value}
                        onChange={(e) => this.handleChange(e, data.validation)}
                        placeholder={data.placeholder}
                        helperText={data.helperText}
                        maxLength={data.maxLength}
                        disabled={data.disabled}
                        onKeyPress={data.onKeyPress}
                        onKeyUp={data.onKeyUp}
                        autoFocus={data.autoFocus??false}
                      />
                    </div>
                  );
                } else if (data.flag === Labels.dropdown) {
                  return (
                    <div key={index} className="form-field">
                      <ZDropdown
                        label={data.label}
                        name={data.name}
                        options={data.options}
                        value={data.value}
                        onChange={(e) => this.handleChange(e, data.validation)}
                        helperText={data.helperText}
                        disabled={data.disabled}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>


            <div className="form-actions-row">
              <div className="checkbox-group">
                {checkBox.map((data, index) => (
                  <ZCheckBox
                    key={index}
                    label={data.label}
                    name={data.name}
                    checked={data.value}
                    onChange={data.onChange}
                    disabled={data.disabled}
                  />
                ))}
              </div>

              <div className="button-group">
                {this.state.btn_Update === Labels.submit && (
                  <ZButton
                    label={Labels.clear}
                    variant={Labels.outlined}
                    onClick={this.handleReset}
                  />
                )}
                <ZButton
                  label={this.state.btn_Update}
                  onClick={this.handleSubmit}
                />
              </div>
            </div>
          </div>

        </ZCard>
        <ZToasterMsg
          open={this.state.toast.open}
          message={this.state.toast.message}
          severity={this.state.toast.severity}
          duration={this.state.toast.duration}
          position={this.state.toast.position}
          onClose={this.handleCloseToast}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.userDetails.user,
  };
};

export default AppNavigation(connect(mapStateToProps)(UserForm));
