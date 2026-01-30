// import React from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// const ZSummaryCard = ({ icon: Icon, label, value, color }) => {
//   return (
//     <Card
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         padding: 1,
//         borderRadius: 3,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//         minWidth: 180,
//         backgroundColor: color?.bg || "#fff",
//       }}
//     >
//       {/* Icon */}
//       <Box
//         sx={{
//           backgroundColor: color?.iconBg || "#e0e0e0",
//           borderRadius: "50%",
//           padding: 1,
//           marginRight: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Icon sx={{ fontSize: 28, color: color?.icon || "#000" }} />
//       </Box>

//       {/* Text */}
//       <CardContent sx={{ padding: "0 !important" }}>
//         <Typography variant="subtitle2" color="text.secondary">
//           {label}
//         </Typography>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           {value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default ZSummaryCard;

import React from "react";

const ZSummaryCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div
      className="flex items-center rounded-full px-6 py-4 shadow-sm w-full"
      style={{
        backgroundColor: color?.bg || "#fff",
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full mr-3"
        style={{
          backgroundColor: color?.iconBg || "#e0e0e0",
        }}
      >
        <Icon style={{ fontSize: 20, color: color?.icon || "#000" }} />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default ZSummaryCard;
