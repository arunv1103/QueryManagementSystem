import React, { Component } from "react";
import DOMPurify from "dompurify";
import { Labels } from "../../utils/constants/labels";
import ZTypography from "../../component/ZTypography/ztypography";
import dayjs from "dayjs";
import { AppNavigation } from "../../navigations/appNavigation";
import TicketIcon from "../../utils/assets/images/TicketIcon.png";
import { FiArrowLeft } from "react-icons/fi";
import "./ticketPreview.css";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import { GetApi } from "../../utils/api/networking";
import { Department_Api } from "../../utils/api/apiUrl";
import { labelRoutes } from "../../navigations/labelRoutes";

class TicketPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      attachments: [],
      error: null,
      isAgent: false,
      allAgents: [],
      allCategories: [], // This will be used for categories
      allPriorities: [],
      allStatuses: [],
      showAgentList: false,
      showCategoryList: false,
    };
  }
  fetchDropdownValues = () => {
    GetApi(Department_Api.GetDropdownValues).then((res) => {
      if (res.status === Labels.flag.select) {
        const data = res.data.data;
        console.log(data, "data");

        this.setState({
          allAgents: data.table8 || [],
          allCategories: data.table9 || [],
          allPriorities: data.table7 || [],
          allStatuses: data.table6 || [],
        });
      } else {
        this.setState({
          allAgents: [],
          allCategories: [],
          allPriorities: [],
          allStatuses: [],
        });
      }
    });
  };

  componentDidMount() {
    if (this.props.location?.state) {
      this.setState({
        ticket: this.props.location.state.ticketData || {},
        attachments: this.props.location.state.attachments || [],
        isAgent: this.props.location.state.isAgent || false,
      });
    } else {
      this.setState({ error: Labels.catchErrorMsg });
    }
    this.fetchDropdownValues();
  }
  getStatusChipClass = (status) => {
    if (!status) return "chip chip-new";
    switch (status.toLowerCase()) {
      case "opened":
        return "chip chip-assigned";
      case "resolved":
        return "chip chip-inprogress";
      case "closed":
        return "chip chip-closed";
      default:
        return "chip chip-new";
    }
  };

  getPriorityChipClass = (priority) => {
    if (!priority) return "chip chip-medium";
    switch (priority.toLowerCase()) {
      case "low":
        return "chip chip-low";
      case "medium":
        return "chip chip-medium";
      case "high":
        return "chip chip-high";
      case "critical":
        return "chip chip-critical";
      default:
        return "chip chip-medium";
    }
  };

  render() {
    const { ticket, attachments, error, isAgent } = this.state;

    if (error) {
      return (
        <div className="ticket-preview-error">
          <div className="error-message">{error}</div>
        </div>
      );
    }

    return (
      <div className="ticket-preview-container">
        {/* Content Grid */}
        <div className="ticket-preview-content-wrapper">
          <div className="ticket-preview-grid">
            {/* Left Content */}
            <div className="ticket-preview-main-card">
              {/* Header inside the card */}
              <div className="ticket-preview-header">
                <div className="ticket-preview-header-title">
                  <img
                    src={TicketIcon}
                    alt={Labels.ticket}
                    className="ticket-preview-icon"
                  />
                  <span className="ticket-preview-title-text">
                    {Labels.ticketPreview}
                  </span>
                </div>

                <FiArrowLeft
                  className="ticket-preview-back-icon"
                  onClick={() => this.props.navigate(-1)}
                />
              </div>

              <div className="ticket-preview-content">
                {/* Agent Actions Section */}
                {isAgent && (
                  <div className="agent-actions-section">
                    <h3 className="agent-actions-title">{Labels.actions}</h3>
                    <div className="agent-actions-grid">
                      <div className="agent-action-item">
                        <span className="agent-action-label">Action</span>
                        <span
                          className="agent-action-value"
                          style={{ cursor: "pointer" }}
                            onClick={() => {
                            this.props.navigate(labelRoutes.ticketReply, {
                              state: {
                                priority: ticket.Priority || "High",
                                lastUpdated: ticket.LastUpdatedOn || "August 8, 2025 - 18:51",
                                raisedBy: ticket.FirstName || ticket.RaisedBy || "rajahrs222@gmail.com",
                                source: Labels.viaMobile, // since it's always mobile in your example
                              },
                            });
                          }}
                        >
                        
                          {" "}
                          {ticket.Action || "Reply"}
                        </span>
                      </div>
                      {/* Assigned To */}
                      <div className="agent-action-item">
                        <span className="agent-action-label">
                          {Labels.assignedTo}
                        </span>

                        <div
                          className="agent-action-value editable"
                          onMouseEnter={this.fetchDropdownvalues}
                          onClick={() =>
                            this.setState({
                              showAgentList: !this.state.showAgentList,
                            })
                          }
                        >
                          {ticket.AssignedTo || "Agent"}

                          {this.state.showAgentList && (
                            <div className="agent-list-popover">
                              {(this.state.allAgents || [])
                                .filter(
                                  (agent) =>
                                    agent.UserName !== ticket.AssignedTo
                                )
                                .map((agent) => (
                                  <div
                                    key={agent.UserId}
                                    className="agent-list-item"
                                    onClick={() =>
                                      this.setState({
                                        ticket: {
                                          ...ticket,
                                          AssignedTo: agent.UserName,
                                        },
                                        showAgentList: false, // close popover
                                      })
                                    }
                                  >
                                    {agent.UserName}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="agent-action-item">
                        <span className="agent-action-label">
                          {Labels.category}
                        </span>
                        <div
                          className="agent-action-value editable"
                          onClick={() =>
                            this.setState({
                              showCategoryList: !this.state.showCategoryList,
                            })
                          }
                        >
                          {ticket.Category || "-"}

                          {this.state.showCategoryList && (
                            <div className="agent-list-popover">
                              {(this.state.allCategories || [])
                                .filter(
                                  (category) =>
                                    category.DepartmentName !== ticket.Category
                                )
                                .map((category) => (
                                  <div
                                    key={category.DepartmentId}
                                    className="agent-list-item"
                                    onClick={() =>
                                      this.setState({
                                        ticket: {
                                          ...ticket,
                                          Category: category.DepartmentName,
                                        },
                                        showCategoryList: false, // close popover
                                      })
                                    }
                                  >
                                    {category.DepartmentName}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="agent-action-item">
                        <span className="agent-action-label">
                          {Labels.priority}
                        </span>
                        <div
                          className="agent-action-value editable"
                          onClick={() =>
                            this.setState({
                              showPriorityList: !this.state.showPriorityList,
                            })
                          }
                        >
                          <span
                            className={`priority-badge ${
                              ticket.Priority === "Low"
                                ? "priority-low"
                                : ticket.Priority === "Normal"
                                ? "priority-normal"
                                : ticket.Priority === "High"
                                ? "priority-high"
                                : "priority-critical"
                            }`}
                          >
                            {ticket.Priority || "Medium"}
                          </span>

                          {this.state.showPriorityList && (
                            <div className="agent-list-popover">
                              {(this.state.allPriorities || [])
                                .filter(
                                  (priority) =>
                                    priority.PriorityName !== ticket.Priority
                                )
                                .map((priority) => (
                                  <div
                                    key={priority.PriorityId || priority}
                                    className="agent-list-item"
                                    onClick={() =>
                                      this.setState({
                                        ticket: {
                                          ...ticket,
                                          Priority:
                                            priority.PriorityName || priority,
                                        },
                                        showPriorityList: false,
                                      })
                                    }
                                  >
                                    {priority.PriorityName || priority}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="agent-action-item">
                        <span className="agent-action-label">
                          {Labels.status}
                        </span>
                        <div
                          className="agent-action-value editable"
                          onClick={() =>
                            this.setState({
                              showStatusList: !this.state.showStatusList,
                            })
                          }
                        >
                          {ticket.Status || "Open"}

                          {this.state.showStatusList && (
                            <div className="agent-list-popover">
                              {(this.state.allStatuses || [])
                                .filter(
                                  (status) =>
                                    status.StatusName !== ticket.Status
                                )
                                .map((status) => (
                                  <div
                                    key={status.StatusId || status}
                                    className="agent-list-item"
                                    onClick={() =>
                                      this.setState({
                                        ticket: {
                                          ...ticket,
                                          Status: status.StatusName || status,
                                        },
                                        showStatusList: false,
                                      })
                                    }
                                  >
                                    {status.StatusName || status}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title + Status Section */}
                <div className="ticket-title-section">
                  <div className="ticket-title-wrapper">
                    <div className="ticket-title-content">
                      <h2 className="ticket-title">
                        #{ticket.TicketID || "TC-24"}{" "}
                        {ticket.Summary ||
                          "Server issues while hit the apis, its not working"}
                      </h2>
                      <span className="ticket-source-badge">
                        {Labels.viaMobile}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid - Updated with Response Due */}
                <div className="ticket-info-grid">
                  <div className="info-item">
                    <span className="info-label">{Labels.date}</span>
                    <span className="info-value">
                      {ticket.CreatedOn
                        ? dayjs(ticket.CreatedOn).format(Labels.dateTimeFormat)
                        : "August 5, 2025 - 10:25"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{Labels.lastUpdated}</span>
                    <span className="info-value">
                      {ticket.LastUpdatedOn
                        ? dayjs(ticket.LastUpdatedOn).format(
                            Labels.dateTimeFormat
                          )
                        : "August 5, 2025 - 10:25"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{Labels.raisedBy}</span>
                    <span className="info-value">
                      {ticket.FirstName ||
                        ticket.RaisedBy ||
                        "rajahrs222@gmail.com"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{Labels.status}</span>
                    <div className="ticket-status-wrapper">
                      <span className="ticket-status-badge">
                        {ticket.Status || "Assigned"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <hr className="description-divider" />
                <div>
                  <h3 className="description-title">{Labels.description}</h3>
                  <div
                    className="description-content"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(ticket.Description || "-"),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Additional Info */}
            <div className="ticket-preview-sidebar">
              <div className="additional-info-card">
                {/* Additional Info Header */}
                <div className="additional-info-header">
                  <h3 className="additional-info-title">
                    {Labels.additionalInfo}
                  </h3>
                </div>

                {/* Additional Info Content */}
                <div className="additional-info-content">
                  <div>
                    <h4 className="sidebar-section-title">
                      {Labels.attachments || "Attachments"}
                    </h4>
                    <div className="sidebar-section-content">
                      {attachments.length > 0 ? (
                        <ul className="attachment-list">
                          {attachments.map((file, index) => (
                            <li key={index} className="attachment-item">
                              <a
                                href={file.url || file.downloadUrl} // adjust based on your API response
                                target="_blank"
                                rel="noopener noreferrer"
                                download={file.name}
                              >
                                {file.FileName || `Attachment ${index + 1}`}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>
                          {Labels.noAttachments || "No attachments added yet"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="sidebar-section-title">
                      {Labels.notes || "Notes"}
                    </h4>
                    <p className="sidebar-section-content">
                      {ticket.Notes || Labels.noNotes || "No notes added yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppNavigation(TicketPreview);
