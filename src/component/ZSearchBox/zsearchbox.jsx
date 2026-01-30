// import React from "react";
// import { Box, InputBase } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { withStyles } from "@mui/styles";

// // ✅ Define styles using withStyles
// const styles = {
//   root: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: "6px 12px",
//     borderRadius: "999px",
//     width: "280px",
//     color: "#000",
//     border: "1px solid #ccc", // outline
//     transition: "border-color 0.2s",
//     "&:hover": {
//       borderColor: "#888",
//     },
//     "&:focus-within": {
//       borderColor: "#1976d2",
//       boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
//     },
//   },
//   icon: {
//     marginRight: "8px",
//     display: "flex",
//     alignItems: "center",
//     color: "#555",
//   },
//   input: {
//     color: "#000",
//     fontSize: "0.9rem",
//     width: "100%",
//     "& input::placeholder": {
//       color: "#999",
//       opacity: 1,
//     },
//   },
// };

// // ✅ Functional component with styles injected
// const ZSearchBox = ({ value, onChange, classes }) => {
//   return (
//     <Box className={classes.root}>
//       <Box className={classes.icon}>
//         <SearchIcon />
//       </Box>
//       <InputBase
//         placeholder="Search…"
//         value={value}
//         onChange={onChange}
//         fullWidth
//         classes={{ input: classes.input }}
//       />
//     </Box>
//   );
// };

// // ✅ Export with withStyles
// export default withStyles(styles)(ZSearchBox);
import React from "react";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

// ✅ Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "6px 12px",
    borderRadius: "999px",
    width: "280px",
    color: "#000",
    border: "1px solid #ccc",
    transition: "border-color 0.2s",
    "&:hover": {
        borderColor: "#888",
    },
    "&:focus-within": {
        borderColor: "#1976d2",
        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
}));

const IconWrapper = styled(Box)({
    marginRight: "8px",
    display: "flex",
    alignItems: "center",
    color: "#555",
});

const StyledInput = styled(InputBase)(({ theme }) => ({
    color: "#000",
    fontSize: "0.9rem",
    width: "100%",
    "& input::placeholder": {
        color: "#999",
        opacity: 1,
    },
}));

const ZSearchBox = ({ value, onChange ,width }) => {
    return (
        <SearchContainer sx={{width:width||250,height:35}}>
            <IconWrapper>
                <SearchIcon />
            </IconWrapper>
            <StyledInput placeholder="Search…" value={value} onChange={onChange} fullWidth />
        </SearchContainer>
    );
};

export default ZSearchBox;
