import React, { Component } from "react";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import ZButton from "../../component/ZButton/zbutton";
import ZCard from "../../component/ZCard/zcard";
import { Labels } from "../../utils/constants/labels";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PostApi, GetApi } from "../../utils/api/networking";
import { Master_Api, Ticket_Api } from "../../utils/api/apiUrl";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import IconButton from "@mui/material/IconButton";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
import "./ticketForm.css";
import ZTextEditor from "../templateGroup/zTextEditor";
import CloseIcon from "@mui/icons-material/Close";
import "../../component/ZCard/zcard.css"

class TicketForm extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const isEditMode = location?.state?.isEditMode || false;
    const ticketData = location?.state?.ticketData || {};
    const attachments = location?.state?.attachments || [];
    this.state = {
      formData: {
        txt_summary: ticketData.Summary || "",
        ddl_priority: ticketData.PriorityID?.toString() || "",
        ddl_severity: ticketData.SeverityID?.toString() || "",
        txted_message: ticketData.Description || "",
        attachment: null,
        existingAttachments: attachments,
        targetDate: ticketData.TargetDate ? new Date(ticketData.TargetDate) : null,
        ticketId: ticketData.TicketID || null,
      },
      dropdownOptions: {
        priorities: [],
        severities: [],
      },
      errors: {},
      isLoading: false,
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: 4000,
        position: { vertical: Labels.top, horizontal: Labels.center },
      },
      isEditMode,
    };
    this.fileInputRef = React.createRef();
    this.showToast = this.showToast.bind(this);
    this.handleCloseToast = this.handleCloseToast.bind(this);
    this.handleRemoveExistingAttachment = this.handleRemoveExistingAttachment.bind(this);
  }

  // Toaster Message
  showToast = (message, severity = Labels.success, duration = 4000) => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration,
        position: { vertical: Labels.top, horizontal: Labels.center },
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
    GetApi(Master_Api.GetTicketDropdownValue)
      .then((res) => {
        if (res.status === Labels.flag.select) {
          this.setState({
            dropdownOptions: {
              priorities: res.data.data.table0 || [],
              severities: res.data.data.table1 || [],
            },
          });
        }
      })
  };

  convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.replace(/^data:.+;base64,/, "");
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  componentDidMount() {
    this.fetchDropdownData();
  }

  validateForm = () => {
    const errors = {};
    const { formData } = this.state;

    if (!formData.txt_summary.trim()) {
      errors.txt_summary = Labels.required;
    }
    if (!formData.ddl_priority) {
      errors.ddl_priority = Labels.required;
    }
    if (!formData.ddl_severity) {
      errors.ddl_severity = Labels.required;
    }
    if (!formData.txted_message.trim()) {
      errors.txted_message = Labels.required;
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: updatedValue,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };
  handleRemoveExistingAttachment = (index) => {
    this.setState(prevState => {
      const updatedAttachments = [...prevState.formData.existingAttachments];
      updatedAttachments.splice(index, 1);
      return {
        formData: {
          ...prevState.formData,
          existingAttachments: updatedAttachments
        }
      };
    });
  };

  handleSubmit = async () => {
    if (!this.validateForm()) return;
    try {
      const { formData, isEditMode } = this.state;
      const payload = {
        Flag: isEditMode ? Labels.flag.update : Labels.flag.insert,
        Summary: formData.txt_summary,
        PriorityID: Number(formData.ddl_priority),
        SeverityID: Number(formData.ddl_severity),
        Description: formData.txted_message,
        CreatedBy: 1,
        UserId: 1,
        StatusID: 1,
        DepartmentId: 1,
        ModifiedBy: 1,
        TicketID: isEditMode ? formData.ticketId : null,
        TargetDate: null,
        FileSource: null,
        FileName: ''
      };
      //TargetDate: formData.targetDate ? formData.targetDate.toISOString() : null,
      if (formData.attachment) {
        payload.FileSource = await this.convertFileToBase64(formData.attachment);
        payload.FileName = formData.attachment.name;
      }
      const response = await PostApi(Ticket_Api.AddUpdateTickets, payload);
     // console.log("ticket form Response:", response);
      if (response.data.table0[0].Status === Labels.flag.select) {
        this.props.navigate(labelRoutes.userDashboard);
        this.showToast(response.data.table0[0].Message, Labels.success);
      } else {
        this.showToast(response.data.table0[0].Message, Labels.error);
      }
    } catch (err) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  handleClear = () => {
    this.setState({
      formData: {
        txt_summary: "",
        ddl_priority: "",
        ddl_severity: "",
        txted_message: "",
        attachment: null,
      },
      errors: {},
    });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.formData.attachment) {
      e.currentTarget.classList.add("drag-over");
    }
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          attachment: file,
          attachmentName: file.name,
        },
      }));
    }
  };
  handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          attachment: file,
          attachmentName: file.name,
        },
      }));
    }
  };
  handleEditorChange = (content) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        txted_message: content
      }
    }));
  };
  handleBrowseClick = () => {
    this.fileInputRef.current.click();
  };

  handleRemoveAttachment = () => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        attachment: null,
        attachmentName: "",
      },
    }));
    this.fileInputRef.current.value = "";
  };

  render() {
    const {
      formData,
      dropdownOptions,
      errors,
      isLoading,
      toast,
      isEditMode
    } = this.state;
    return (
      <div className="ticket-form-container">
        <div className="ticket-form-header">
          <p className="ticket-form-title">
            {this.state.isEditMode ? Labels.editTicket : Labels.createNewTicket}
          </p>
          <div
            className="ticket-back-icon"
            onClick={() => this.props.navigate(labelRoutes.userDashboard)}
          >
            <ArrowBackIcon />
          </div>
        </div>
        <div className="ticket-form-grid">
          <ZCard>
            <div className="field-label">
              Ticket Details <span className="required">*</span>
            </div>
            <ZTextField
              name={Labels.ticketForm.txt_summary}
              label={Labels.ticketForm.Query}
              value={formData.txt_summary}
              onChange={this.handleChange}
              error={errors.txt_summary}
              helperText={errors.txt_summary}
              disabled={isLoading}
            />
            <div className="form-section dropdown-row">
              <ZDropdown
                name={Labels.ticketForm.ddl_priority}
                label={Labels.ticketForm.Priority}
                options={dropdownOptions.priorities.map((item) => ({
                  label: item.PriorityName,
                  value: item.PriorityID,
                }))}
                value={formData.ddl_priority}
                onChange={this.handleChange}
                error={errors.ddl_priority}
                helperText={errors.ddl_priority}
                disabled={isLoading}
              />
              <ZDropdown
                name={Labels.ticketForm.ddl_severity}
                label={Labels.ticketForm.Severity}
                options={dropdownOptions.severities.map((item) => ({
                  label: item.SeverityName,
                  value: item.SeverityID,
                }))}
                value={formData.ddl_severity}
                onChange={this.handleChange}
                error={errors.ddl_severity}
                helperText={errors.ddl_severity}
                disabled={isLoading}
              />
            </div>

            <label className="field-label">
              Message <span className="required">*</span>
            </label>
            <div className="form-section">
              <ZTextEditor
                //key={`editor-${formData.ticketId || 'new'}`} // Force remount on ticket change
                content={formData.txted_message}
                onChange={this.handleEditorChange}
                height={250}
                className="txt-editor"
              />
              {errors.txted_message && (
                <span className="error-text">{errors.txted_message}</span>
              )}
            </div>
          </ZCard>

          {/* Right Section – Attachments */}

          <div className="right-side-panel">
            <ZCard>
              <label  className="field-label">Attachments</label>
              {/* Existing Attachments */}
              {formData.existingAttachments?.map((attachment, index) => (
                <div key={index} className="existing-attachment">
                  <a
                    href={`data:application/octet-stream;base64,${attachment.FileSource}`}
                    download={attachment.FileName}
                  >
                    {attachment.FileName}
                  </a>
                  <IconButton
                    size="small"
                    onClick={() => this.handleRemoveExistingAttachment(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}

              {/* New Attachment Upload */}
              <div
                className={`attachment-box ${!formData.attachment ? "drag-target" : ""}`}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                onClick={!formData.attachment ? this.handleBrowseClick : undefined}
              >
                <input
                  type="file"
                  ref={this.fileInputRef}
                  onChange={this.handleFileInputChange}
                  style={{ display: "none" }}
                />
                {formData.attachment ? (
                  <div className="attachment-preview">
                    <span>{formData.attachmentName}</span>
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={this.handleRemoveAttachment}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <p className="grey-text">
                    Drag and drop files here, or{"   "}
                    <span className="browse-link">browse</span>
                  </p>
                )}
              </div>
            </ZCard>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-btn-container">
          <ZButton
            label={isLoading ? 'Submitting...' : (this.state.isEditMode ? 'Update Ticket' : 'Create Ticket')}
            onClick={this.handleSubmit}
            disabled={isLoading}
          />
        </div>

        {/* Toaster */}
        <ZToasterMsg
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          duration={toast.duration}
          position={toast.position}
          onClose={this.handleCloseToast}
        />
      </div>
    );

  }
}

export default AppNavigation(TicketForm);
