import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import {
  Box,
  CardContent,
  IconButton,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { GetApi, PostApi } from "../../utils/api/networking";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Labels } from "../../utils/constants/labels";
import {
  AgentDetails_Api,
  EmailServer_Api,
  ServiceQueue_Api,
} from "../../utils/api/apiUrl";
import ZCard from "../../component/ZCard/zcard";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import ZCheckBox from "../../component/ZCheckbox/zcheckbox";
import ZButton from "../../component/ZButton/zbutton";
import ZTypography from "../../component/ZTypography/ztypography";
import { decryptPassword, encryptPassword } from "../../utils/encryption/cryptoUtil";
import { maskEmail } from "../../utils/commonFunction/common";
import {
  isNotEmpty,
  isValidEmail,
  validatePassword,
} from "../../utils/commonFunction/common";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";

class ServiceQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      emailrows: [],
      agentrows: [],
      openFormDialog: false,
      openConfirmDialog: false,
      openServiceConfirmDialog: false,
      openEmailConfirmDialog: false,
      hoveredRowId: null,
      selectedId: null,
      dialogAction: null,
      editingId: null,
      serverId: null,
      AgentId: null,
      Departmentmaster: [],
      Assignmethodmaster: [],
      EmailServermaster: [],
      selectedEmailtype: [],
      selectedAgentname: [],
      Agentmaster: [],
      errors: {},
      agentHoveredRowId: "",
      isChecked: true,
      issqChecked: true,
      isEmailChecked: true,
      actionChecked: true,
      toast: {
        open: false,
        message: "",
        severity: "success",
        duration: 3000,
        position: {
          vertical: "bottom",
          horizontal: "right"
        }
      },
      emailData: {
        emailId: "",
        emailUserId: "",
        password: "",
        emailServer: "",
      },
      openEmailDialog: false,
      openAgentDialog: false,
      flagValue: "",
      eflag: "",
      aflag: "",
      serviceQueueName: "",
      department: "",
      assignMethod: "",
      IsActive: true,
      Id: null,
      ServiceQueue: ""
    };
  }

  validateForm = (data) => {
    let errors = {};
    if (!data.serviceQueueName) errors.serviceQueueName = "Required";
    if (!data.department) errors.department = "Required";
    if (!data.assignMethod) errors.assignMethod = "Required";
    return errors;
  };

  showToast = (message, severity = "success") => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration: 3000
      }
    });
  };

  handleCloseToast = () => {
    this.setState(prevState => ({
      toast: {
        ...prevState.toast,
        open: false
      }
    }));
  };

  EmailvalidateForm = () => {
    const errors = {};
    const { emailId, emailUserId, password, emailServer } = this.state.emailData;
    const { selectedEmailtype, isEmailChecked } = this.state;

    if (!isNotEmpty(emailId)) {
      errors.emailId = "Email ID is required";
    } else if (!isValidEmail(emailId)) {
      errors.emailId = "Enter a valid email address";
    }

    if (!isNotEmpty(emailUserId)) {
      errors.emailUserId = "Email User ID is required";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (!selectedEmailtype || selectedEmailtype.length === 0) {
      errors.selectedEmailtype = "Please select at least one email type";
    }

    if (!isNotEmpty(emailServer)) {
      errors.emailServer = "Email Server is required";
    }

    if (!isEmailChecked) {
      errors.isEmailChecked = "You must agree before continuing";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  AgentvalidateForm = () => {
    const errors = {};

    if (!this.state.selectedAgentname || this.state.selectedAgentname.length === 0) {
      errors.selectedAgentname = "Please select at least one agent name";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  componentDidMount() {
    this.getDropDownMaster();
    this.getSummary();
    this.getEmailServer();
  }

  handleAdd = () => {
    this.setState({
      flagValue: "Add",
      openFormDialog: true,
      serviceQueueName: "",
      department: "",
      assignMethod: "",
      IsActive: true,
      errors: {},
      Id: null
    });
  };

  handleEmailAdd = () => {
    this.setState({ 
      openEmailDialog: true, 
      eflag: "Add", 
      emailData: {
        emailId: "",
        emailUserId: "",
        password: "",
        emailServer: "",
      }, 
      selectedEmailtype: [],
      isEmailChecked: true,
      errors: {}
    });
  };

  handleAgentAdd = () => {
    this.setState({ 
      openAgentDialog: true, 
      aflag: "Add",
      selectedAgentname: [],
      issqChecked: true,
      actionChecked: true,
      errors: {}
    });
  };

  handleCloseFormDialog = () => {
    this.setState({ 
      openFormDialog: false,
      openEmailDialog: false,
      openAgentDialog: false,
      errors: {}
    });
  };

  // ... (rest of the methods remain similar but with consistent state management)

  getSummary = () => {
    PostApi(ServiceQueue_Api.summaryTableServiceQueue)
      .then((response) => {
        if (response.status === "S" && Array.isArray(response.servicequeueList)) {
          const rowsWithId = response.servicequeueList.map((item, index) => ({
            ...item,
            id: item.id ?? index,
            servicequeue: item.serviceQueue,
            department: item.department,
            assignMethod: item.assignmethod,
            IsActive: item.isActive,
          }));

          rowsWithId.sort((a, b) => b.IsActive - a.IsActive);
          this.setState({ rows: rowsWithId }, () => {
            if (rowsWithId.length > 0) {
              this.handleRowClick(rowsWithId[0]);
            }
          });
        } else {
          console.error("API returned no list or wrong format:", response.message);
          this.showToast(response.message || "Failed to load service queues", "error");
        }
      })
      .catch((error) => {
        console.error("Fetch error (SummarytableServiceQueue):", error);
        this.showToast("Failed to load service queues", "error");
      });
  };

  // ... (rest of the API methods with improved error handling)

  handleRowClick = (row) => {
    this.setState({ 
      editingId: row.id,
      ServiceQueue: row.servicequeue 
    }, () => {
      this.getEmailSummary();
      this.getAgentSummary();
    });
  };

  // ... (rest of the column definitions)

  render() {
    return (
      <>
        <div className="grid grid-cols-2">
          <div>
            <div style={{ paddingRight: 20 }}>
              <ZTable
                headerLabel={"ServiceQueue"}
                columns={this.getColumns()}
                rows={this.state.rows}
                onHandleAdd={this.handleAdd}
                showAdd={true}
                tableWidth="400px"
              />

              <ZDialogueBox
                open={this.state.openFormDialog}
                onClose={this.handleCloseFormDialog}
                viewType="popup"
                departmentList={this.state.Departmentmaster}
                assignmethodList={this.state.Assignmethodmaster}
                onSubmit={this.handleSubmit}
                onUpdate={this.handleUpdate}
                serviceQueueName={this.state.serviceQueueName}
                department={this.state.department}
                assignMethod={this.state.assignMethod}
                isActive={this.state.IsActive}
                id={this.state.Id}
                flag={this.state.flagValue}
                errors={this.state.errors}
              />

              <ZDialogueBox
                open={this.state.openServiceConfirmDialog}
                onClose={() => this.setState({
                  openServiceConfirmDialog: false,
                  selectedId: null,
                  dialogAction: null,
                })}
                onConfirm={() => {
                  if (this.state.dialogAction === Labels.delete) {
                    this.handleDelete(this.state.selectedId);
                  } else if (this.state.dialogAction === Labels.restore) {
                    this.handleRestore(this.state.selectedId);
                  }
                }}
                title={this.state.dialogAction === Labels.delete ? Labels.titleDelete : Labels.titleRestore}
                labelText={this.state.dialogAction === Labels.delete ? Labels.DeleteDialog : Labels.RestoreDialog}
                confirmText={Labels.yes}
                cancelText={Labels.no}
              />
              
              <ZToasterMsg
                open={this.state.toast.open}
                message={this.state.toast.message}
                severity={this.state.toast.severity}
                duration={this.state.toast.duration}
                position={{ vertical: Labels.bottom, horizontal: Labels.right }}
                onClose={this.handleCloseToast}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pr-5">
            {/* Email Server Section */}
            <div>
              {this.state.emailrows.length > 0 ? (
                <div className="max-w-[610px] overflow-x-hidden">
                  <ZTable
                    headerLabel={
                      <span style={{ fontSize: "16px", fontWeight: 600 }}>
                        Email Attached to {this.state.ServiceQueue}
                      </span>
                    }
                    columns={this.getEmailColumns()}
                    rows={this.state.emailrows}
                    onHandleAdd={this.handleEmailAdd}
                    showAdd={true}
                    sizeType="medium"
                    tableWidth="400px"
                    minHeight="165px"
                  />
                </div>
              ) : (
                <ZCard className="rounded-2xl border border-gray-200 shadow-none p-4">
                  <CardContent className="min-h-[250px] bg-gray-50 rounded-2xl flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <ZTypography
                        labelText="No Service Queue Email added."
                        flag={Labels.smallText}
                        color="text.secondary"
                      />
                      <Link
                        component="button"
                        onClick={this.handleEmailAdd}
                        underline="hover"
                        className="text-sm font-medium"
                      >
                        Click here to add.
                      </Link>
                    </div>
                  </CardContent>
                </ZCard>
              )}
              
              <ZDialogueBox
                open={this.state.openEmailConfirmDialog}
                onClose={() => this.setState({
                  openEmailConfirmDialog: false,
                  selectedId: null,
                  dialogAction: null,
                })}
                onConfirm={() => {
                  if (this.state.dialogAction === Labels.delete) {
                    this.handleEmailDelete(this.state.selectedId);
                  } else if (this.state.dialogAction === Labels.restore) {
                    this.handleEmailRestore(this.state.selectedId);
                  }
                }}
                title={this.state.dialogAction === Labels.delete ? Labels.titleDelete : Labels.titleRestore}
                labelText={this.state.dialogAction === Labels.delete ? Labels.DEmailServerDialog : Labels.REmailServerDialog}
                confirmText={Labels.yes}
                cancelText={Labels.no}
              />
            </div>

            {/* Email Dialog */}
            <ZDialogueBox
              open={this.state.openEmailDialog}
              onClose={this.handleCloseFormDialog}
              viewType="Dialog"
              Emailtitle="Email Server"
            >
              <div className="mt-2">
                <ZTextField
                  label="Email ID"
                  name="emailId"
                  value={this.state.emailData.emailId}
                  onChange={this.handleChange}
                  fullWidth
                  error={!!this.state.errors.emailId}
                  helperText={this.state.errors.emailId}
                />
              </div>
              <ZTextField
                label="Email User ID"
                name="emailUserId"
                value={this.state.emailData.emailUserId}
                onChange={this.handleChange}
                fullWidth
                error={!!this.state.errors.emailUserId}
                helperText={this.state.errors.emailUserId}
              />
              <ZTextField
                label="Password"
                name="password"
                value={this.state.emailData.password}
                onChange={this.handleChange}
                flag="password"
                fullWidth
                error={!!this.state.errors.password}
                helperText={this.state.errors.password}
              />
              <ZDropdown
                label="Email Type"
                name="selectedEmailType"
                value={this.state.selectedEmailtype}
                onChange={this.handleEmailDropdownChange}
                options={this.state.EmailServermaster.map((server) => ({
                  value: server.id,
                  label: server.emailType,
                }))}
                error={!!this.state.errors.selectedEmailtype}
                helperText={this.state.errors.selectedEmailtype}
              />
              <ZTextField
                label="Email Server"
                name="emailServer"
                value={this.state.emailData.emailServer}
                onChange={this.handleChange}
                fullWidth
                error={!!this.state.errors.emailServer}
                helperText={this.state.errors.emailServer}
              />
              <ZCheckBox
                label="IsActive"
                name="terms"
                checked={this.state.isEmailChecked}
                onChange={this.handleEmailCheckboxChange}
                error={!!this.state.errors.isEmailChecked}
                helperText={this.state.errors.isEmailChecked}
              />
              {this.state.eflag === "Add" ? (
                <ZButton
                  label="Submit"
                  fullWidth
                  onClick={this.handleEmailSubmit}
                  sx={{ mt: 2 }}
                />
              ) : (
                <ZButton
                  label="Update"
                  fullWidth
                  onClick={() => this.handleEmailUpdate(this.state.Id)}
                  sx={{ mt: 2 }}
                />
              )}
            </ZDialogueBox>

            {/* Agent Section */}
            <div>
              {this.state.agentrows.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <ZTable
                      headerLabel={
                        <span style={{ fontSize: "16px", fontWeight: 600 }}>
                          Agent Attached to {this.state.ServiceQueue}
                        </span>
                      }
                      columns={this.getAgentColumns()}
                      rows={this.state.agentrows}
                      onHandleAdd={this.handleAgentAdd}
                      showAdd={true}
                      sizeType="large"
                      tableWidth="400px"
                    />
                  </div>
                </div>
              ) : (
                <ZCard className="rounded-2xl border border-gray-200 shadow-none p-4">
                  <CardContent className="min-h-[250px] bg-gray-50 rounded-2xl flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <ZTypography
                        labelText="No Service Queue Agent added."
                        flag={Labels.smallText}
                        color="text.secondary"
                      />
                      <Link
                        component="button"
                        onClick={this.handleAgentAdd}
                        underline="hover"
                        className="text-sm font-medium"
                      >
                        Click here to add.
                      </Link>
                    </div>
                  </CardContent>
                </ZCard>
              )}
              
              <ZDialogueBox
                open={this.state.openConfirmDialog}
                onClose={() => this.setState({
                  openConfirmDialog: false,
                  selectedId: null,
                  dialogAction: null,
                })}
                onConfirm={() => {
                  if (this.state.dialogAction === Labels.delete) {
                    this.handleAgentDelete(this.state.selectedId);
                  } else if (this.state.dialogAction === Labels.restore) {
                    this.handleAgentRestore(this.state.selectedId);
                  }
                }}
                title={this.state.dialogAction === Labels.delete ? Labels.titleDelete : Labels.titleRestore}
                labelText={this.state.dialogAction === Labels.delete ? Labels.DAgentDialog : Labels.RAgentDialog}
                confirmText={Labels.yes}
                cancelText={Labels.no}
              />
            </div>

            {/* Agent Dialog */}
            <ZDialogueBox
              open={this.state.openAgentDialog}
              onClose={this.handleCloseFormDialog}
              viewType="Dialog"
              Emailtitle="Agent Details"
            >
              <div className="mt-2">
                <ZDropdown
                  label="Agent Name"
                  name="selectedAgentname"
                  value={this.state.selectedAgentname}
                  onChange={this.handleAgentDropdownChange}
                  options={this.state.Agentmaster.map((agent) => ({
                    value: agent.id,
                    label: agent.agentName,
                  }))}
                  error={!!this.state.errors.selectedAgentname}
                  helperText={this.state.errors.selectedAgentname}
                />
              </div>
              <ZCheckBox
                label="is Sq manager"
                name="terms"
                checked={this.state.issqChecked}
                onChange={this.handleissqCheckboxChange}
              />
              <ZCheckBox
                label="Is Active"
                name="isActive"
                checked={this.state.actionChecked}
                onChange={this.handleActionCheckboxChange}
                sx={{ mt: 1 }}
              />
              {this.state.aflag === "Add" ? (
                <ZButton
                  label="Submit"
                  fullWidth
                  onClick={this.handleAgentSubmit}
                  sx={{ mt: 2 }}
                />
              ) : (
                <ZButton
                  label="Update"
                  fullWidth
                  onClick={() => this.handleAgentUpdate(this.state.Id)}
                  sx={{ mt: 2 }}
                />
              )}
            </ZDialogueBox>
          </div>
        </div>
      </>
    );
  }
}

export default ServiceQueue;