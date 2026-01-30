// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import TicketIcon from "../../utils/assets/images/TicketIcon.png";
// import { AppNavigation } from "../../navigations/appNavigation";

// const TicketView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const ticketData = location.state || {
//     // Default values if no state is passed
//     ticketNo: "#24",
//     subject: "Server issues while hit the apis, not working",
//     status: "Assigned",
//     lastUpdated: "05 August 25 at 10:25",
//     raisedBy: "Thangaraja S",
//     priority: "High",
//     assignedTo: "Vakulandurai A",
//     openSince: "3 days",
//     description: "I am not able to continue my works"
//   };

//   // Format the priority badge color
//   const getPriorityBadge = (priority) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-100 text-red-700";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-700";
//       case "Low":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // Format the status badge color
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Assigned":
//         return "bg-blue-100 text-blue-700";
//       case "Closed":
//         return "bg-gray-100 text-gray-700";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Open":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 p-6">
//       {/* Left Section */}
//       <div className="flex-1 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-semibold text-gray-700 flex items-center">
//             <img src={TicketIcon} alt="Ticket" className="w-5 h-5 mr-2" />
//             Ticket Preview
//           </h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center bg-sky-500 text-white px-4 py-1.5 rounded-md shadow hover:bg-sky-600"
//           >
//             Back
//           </button>
//         </div>

//         {/* Actions Section */}
//         <div className="bg-white rounded-lg shadow p-4 grid grid-cols-5 gap-4">
//           <div>
//             <p className="text-gray-500 text-sm">Action</p>
//             <p className="font-medium">Reply</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Assigned To</p>
//             <p className="font-medium">{ticketData.assignedTo}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Category</p>
//             <p className="font-medium">Development</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Priority</p>
//             <span className={`${getPriorityBadge(ticketData.priority)} text-xs font-semibold px-3 py-1 rounded-full`}>
//               {ticketData.priority}
//             </span>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Status</p>
//             <span className={`${getStatusBadge(ticketData.status)} text-xs font-semibold px-3 py-1 rounded-full`}>
//               {ticketData.status}
//             </span>
//           </div>
//         </div>

//         {/* Ticket Info */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-gray-800">
//               {ticketData.ticketNo} {ticketData.subject}
//               <span className="ml-2 bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">via web</span>
//             </h2>
//             <span className={`${getStatusBadge(ticketData.status)} text-xs px-3 py-1 rounded-full`}>
//               {ticketData.status}
//             </span>
//           </div>

//           <div className="grid grid-cols-4 gap-4 text-sm">
//             <div>
//               <p className="text-gray-500">Date</p>
//               <p>{ticketData.lastUpdated.split(' at ')[0]}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Last Updated</p>
//               <p>{ticketData.lastUpdated}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Raised By</p>
//               <p>{ticketData.raisedBy}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Status</p>
//               <p className="text-red-600">Due in {ticketData.openSince}</p>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
//           <p className="text-gray-600">{ticketData.description || "No description provided"}</p>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="w-64 bg-white rounded-lg shadow p-4 ml-6">
//         <h3 className="font-semibold text-gray-700 mb-4">Additional Info</h3>
//         <div className="mb-4">
//           <p className="text-gray-500 text-sm">Attachments</p>
//           <p className="text-gray-600">No attachments added yet</p>
//         </div>
//         <div>
//           <p className="text-gray-500 text-sm">Notes</p>
//           <p className="text-gray-600">No notes added yet</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppNavigation(TicketView);