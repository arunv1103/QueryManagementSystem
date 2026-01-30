// import React from "react";
// import { Box, Button, Menu, MenuItem } from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// const ZActionToolbar = ({ actions = [] }) => {
//   const [anchorEls, setAnchorEls] = React.useState({});

//   const handleClick = (event, index) => {
//     setAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
//   };

//   const handleClose = (index) => {
//     setAnchorEls((prev) => ({ ...prev, [index]: null }));
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 1,
//         backgroundColor: "#f5f9fc",
//         padding: "8px 12px",
//         borderRadius: "8px",
//       }}
//     >
//       {actions.map((action, index) => (
//         <React.Fragment key={index}>
//           <Button
//             variant="text"
//             endIcon={<ArrowDropDownIcon />}
//             onClick={(e) => handleClick(e, index)}
//           >
//             {action.label}
//           </Button>
//           <Menu
//             anchorEl={anchorEls[index]}
//             open={Boolean(anchorEls[index])}
//             onClose={() => handleClose(index)}
//           >
//             {action.options.map((opt, i) => (
//               <MenuItem
//                 key={i}
//                 onClick={() => {
//                   action.onSelect(opt);
//                   handleClose(index);
//                 }}
//               >
//                 {opt}
//               </MenuItem>
//             ))}
//           </Menu>
//         </React.Fragment>
//       ))}
//     </Box>
//   );
// };

// export default ZActionToolbar;

import React from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ZActionToolbar = ({ actions = [] }) => {
  const [anchorEls, setAnchorEls] = React.useState({});

  const handleClick = (event, index) => {
    setAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleClose = (index) => {
    setAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  return (
    <div className="flex gap-2 bg-[#F0F8FF] px-2 py-1 rounded-[12px] items-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {actions.map((action, index) => (
        <React.Fragment key={index}>
          <Button
            variant="text"
            endIcon={<ArrowDropDownIcon className="!text-[18px]" />}
            onClick={(e) => handleClick(e, index)}
            className="normal-case text-[#4a4a4a] text-[14px] font-medium px-[6px] py-[4px] min-w-0 hover:bg-transparent hover:text-[#1976d2]"
          >
            {action.label}
          </Button>

          <Menu
            anchorEl={anchorEls[index]}
            open={Boolean(anchorEls[index])}
            onClose={() => handleClose(index)}
            PaperProps={{
              className: "rounded-lg min-w-[150px]",
            }}
          >
            {action.options.map((opt, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  action.onSelect(opt);
                  handleClose(index);
                }}
              >
                {opt}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ZActionToolbar;
