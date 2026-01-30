import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { Labels } from "../../utils/constants/labels";

const ZToasterMsg = (props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.duration}
      onClose={props.onClose}
      anchorOrigin={props.position}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        variant={Labels.variant.filled}
        sx={{ width: Labels.percentage.per_100 }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default ZToasterMsg;
