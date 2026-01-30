import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Box,
} from "@mui/material";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
const ZCheckBox = ({
  label = "",
  name = "",
  checked = false,
  onChange = () => {},
  disabled,
  error = false,
  helperText = "",
  labelColor = "#9e9e9e", // match label default color
  labelSize = FontSize.textField.label,
  sx = {},
}) => {
  const checkboxWrapperStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      borderColor: "#62BCD8",
    },
  };
  return (
    <FormControl
      component="fieldset"
      error={error}
      sx={{  ...sx }}
    >
      <Box sx={checkboxWrapperStyle}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={disabled === undefined ? false : disabled}
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              name={name}
              sx={{
                color: labelColor,
                "&.Mui-checked": {
                  color: "#62BCD8", 
                },
              }}
            />
          }
          label={label}
          sx={{
            ".MuiFormControlLabel-label": {
              fontSize: labelSize,
              fontFamily: FontFamily.bold,
              color: error ? "#d32f2f" : "#616161",
            },
          }}
        />
      </Box>
      {error && helperText && (
        <FormHelperText sx={{ fontFamily: FontFamily.regular }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default ZCheckBox;
