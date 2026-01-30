import React, { Component } from "react";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import ZCheckbox from "../../component/ZCheckBox/ZCheckBox";
import ZButton from "../../component/ZButton/zbutton";
import { Labels } from "../../utils/constants/labels";
import { PostApi, GetApi } from "../../utils/api/networking";
import "../../App.css";
import ZCard from "../../component/ZCard/zcard";
import {
  isNotEmpty,
  isValidEmail,
  allowEmailCharsOnly,
  allowAlphaSpace,
  toLowerCase,
} from "../../utils/commonFunction/common";
import { Department_Api } from "../../utils/api/apiUrl";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt_Department: "",
      ddl_ParentDepartment: "",
      ddl_Manager: "",
      txt_EmailId: "",
      txt_AutoRespEmailId: "",
      ddl_AutoRespTemplate: "",
      txt_EmailSignature: "",
      ddl_Sla: "",
      ddl_AlertsTo: "",
      ddl_NoticesTo: "",
      txt_FilePath: "",
      cbl_IsPublic: true,
      cbl_IsVisible: true,
      cbl_IsActive: true,
      departmentId: 0,
      errors: {},
      parentDepartmentOptions: [],
      managerOptions: [],
      autoRespTemplateOptions: [],
      slaOptions: [],
      alertsToOptions: [],
      noticesToOptions: [],
      isLoading: false,
      btn_update: Labels.submit,
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
    this.showToast = this.showToast.bind(this);
    this.handleCloseToast = this.handleCloseToast.bind(this);
  }
  //Toaster Message
  showToast = (
    message,
    severity = Labels.success,
    duration = Labels.num_3000
  ) => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    });
  };
  handleCloseToast = () => {
    this.setState((prevState) => ({
      toast: {
        ...prevState.toast,
        open: false,
      },
    }));
  };
  fetchDropdownData = () => {
    GetApi(Department_Api.GetDropdownValues, {})
      .then((res) => {
        if (res.status === Labels.flag.select) {
          const responseData = res.data.data;
          this.setState({
            parentDepartmentOptions: responseData.table0 || [],
            managerOptions: responseData.table1 || [],
            autoRespTemplateOptions: responseData.table2,
            slaOptions: responseData.table3 || [],
            alertsToOptions: responseData.table4 || [],
            noticesToOptions: responseData.table5 || [],
          });
        }
      })
  };

  componentDidMount() {
    try {
      this.fetchDropdownData();
      const editData = this.props.location?.state;
      if (editData?.departmentId) {
        this.setState({
          departmentId: editData.departmentId,
          txt_Department: editData.DepartmentName || "",
          ddl_ParentDepartment: editData.ParentDepartmentId || "",
          ddl_Manager: editData.ManagerId || "",
          txt_EmailId: editData.EmailId || "",
          txt_AutoRespEmailId: editData.AutoRespEmailId || "",
          ddl_AutoRespTemplate: editData.AutoRespTemplateId || "",
          txt_EmailSignature: editData.EmailSignature || "",
          ddl_Sla: editData.SlaId || "",
          ddl_AlertsTo: editData.AlertsToId || "",
          ddl_NoticesTo: editData.NoticesToId || "",
          txt_FilePath: editData.FilePath || "",
          cbl_IsPublic: Boolean(editData.IsPublic),
          cbl_IsVisible: Boolean(editData.IsVisible),
          cbl_IsActive: Boolean(editData.IsActive),
          btn_update: Labels.update
        });
      }
    } catch (error) {
      console.error(Labels.catchErrorMsg, Labels.error);
    }
    window.history.replaceState({}, document.title);
  }
  validateFields = () => {
    const errors = {};
    if (!this.state.txt_Department.trim()) {
      errors.txt_Department = Labels.required;
    }
    if (!this.state.ddl_Manager) {
      errors.ddl_Manager = Labels.required;
    }
    if (!isNotEmpty(this.state.txt_EmailId)) {
      errors.txt_EmailId = Labels.required;
    } else if (!isValidEmail(this.state.txt_EmailId)) {
      errors.txt_EmailId = Labels.emailError;
    }
    if (!isNotEmpty(this.state.txt_AutoRespEmailId)) {
      errors.txt_AutoRespEmailId = Labels.required;
    } else if (!isValidEmail(this.state.txt_AutoRespEmailId)) {
      errors.txt_AutoRespEmailId = Labels.emailError;
    }
    if (!this.state.ddl_AutoRespTemplate) {
      errors.ddl_AutoRespTemplate = Labels.required;
    }
    if (!this.state.txt_EmailSignature.trim()) {
      errors.txt_EmailSignature = Labels.required;
    }
    if (!this.state.ddl_Sla) {
      errors.ddl_Sla = Labels.required;
    }
    if (!this.state.ddl_AlertsTo) {
      errors.ddl_AlertsTo = Labels.required;
    }
    if (!this.state.ddl_NoticesTo) {
      errors.ddl_NoticesTo = Labels.required;
    }
    if (!this.state.txt_FilePath.trim()) {
      errors.txt_FilePath = Labels.required;
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === Labels.checkbox ? checked : value;
    let error = "";
    if (name === Labels.txt_EmailId || name === Labels.txt_AutoRespEmailId) {
      if (!isNotEmpty(updatedValue)) {
        error = Labels.required;
      } else if (!isValidEmail(updatedValue)) {
        error = Labels.emailError;
      }
    }
    this.setState((prevState) => ({
      [name]: updatedValue,
      errors: {
        ...prevState.errors,
        [name]: error,
      },
    }));
  };
  handleSubmit = () => {
    if (!this.validateFields()) return;
    const isEdit = !!this.state.departmentId;
    const payload = {
      flag: isEdit ? Labels.flag.update : Labels.flag.insert,
      departmentId: isEdit ? this.state.departmentId : 0,
      departmentName: this.state.txt_Department,
      parentDepartmentId: this.state.ddl_ParentDepartment || null,
      managerId: parseInt(this.state.ddl_Manager),
      emailId: this.state.txt_EmailId,
      autoRespEmailId: this.state.txt_AutoRespEmailId,
      autoRespTemplateId: this.state.ddl_AutoRespTemplate,
      emailSignature: this.state.txt_EmailSignature,
      slaId: parseInt(this.state.ddl_Sla),
      alertsToId: parseInt(this.state.ddl_AlertsTo),
      noticesToId: parseInt(this.state.ddl_NoticesTo),
      filePath: this.state.txt_FilePath,
      isPublic: this.state.cbl_IsPublic,
      isVisible: this.state.cbl_IsVisible,
      isActive: this.state.cbl_IsActive,
      userId: 1,
    };
    PostApi(Department_Api.InsertAndUpdate, payload)
      .then((res) => {
        if (res.data.table0[0].Status === Labels.flag.select) {
          this.props.navigate(labelRoutes.departmentSummary, {
            state: res.data.table0[0].Message,
          });
        } else {
          this.showToast(res.data.table0[0].Message, Labels.error);
        }
      })
  };
  handleClear = () => {
    this.setState((prevState) => ({
      errors: {
        txt_Department: "",
        ddl_ParentDepartment: "",
        ddl_Manager: "",
        txt_EmailId: "",
        txt_AutoRespEmailId: "",
        ddl_AutoRespTemplate: "",
        txt_EmailSignature: "",
        ddl_Sla: "",
        ddl_AlertsTo: "",
        ddl_NoticesTo: "",
        txt_FilePath: "",
      },
      parentDepartmentOptions: prevState.parentDepartmentOptions,
      managerOptions: prevState.managerOptions,
      autoRespTemplateOptions: prevState.autoRespTemplateOptions,
      slaOptions: prevState.slaOptions,
      alertsToOptions: prevState.alertsToOptions,
      noticesToOptions: prevState.noticesToOptions,
    }));
  };
  render() {
    return (
      <React.Fragment>
        <ZCard
          title={Labels.departmentForm}
          onBackClick={() => this.props.navigate(labelRoutes.departmentSummary)}
        >
          <div className="form-container">
            <div className="form-grid">
              <ZTextField
                name={Labels.txt_Department}
                label={Labels.DepartmentLabels.departmentMandatory}
                value={this.state.txt_Department}
                onChange={this.handleChange}
                onKeyPress={allowAlphaSpace}
                error={this.state.errors.txt_Department}
                helperText={this.state.errors.txt_Department}
                disabled={!this.state.cbl_IsActive}
                maxLength={40}
              />
              <ZDropdown
                name={Labels.ddl_ParentDepartment}
                label={Labels.DepartmentLabels.parentDepartment}
                options={this.state.parentDepartmentOptions.map((item) => ({
                  label: item.ParentDepartmentName,
                  value: item.ParentDepartmentId,
                }))}
                value={this.state.ddl_ParentDepartment}
                onChange={this.handleChange}
                error={this.state.errors.ddl_ParentDepartment}
                helperText={this.state.errors.ddl_ParentDepartment}
                disabled={!this.state.cbl_IsActive}
              />
              <ZDropdown
                name={Labels.ddl_Manager}
                label={Labels.DepartmentLabels.manager}
                options={this.state.managerOptions.map((item) => ({
                  label: item.ManagerName,
                  value: item.ManagerId,
                }))}
                value={this.state.ddl_Manager}
                onChange={this.handleChange}
                error={!!this.state.errors.ddl_Manager}
                helperText={this.state.errors.ddl_Manager}
                disabled={!this.state.cbl_IsActive}
              />
              <ZTextField
                name={Labels.txt_EmailId}
                label={Labels.DepartmentLabels.emailId}
                value={this.state.txt_EmailId}
                onChange={this.handleChange}
                onKeyPress={allowEmailCharsOnly}
                error={!!this.state.errors.txt_EmailId}
                helperText={this.state.errors.txt_EmailId}
                disabled={!this.state.cbl_IsActive}
                maxLength={65}
                onKeyUp={toLowerCase}
              />
              <ZTextField
                name={Labels.txt_AutoRespEmailId}
                label={Labels.DepartmentLabels.autoRespEmailId}
                value={this.state.txt_AutoRespEmailId}
                onChange={this.handleChange}
                onKeyPress={allowEmailCharsOnly}
                error={!!this.state.errors.txt_AutoRespEmailId}
                helperText={this.state.errors.txt_AutoRespEmailId}
                disabled={!this.state.cbl_IsActive}
                maxLength={65}
                onKeyUp={toLowerCase}
              />
              <ZDropdown
                name={Labels.ddl_AutoRespTemplate}
                label={Labels.DepartmentLabels.autoRespTemplate}
                options={this.state.autoRespTemplateOptions.map((item) => ({
                  label: item.AutoRespTemplateName,
                  value: item.AutoRespTemplateId,
                }))}
                value={this.state.ddl_AutoRespTemplate}
                onChange={this.handleChange}
                error={!!this.state.errors.ddl_AutoRespTemplate}
                helperText={this.state.errors.ddl_AutoRespTemplate}
                disabled={!this.state.cbl_IsActive}
              />
              <ZTextField
                name={Labels.txt_EmailSignature}
                label={Labels.DepartmentLabels.emailSignature}
                value={this.state.txt_EmailSignature}
                onChange={this.handleChange}
                error={!!this.state.errors.txt_EmailSignature}
                helperText={this.state.errors.txt_EmailSignature}
                disabled={!this.state.cbl_IsActive}
                maxLength={90}
              />
              <ZDropdown
                name={Labels.ddl_Sla}
                label={Labels.DepartmentLabels.sla}
                options={this.state.slaOptions.map((item) => ({
                  label: item.SlaName,
                  value: item.SlaId,
                }))}
                value={this.state.ddl_Sla}
                onChange={this.handleChange}
                error={!!this.state.errors.ddl_Sla}
                helperText={this.state.errors.ddl_Sla}
                disabled={!this.state.cbl_IsActive}
              />
              <ZDropdown
                name={Labels.ddl_AlertsTo}
                label={Labels.DepartmentLabels.alertsTo}
                options={this.state.alertsToOptions.map((item) => ({
                  label: item.AlertsToName,
                  value: item.AlertsToId,
                }))}
                value={this.state.ddl_AlertsTo}
                onChange={this.handleChange}
                error={this.state.errors.ddl_AlertsTo}
                helperText={this.state.errors.ddl_AlertsTo}
                disabled={!this.state.cbl_IsActive}
              />
              <ZDropdown
                name={Labels.ddl_NoticesTo}
                label={Labels.DepartmentLabels.noticesTo}
                options={this.state.noticesToOptions.map((item) => ({
                  label: item.NoticesToName,
                  value: item.NoticesToId,
                }))}
                value={this.state.ddl_NoticesTo}
                onChange={this.handleChange}
                error={!!this.state.errors.ddl_NoticesTo}
                helperText={this.state.errors.ddl_NoticesTo}
                disabled={!this.state.cbl_IsActive}
              />
              <ZTextField
                name={Labels.txt_FilePath}
                label={Labels.DepartmentLabels.filePath}
                value={this.state.txt_FilePath}
                onChange={this.handleChange}
                error={this.state.errors.txt_FilePath}
                helperText={this.state.errors.txt_FilePath}
                disabled={!this.state.cbl_IsActive}
                maxLength={190}
              />
            </div>
            <div className="form-actions-row">
              <div className="checkbox-group">
                <ZCheckbox
                  name={Labels.cbl_IsActive}
                  checked={this.state.cbl_IsActive}
                  onChange={(val) => this.setState({ cbl_IsActive: val })}
                  label={Labels.DepartmentLabels.isActive}
                />
                <ZCheckbox
                  name={Labels.cbl_IsPublic}
                  checked={this.state.cbl_IsPublic}
                  onChange={(val) => this.setState({ cbl_IsPublic: val })}
                  label={Labels.DepartmentLabels.isPublic}
                  disabled={!this.state.cbl_IsActive}
                />
                <ZCheckbox
                  name={Labels.cbl_IsVisible}
                  checked={this.state.cbl_IsVisible}
                  onChange={(val) => this.setState({ cbl_IsVisible: val })}
                  label={Labels.DepartmentLabels.isVisible}
                  disabled={!this.state.cbl_IsActive}
                />

              </div>
              <div className="button-group">
                {this.state.btn_update === Labels.submit ? (
                  <ZButton
                    label={Labels.reset}
                    variant={Labels.outlined}
                    onClick={this.handleClear}
                  />
                ) : (
                  <></>
                )}
                <ZButton
                  label={this.state.btn_update}
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
      </React.Fragment>
    );
  }
}
export default AppNavigation(Department);