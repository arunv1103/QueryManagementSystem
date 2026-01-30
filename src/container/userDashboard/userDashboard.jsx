import React, { Component } from "react";
import ZCard from "../../component/ZCard/zcard";
import ZChart from "../../container/userDashboard/ZChart";
import { GetApi, PostApi } from "../../utils/api/networking";
import ZButton from "../../component/ZButton/zbutton";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZTypography from "../../component/ZTypography/ztypography";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { Ticket_Api } from "../../utils/api/apiUrl";
import { Labels } from "../../utils/constants/labels";
import "./userDashboard.css";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import ChatIcon from "@mui/icons-material/Chat";
import Tooltip from "@mui/material/Tooltip";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
import { CommonColors } from "../../utils/constants/colors";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ZTable from "../../component/ZTable/ztable";
import ZPopoverDialog from "../../component/ZDialogueBox/zdialog";
import { Label, Notes } from "@mui/icons-material";
import SessionExpired from "../sessionExpired/sessionExpired";
import { toast } from "react-toastify";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketData: [],
      notesDialogOpen: false,
      selectedTicket: null,
      txt_note: "",
      priorityCounts: {
        Critical: 0,
        High: 0,
        Normal: 0,
        Low: 0,
      },
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
  }
  handleRaiseQuery = () => {
    this.props.navigate(labelRoutes.ticketForm);
  };
  showToast = (message, severity = Labels.success) => {
    this.setState({
      toast: {
        ...this.state.toast,
        open: true,
        message,
        severity,
      },
    });
  };
  handleCloseToast = () => {
    this.setState({ toast: { ...this.state.toast, open: false } });
  };

  componentDidMount() {
    this.pageLoad();
  }
  pageLoad = () => {
    GetApi(Ticket_Api.GetTicketStatusSummary, {}, true)
      .then((res) => {
        if (res?.status === Labels.flag.select) {
          this.setState({
            ticketData: res.data.data.table0 || [],
          });
        }
      })
      .catch((error) => {
        console.error(Labels.catchErrorMsg, error);
      });
    this.fetchTicketData();
    this.fetchPriorityCounts();
  };

  fetchTicketData = () => {
    GetApi(Ticket_Api.GetTicketsSummary, {}, true)
      .then((res) => {
        if (res.status === Labels.flag.select) {
          const validRows = (res.data.data.table0 || []).filter(
            (item) => item && Object.keys(item).length > 0
          );
          const tickets = validRows.map((item) => {
            return {
              id: item.TicketID || 0,
              summary: item.Summary || "-",
              priority: item.PriorityName || "-",
              severity: item.SeverityName || "-",
              status:
                typeof item.StatusName !== Labels.object
                  ? item.StatusName
                  : "-",
              createdDate: item.CreatedOn || "-",
              createdBy: item.CreatedByName || "-",
              lastUpdated: item.LastUpdatedOn || "-",
              isActive: item.IsActive || true,
              ticketDate: item.TicketDate || "",
              Email:item.Email || "",
            };
          });
          this.setState({ tickets });
        } else {
          this.setState({ tickets: [] });
        }
      })
      .catch(() => {
        this.setState({ tickets: [] });
      });
  };
  fetchPriorityCounts = () => {
    this.setState({ isLoading: true });
    GetApi(Ticket_Api.GetPriorityCount, {}, true).then((res) => {
      if (res?.status === Labels.flag.select) {
        const priorityData = res.data.data.table0 || [];
        const counts = {
          Critical: 0,
          High: 0,
          Normal: 0,
          Low: 0,
        };
        priorityData.forEach((item) => {
          if (item.PriorityName === Labels.Critical)
            counts.Critical = item.PriorityCount;
          else if (item.PriorityName === Labels.High)
            counts.High = item.PriorityCount;
          else if (item.PriorityName === Labels.Normal)
            counts.Normal = item.PriorityCount;
          else if (item.PriorityName === Labels.Low)
            counts.Low = item.PriorityCount;
        });
        this.setState({
          priorityCounts: counts,
          isLoading: false,
        });
      } else {
        this.setState({ priorityCounts: {} });
      }
    });
  };
  handleNotesClick = (ticket) => {
    this.setState({
      notesDialogOpen: true,
      selectedTicket: ticket,
      txt_note: "",
    });
  };
  handleNoteSubmit = async () => {
    const { selectedTicket, txt_note } = this.state;
    if (!selectedTicket || !txt_note.trim()) return;
    try {
      const response = await PostApi(
        Ticket_Api.AddUpdateNotes,
        {
          Flag: Labels.flag.insert,
          TicketID: selectedTicket.id,
          UserID: 1,
          Notes: txt_note,
        },
        true
      );
      if (response?.status === Labels.flag.select) {
        this.fetchTicketData();
        this.setState({
          notesDialogOpen: false,
          txt_note: "",
        });
        this.showToast(response.data.data.table0[0]?.Message, Labels.success);
      } else {
        this.showToast(response?.Message, Labels.error);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };

  handleNoteChange = (event) => {
    this.setState({ txt_note: event.target.value });
  };

  handleCloseNotesDialog = () => {
    this.setState({ notesDialogOpen: false });
  };
  handleViewTicket = async (ticket) => {
    try {
      const response = await GetApi(
        `${Ticket_Api.GetTicketsSummary}?TicketID=${ticket.id}`,
        {},
        true
      );
      if (
        response.data.status === Labels.flag.select ||
        response.data.data.table0[0].length > 0
      ) {
        const ticketData = response.data.data.table0[0];
        this.props.navigate(labelRoutes.ticketView, {
          state: {
            ticketData: {
              TicketID: ticketData.TicketID,
              Summary: ticketData.Summary,
              Description: ticketData.Description,
              CreatedBy: ticketData.FirstName,
              Status: ticketData.StatusName,
              CreatedOn: ticketData.TicketDate,
              LastUpdatedOn: ticketData.LastUpdatedOn,
              TargetDate: ticketData.TargetDate,
              Notes: ticketData.Notes,
              UserName: ticketData.FirstName,
              Email:ticketData.Email,
              FileName: ticketData.FileName,
              FileSource: ticketData.FileSource,
            },
            isAgent: true,
          },
        });
      }
    } catch (error) {
      console.error(Labels.catchErrorMsg, error);
    }
  };

  // handleEdit = async (ticket) => {
  //   try {
  //     const response = await GetApi(`${Ticket_Api.GetTicketsSummary}?TicketID=${ticket.id}`);
  //     if (response.status === Labels.flag.select && response.data.data.table0 && response.data.data.table0.length > 0) {
  //       const ticketData = response.data.data.table0[0];
  //       const attachments = Array.isArray(response.data.data.table1)
  //         ? response.data.data.table1
  //         : [];
  //       this.props.navigate(labelRoutes.ticketForm, {
  //         state: {
  //           ticketData: {
  //             TicketID: ticketData.TicketID,
  //             Summary: ticketData.Summary,
  //             Description: ticketData.Description,
  //             PriorityID: ticketData.PriorityID,
  //             SeverityID: ticketData.SeverityID,
  //             StatusID: ticketData.StatusID,
  //             TargetDate: ticketData.TargetDate,
  //             CreatedOn: ticketData.CreatedOn,
  //             LastUpdatedOn: ticketData.LastUpdatedOn
  //           },
  //           attachments: attachments.map(att => ({
  //             TicketID: att.TicketID,
  //             FileName: att.FileName,
  //             FileSource: att.FileSource
  //           })),
  //           isEditMode: true
  //         }
  //       });
  //     } else {
  //       console.error(Labels.catchErrorMsg, Labels.error);
  //     }
  //   } catch (error) {
  //     console.error(Labels.catchErrorMsg, error);
  //   }
  // };
  render() {
    const { ticketData, isLoading, tickets, priorityCounts } = this.state;

    const donutData = {
      labels: ticketData.map((item) => item.StatusName),
      datasets: [
        {
          label: Labels.status,
          data: ticketData.map((item) => item.StatusCount),
          backgroundColor: [
            CommonColors.pink,
            CommonColors.blue,
            CommonColors.yellow,
            CommonColors.green,
          ],
          borderWidth: 1,
        },
      ],
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: Labels.right,
        },
      },
    };
    const priorityData = {
      labels: [Labels.Critical, Labels.High, Labels.Normal, Labels.Low],
      datasets: [
        {
          data: [
            priorityCounts.Critical,
            priorityCounts.High,
            priorityCounts.Normal,
            priorityCounts.Low,
          ],
          backgroundColor: [
            CommonColors.pink,
            CommonColors.blue,
            CommonColors.yellow,
            CommonColors.green,
          ],
          borderRadius: 6,
          barThickness: 25,
        },
      ],
    };

    const totalTickets =
      priorityCounts.Critical +
      priorityCounts.High +
      priorityCounts.Normal +
      priorityCounts.Low;

    const priorityOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const percentage = (
                (context.parsed.y / totalTickets) *
                100
              ).toFixed(1);
              return `${percentage}% (${context.parsed.y} tickets)`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: {
            callback: (value) =>
              `${((value / totalTickets) * 100).toFixed(0)}%`,
          },
          beginAtZero: true,
          max: totalTickets,
        },
      },
    };

    const columns = [
      {
        field: Labels.actionsField,
        headerName: Labels.actions,
        renderCell: ({ row }) => (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={Labels.notes}>
              <IconButton onClick={() => this.handleNotesClick(row)}>
                <StickyNote2Icon sx={{ fontSize: 20, color: "black" }} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title={Labels.Notifications}> */}
            <span>
              <IconButton disabled>
                <NotificationsNoneIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
            {/* </Tooltip> */}
            {/* <Tooltip title={Labels.Reload}> */}
            <span>
              <IconButton disabled>
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
            {/* </Tooltip> */}
            {/* <Tooltip title={Labels.Comments}> */}
            <span>
              <IconButton disabled>
                <ChatIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
            {/* </Tooltip> */}
          </Box>
        ),
      },
      {
        field: Labels.ticketDate,
        headerName: Labels.date,
        renderCell: ({ row }) => {
          const formattedDate = row.ticketDate
            ? dayjs(row.ticketDate).format(Labels.dateTimeFormat)
            : "";
          return (
            <span style={{ color: CommonColors.zTable.gray }}>
              {formattedDate}
            </span>
          );
        },
      },
      {
        field: Labels.id,
        headerName: Labels.ticketNo,
        renderCell: ({ row }) => (
          <span style={{ color: CommonColors.zTable.gray }}>#{row.id}</span>
        ),
      },
      {
        field: Labels.summary,
        headerName: Labels.query,
        renderCell: ({ row }) => (
          <span
            style={{
              color: CommonColors.zTable.gray,
            }}
          >
            {row.summary}
          </span>
        ),
      },
      {
        field: Labels.statusField,
        headerName: Labels.status,
        renderCell: ({ row }) => (
          <span
            className="status-chip"
            style={{ color: CommonColors.zTable.gray }}
          >
            {row.status}
          </span>
        ),
      },
      {
        field: Labels.lastupdateField,
        headerName: Labels.lastupdateHeader,
        renderCell: ({ row }) => {
          const formattedDate = row.lastUpdated
            ? dayjs(row.lastUpdated).format(Labels.dateTimeFormat)
            : "";
          return (
            <span style={{ color: CommonColors.zTable.gray }}>
              {formattedDate}
            </span>
          );
        },
      },
    ];

    if (isLoading) {
      return (
        <>
          <div className="noDataMsg">{Labels.noDataFound}</div>
          <SessionExpired pageLoad={this.pageLoad} />
        </>
      );
    }

    return (
      <>
        <div className="dashboard-wrapper">
          {/* <ZTypography
          labelText={Labels.dashboard}
          fontWeight={Labels.bold}
          fontSize={Labels.large}
        /> */}
          {tickets && tickets.length > 0 ? (
            <ZTable
              headerLabel={Labels.yourTickets}
              data={tickets}
              columns={columns}
              rows={tickets}
              onHandleAdd={() => this.props.navigate(labelRoutes.ticketForm)}
              onRowClick={(row) => row.isActive && this.handleViewTicket(row)}
            />
          ) : (
            <div className="dashboard-header">
              <div className="container">
                <div
                  className="raise-query-text"
                  onClick={this.handleRaiseQuery}
                >
                  <HelpOutlineIcon className="query-icon" />
                  {Labels.raiseYourQueryNow}
                </div>
              </div>
            </div>
          )}
          <div className="dashboard-sections">
            <ZCard className="dashboard-card donut-chart">
              <ZTypography labelText={Labels.ticketsByStatus} />
              <div className="donut-chart">
                {ticketData.length > 0 ? (
                  <ZChart
                    type={Labels.doughnut}
                    data={donutData}
                    options={chartOptions}
                  />
                ) : (
                  <div className="no-data-message">{Labels.noDataFound}</div>
                )}
              </div>
            </ZCard>
            <ZCard className="dashboard-card explore-section">
              <ZTypography labelText={Labels.ticketsByPriority} />
              <div className="bar-chart">
                <ZChart
                  type={Labels.bar}
                  data={priorityData}
                  options={priorityOptions}
                />
              </div>
            </ZCard>
          </div>
          <ZPopoverDialog
            position={this.state.position || { top: 100, left: 200 }}
            open={this.state.notesDialogOpen}
            onClose={this.handleCloseNotesDialog}
            actions={
              <>
                <ZButton
                  variant={Labels.outlined}
                  onClick={this.handleCloseNotesDialog}
                  style={{ marginRight: "8px" }}
                >
                  {Labels.Cancel}
                </ZButton>
              </>
            }
          >
            <div className="flex-between">
              <ZTypography
                labelText={`Note - Ticket #${
                  this.state.selectedTicket?.id || ""
                }`}
                fontWeight={Labels.bold}
                fontSize={Labels.large}
              />
              <IconButton
                onClick={this.handleCloseNotesDialog}
                style={{ marginLeft: "8px" }}
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </IconButton>
            </div>

            {/* Body */}
            <ZTextField
              label={Labels.note}
              multiline
              rows={4}
              value={this.state.txt_note}
              onChange={this.handleNoteChange}
              maxLength={140}
              placeholder={Labels.enterYourNoteHere}
            />
            <ZButton
              color="primary"
              onClick={this.handleNoteSubmit}
              disabled={!this.state.txt_note.trim()}
            >
              {Labels.submit}
            </ZButton>
          </ZPopoverDialog>
          <ZToasterMsg
            open={this.state.toast.open}
            message={this.state.toast.message}
            severity={this.state.toast.severity}
            duration={this.state.toast.duration}
            position={this.state.toast.position}
            onClose={this.handleCloseToast}
          />
        </div>
        <SessionExpired pageLoad={this.pageLoad} />
      </>
    );
  }
}

export default AppNavigation(DashboardPage);

