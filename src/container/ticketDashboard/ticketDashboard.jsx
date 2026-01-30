import React, { Component } from "react";

import ZSummaryCard from "../../component/ZSummaryCard/zsummarycard";
import ZTypography from "../../component/ZTypography/ztypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";

// Material Icons
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ZGrid from "../../component/ZGrid/zgrid";
import ZTabs from "../../component/ZTabs/ztabs";
import ZActionToolbar from "../../component/ZActionToolbar/zactiontoolbar";
import ZTable from "../../component/ZTable/ztable";
import { Box } from "lucide-react";
import ZButton from "../../component/ZButton/zbutton";
import ZBox from "../../component/ZBox/zbox";
import { AppNavigation } from "../../navigations/appNavigation";
import SessionExpired from "../sessionExpired/sessionExpired";

class TicketDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "ATM",
      selectionModel: [],
      ticketRows: [
        {
          id: 1,
          ticketNo: "#24",
          lastUpdated: "05 August 25 at 10:25",
          subject: "Server issues while hit the apis, not working",
          status: "Assigned",
          raisedBy: "Thangaraja S",
          priority: "High",
          assignedTo: "Vakulandurai A",
          openSince: "3 days",
        },
        {
          id: 2,
          ticketNo: "#9",
          lastUpdated: "06 June 25 at 15:21",
          subject: "Enhancements",
          status: "Closed",
          raisedBy: "joe",
          priority: "High",
          assignedTo: "Vakulandurai A",
          openSince: "10 days",
        },
        {
          id: 3,
          ticketNo: "#11",
          lastUpdated: "19 March 25 at 19:44",
          subject: "Network Issue",
          status: "Assigned",
          raisedBy: "demo user",
          priority: "High",
          assignedTo: "Vakulandurai A",
          openSince: "141 days",
        },
        {
          id: 4,
          ticketNo: "#15",
          lastUpdated: "19 March 25 at 18:33",
          subject: "Rating Page Implementation",
          status: "Assigned",
          raisedBy: "demo user",
          priority: "Normal",
          assignedTo: "Vakulandurai A",
          openSince: "141 days",
        },
      ],

      summaryData: [
        {
          icon: ConfirmationNumberIcon,
          label: "My Tickets",
          value: "5",
          color: { bg: "#fff7e6", icon: "#ff9800", iconBg: "#fff3cd" },
        },
        {
          icon: PriorityHighIcon,
          label: "Priority",
          value: "H: 3  M: 1  L: 1",
          color: { bg: "#e8f5e9", icon: "#4caf50", iconBg: "#c8e6c9" },
        },
        {
          icon: DonutLargeIcon,
          label: "Status",
          value: "O: 4  R: 0  C: 1",
          color: { bg: "#fff3e0", icon: "#ff9800", iconBg: "#ffe0b2" },
        },
        {
          icon: AccessTimeIcon,
          label: "Overdue",
          value: "2",
          color: { bg: "#e3f2fd", icon: "#2196f3", iconBg: "#bbdefb" },
        },
      ],
      tabOptions: [
        { label: "Assigned to me", value: "ATM" },
        { label: "Assigned to Team", value: "ATT" },
        { label: "UnAssigned", value: "UA" },
      ],

      actions: [
        {
          label: "Status",
          options: ["Open", "Closed", "Pending"],
          onSelect: (opt) => this.handleActionSelect("Status", opt),
        },
        {
          label: "Assigned To",
          options: ["John", "Jane", "Mike"],
          onSelect: (opt) => this.handleActionSelect("Assigned To", opt),
        },
        {
          label: "Transfer",
          options: ["Team A", "Team B"],
          onSelect: (opt) => this.handleActionSelect("Transfer", opt),
        },
        {
          label: "Delete",
          options: ["Confirm Delete"],
          onSelect: (opt) => this.handleActionSelect("Delete", opt),
        },
      ],
      showToolbar: [],
    };
  }

  handleTabChange = (newValue) => {
    this.setState({ activeTab: newValue });
  };

  handleActionSelect = (action, option) => {
    console.log(`Selected ${option} from ${action}`);
  };

  handleSelectionChange = (newSelection) => {
    const selectionArray = Array.isArray(newSelection)
      ? newSelection
      : [newSelection];

    console.log(selectionArray, "selectionArray");
    this.setState({
      // selectionModel: [...new Set([...selectionArray])],
      selectionModel: selectionArray,
      showToolbar: selectionArray.length > 1,
    });
  };

  handleDisableChange = () => {
    console.log("handledisablechanges");
  };

  handleClearSelection = () => {
    this.setState({ selectionModel: [] });
  };
  handleRowClick = (params) => {
    // Navigate to TicketView page with the row data as state
    navigate('/ticketview', { state: params.row });
  };

  render() {
    // console.log("selectionModel", this?.state?.selectionModel);

    const { ticketRows, selectionModel, showToolbar } = this.state;

    const ticketColumns = [
      {
        field: "ticketNo",
        headerName: "Ticket No.",
        // width: 120,
      },
      {
        field: "lastUpdated",
        headerName: "Last Updated",
        // width: 200,
      },
      {
        field: "subject",
        headerName: "Subject",
        // width: 400,
      },
      {
        field: "status",
        headerName: "Status",
        // width: 140,
        renderCell: ({ row }) => {
          const colors = {
            Assigned: { bg: "#FFF4E5", color: "#FF9800" },
            Closed: { bg: "#FFE5E5", color: "#F44336" },
          };
          const style = colors[row.status] || { bg: "#E0E0E0", color: "#000" };
          return (
            <div
              className="inline-block font-medium px-1 py-0.5 rounded text-[12px]"
              style={{
                backgroundColor: style.bg,
                color: style.color,
              }}
            >
              <Box>{row.status}</Box>
            </div>
          );
        },
      },
      {
        field: "raisedBy",
        headerName: "Raised By",
        // width: 160,
      },
      {
        field: "priority",
        headerName: "Priority",
        // width: 120,
        renderCell: ({ row }) => {
          const colors = {
            High: { bg: "#FFF0F0", color: "#F44336" },
            Normal: { bg: "#E6F7FF", color: "#0288D1" },
          };
          const style = colors[row.priority] || {
            bg: "#E0E0E0",
            color: "#000",
          };
          return (
            <div
              className="inline-block font-medium px-1 py-0.5 rounded text-[12px]"
              style={{ backgroundColor: style.bg, color: style.color }}
            >
              <Box>{row.priority}</Box>
            </div>
          );
        },
      },
      {
        field: "assignedTo",
        headerName: "Assigned To",
        width: 180,
      },
      {
        field: "openSince",
        headerName: "Open Since",
        width: 120,
      },
    ];

    return (
      <>
        <div className="space-y-1">
          {" "}
          {/* Adds vertical gap between children */}
          <div>
            <ZTypography
              flag={Labels.subHeader}
              labelText="Dashboard"
              font={Labels.bold}
              color={CommonColors.textPrimary}
            />
          </div>
          <div className="p-1">
            {" "}
            {/* smaller padding around ZGrid */}
            <ZGrid >
              <div className="grid grid-cols-4 gap-78 w-full">
                {this.state.summaryData.map((item, index) => (
                  <div key={index} className="p-2 text-sm w-[310px] h-[10px]">
                    <ZSummaryCard {...item} />
                  </div>
                ))}
              </div>

            </ZGrid>
          </div>
          <div >
            <ZTabs
              tabs={this.state.tabOptions}
              value={this.state.activeTab}
              onChange={this.handleTabChange}
              position="right"
            />
          </div>
          <div className="mt-4">
            {this.state.activeTab === "ATM" && (
              <ZTable
                headerLabel="Tickets"
                columns={ticketColumns}
                rows={ticketRows}
                showAdd={false}
                labelText="Add Ticket"
                showCheckbox={true}
                sizeType="small"
                checkboxSelection
                disableRowSelectionOnClick={this.handleDisableChange}
                selectionModel={this.state.selectionModel}
                onRowSelectionModelChange={this.handleSelectionChange}
                   onRowClick={this.handleRowClick}
              />
            )}

            {this.state.activeTab === "ATT" && <p>Showing open tickets</p>}
            {this.state.activeTab === "UA" && <p>Showing closed tickets</p>}
          </div>
          {/* <div>
          <ZActionToolbar actions={actions} />
        </div> */}
          <ZBox sx={{ width: "100%" }}>
            {/* Selection Toolbar */}
            {/* {console.log(selectionModel.length, "selectionTab")} */}
            {selectionModel.length > 0 && (
              <div className="flex justify-between items-center bg-[#E3F2FD] px-4 py-2 rounded mb-2">
                <ZTypography
                  labelText={`${this.state.selectionModel.length} of ${ticketRows.length} row(s) selected`}
                  flag={Labels.smallText}
                  color={CommonColors.textPrimary}
                />
                <ZButton
                  label="Clear selection"
                  size="small"
                  variant="text"
                  onClick={this.handleClearSelection}
                />
              </div>
            )}
          </ZBox>
          {/* <div className="mt-4">
            {this.state.activeTab === "ATM" && (
              <ZTable
                headerLabel="Tickets"
                columns={ticketColumns}
                rows={ticketRows}
                showCheckbox={true}
                showAdd={false}
                sizeType="small"
                checkboxSelection
                disableRowSelectionOnClick={this.handleDisableChange}
                selectionModel={this.state.selectionModel}
                onRowSelectionModelChange={this.handleSelectionChange}
              />
            )}

            {this.state.activeTab === "ATT" && <p>Showing open tickets</p>}
            {this.state.activeTab === "UA" && <p>Showing closed tickets</p>}
          </div> */}
        </div>
        
      </>
    );
  }
}

export default AppNavigation(TicketDashboard);
