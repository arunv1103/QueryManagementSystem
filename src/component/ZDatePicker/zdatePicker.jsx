import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputAdornment } from "@mui/material";
import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";

export default function ZDatePicker({
  label = "",
  value = null,
  onChange,
  placeholder = "",
  helperText = "",
  error = false,
  size = Labels.small,
  variant = Labels.variant?.outlined ?? Labels.variant.outlined,
  color = "#62BCD8", 
  font = FontFamily.bold,
  sx = {},
  width,
  name,
  startIcon,
  mt,
  views,
  minDate,
  maxDate,
  disableFuture = false,
  disablePast = false,
}
) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={minDate}
      maxDate={maxDate}
      views={views}
      slotProps={{
        textField: {
          name,
          label,
          placeholder,
          size,
          variant,
          error,
          helperText,
          fullWidth: true,
          InputProps: {
            startAdornment: startIcon ? (
              <InputAdornment position={Labels.start}>
                {startIcon}
              </InputAdornment>
            ) : undefined,
          },
          sx: {
            width: width ?? Labels.textFieldWitdh?.medium ?? Labels.num_300,
            borderRadius: Labels.borderRadious?.md ?? Labels.num_10,

            "& .MuiOutlinedInput-root": {
              borderRadius: Labels.borderRadious?.sm ?? Labels.num_8,
              backgroundColor: CommonColors.bg_white,
              backdropFilter: Labels.blur.blur4px,
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",

              "& fieldset": {
                borderColor: CommonColors.lightGrey,
              },

              "&:hover fieldset": {
                borderColor: color,
                backgroundColor: "#e9f8fd",
              },
              "&.Mui-focused fieldset": {
                borderColor: color,
                boxShadow: `0 0 0 3px ${color}55`,
              },
            },

            "& input": {
              fontFamily: font,
              color: Labels.textField?.fontColor ?? CommonColors.darkGrey,
            },

            "& label": {
              fontFamily: font,
              color: Labels.textField?.labelColor ?? CommonColors.grey,
              fontSize: FontSize.textField?.label ?? Labels.rem.rem_point875,
              transition: Labels.transition,
            },
            "& label.Mui-focused": {
              color: color,
            },

            "& .MuiFormHelperText-root": {
              fontFamily: font,
              color: error ? CommonColors.red : CommonColors.grey,
              fontSize: FontSize.textField?.error ?? Labels.rem.rem_point75,
              mt: mt ?? 0.5,
            },

            ...sx,
          },
        },
      }}
    />
  );
}
      