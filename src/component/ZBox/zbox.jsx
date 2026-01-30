import React from "react";
import { Box } from "@mui/material";
import { Labels } from "../../utils/constants/labels";

const ZBox = ({
  children,
  style,
  sx,
  component = Labels.div,
  boxProps = {},
}) => {
  return (
    <Box component={component} style={style} sx={sx} {...boxProps}>
      {children}
    </Box>
  );
};

export default ZBox;
