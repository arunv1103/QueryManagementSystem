// import React, { Component } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Tooltip,
//   IconButton,
//   Chip,
// } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { DateRange } from "react-date-range";
// import { format } from "date-fns";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

import { Component } from "react";

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selection: [
//         {
//           startDate: new Date("2025-01-16"),
//           endDate: new Date("2025-01-23"),
//           key: "selection",
//         },
//       ],
//       open: false,
//       displayValue: "",
//     };
//   }

//   handleChange = (item) => {
//     this.setState({ selection: [item.selection] });
//   };

//   handleApply = () => {
//     const { startDate, endDate } = this.state.selection[0];
//     const displayValue = `${format(startDate, "dd-MMM-yy")} - ${format(
//       endDate,
//       "dd-MMM-yy"
//     )}`;
//     this.setState({ displayValue, open: false });
//   };

//   handleCancel = () => {
//     this.setState({ open: false });
//   };

//   toggleOpen = () => {
//     this.setState((prevState) => ({ open: !prevState.open }));
//   };

//   render() {
//     const { selection, open, displayValue } = this.state;

//     const columns = [
//       {
//         field: "actions",
//         headerName: "Actions",
//         width: 120,
//         renderCell: () => (
//           <Box>
//             <IconButton size="small">
//               <NotificationsIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <DescriptionIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small">
//               <ChatBubbleOutlineIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         ),
//       },
//       { field: "date", headerName: "Date", width: 150 },
//       { field: "query", headerName: "Query", flex: 1 },
//       {
//         field: "status",
//         headerName: "Status",
//         width: 120,
//         renderCell: () => (
//           <Chip label="Assigned" color="warning" size="small" />
//         ),
//       },
//       { field: "updated", headerName: "Last Updated", width: 160 },
//     ];

//     const rows = [
//       {
//         id: 1,
//         date: "23 Jan 25 - 18:04",
//         query: "api issue in trackzo",
//         updated: "23 Jan 25 - 18:04",
//       },
//     ];

//     return (
//       <Box p={3}>
//         {/* Header Section */}
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Box display="flex" alignItems="center" gap={1}>
//             <Typography variant="h6" fontWeight="bold">
//               Dashboard
//             </Typography>
//             <Typography color="primary" sx={{ cursor: "pointer" }}>
//               + Add New
//             </Typography>
//           </Box>

//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box display="flex" gap={2} alignItems="center">
//               <div className="p-4">
//                 <div
//                   onClick={this.toggleOpen}
//                   className="border rounded-lg px-4 py-2 w-fit cursor-pointer shadow-sm bg-white"
//                 >
//                   {displayValue || "Select Date Range"}
//                 </div>

//                 {open && (
//                   <div className="relative z-10 mt-2 bg-white rounded-lg shadow-lg inline-block">
//                     <DateRange
//                       editableDateInputs={true}
//                       onChange={this.handleChange}
//                       moveRangeOnFirstSelection={false}
//                       ranges={selection}
//                       months={2}
//                       direction="horizontal"
//                       showDateDisplay={false}
//                       rangeColors={["#3b82f6"]}
//                     />
//                     <div className="flex justify-between p-3 border-t">
//                       <button
//                         onClick={this.handleCancel}
//                         className="text-blue-600 font-semibold hover:underline"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={this.handleApply}
//                         className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </Box>
//           </LocalizationProvider>

//           <Tooltip title="Delete">
//             <IconButton size="small">
//               <DeleteOutlineIcon fontSize="small" sx={{ color: "#ccc" }} />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Preview">
//             <IconButton size="small">
//               <InsertDriveFileIcon fontSize="small" sx={{ color: "#ccc" }} />
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* Data Table */}
//         <Box sx={{ height: 300, width: "100%", mt: 2 }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             disableRowSelectionOnClick
//             hideFooter
//             rowHeight={48}
//           />
//         </Box>

//         {/* Cards Section */}
//         <Grid container spacing={3} mt={2}>
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent sx={{ textAlign: "center" }}>
//                 <Typography variant="h6">Announcements</Typography>
//                 <Typography color="primary" mt={1}>
//                   Stay tuned—no announcements for now.
//                 </Typography>
//                 <Typography variant="caption">
//                   Check back later for updates!
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent sx={{ textAlign: "center" }}>
//                 <Typography variant="h6">Explore More</Typography>
//                 <Box
//                   mt={2}
//                   display="flex"
//                   justifyContent="center"
//                   gap={3}
//                   flexWrap="wrap"
//                 >
//                   <img src="/hrms.png" height="40" alt="HRMS" />
//                   <img src="/trakzo.png" height="40" alt="TrakZo" />
//                   <img src="/finnovate.png" height="40" alt="Finnovate" />
//                   <img src="/jade.png" height="40" alt="Jade" />
//                   <img src="/custom.png" height="40" alt="Custom" />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   }
// }

// export default Dashboard;

export default class Dashboard extends Component {
  render() {
    return <h1>lfjldh</h1>;
  }
}
