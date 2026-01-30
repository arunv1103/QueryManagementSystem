// import React from "react";
// import { Grid } from "@mui/material";

// const ZGrid = ({
//   children,
//   spacing = 2,
//   gridProps = {},
//   itemProps = {},
//   layout = [],
// }) => {
//   return (
//     <Grid container spacing={spacing} {...gridProps}>
//       {React.Children.map(children, (child, index) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={index} {...itemProps}>
//           {child}
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default ZGrid;

import React from "react";

const ZGrid = ({ children }) => {
  return (
    <div className="flex gap-3 flex-wrap">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[310px] h-[80px]" 
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ZGrid;
