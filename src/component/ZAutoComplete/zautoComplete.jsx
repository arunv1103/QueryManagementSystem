import React from "react";
import { Autocomplete, TextField, InputAdornment, Chip } from "@mui/material";
import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";

const ZAutoComplete = ({
  options = [],
  value = null,
  onChange,
  getOptionLabel = (option) => option.label || option,
  label = "",
  placeholder = "",
  helperText = "",
  error = false,
  size = "small",
  color = "#97D4E7",
  font = FontFamily.bold,
  variant,
  startIcon,
  sx = {},
  width,
  name,
  multiple = false,
}) => {
  return (
    <Autocomplete
      multiple={multiple}
      disablePortal
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) =>
        getOptionLabel(option) === getOptionLabel(val)
      }
      size={size}
      sx={{
        width: width ?? Labels.textFieldWitdh.medium,
        ...sx,
        "& .MuiOutlinedInput-root": {
          borderRadius: Labels.borderRadious.sm,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "& fieldset": {
            borderColor: color,
          },
          "&:hover fieldset": {
            borderColor: "#62BCD8",
            backgroundColor: "#e9f8fd",
          },
          "&.Mui-focused fieldset": {
            borderColor: color,
            boxShadow: `0 0 0 3px ${color}55`,
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          variant={variant ?? Labels.variant.outlined}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : (
              params.InputProps.startAdornment
            ),
          }}
          inputProps={{
            ...params.inputProps,
            placeholder: placeholder,
          }}
          sx={{
            "& input": {
              fontFamily: font,
              color: Labels.textField.fontColor,
            },
            "& label": {
              fontFamily: font,
              color: Labels.textField.labelColor,
              fontSize: FontSize.textField.label,
            },
            "& label.Mui-focused": {
              color: color,
            },
            "& .MuiFormHelperText-root": {
              fontFamily: font,
              color: error ? CommonColors.red : CommonColors.grey,
              fontSize: FontSize.textField.error,
              mt: Labels.num_point5,
            },
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        multiple &&
        tagValue.map((option, index) => (
          <Chip
            key={index}
            variant={Labels.variant.outlined}
            size={Labels.small}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default ZAutoComplete;
