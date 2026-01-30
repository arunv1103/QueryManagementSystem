import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";

export default function ZDropdown({
  label = "",
  value = "",
  onChange,
  options = [],
  name,
  disabled,
  error,
  helperText,
  multiple = false,
  width,
  mt = 0.4,
  maxHeight,
}) {
  const labelId = `label-${name}`;

  const baseSx = {
    width: width || Labels.fullWidth,
    mt,

    "& .MuiInputLabel-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.label,
      color: "#9e9e9e", 
      padding: "0 4px",

      "&.Mui-focused": {
        color: "#62BCD8",
      },
      "&.Mui-error": {
        color: "#d32f2f", 
      },
      "&.Mui-disabled": {
        color: "#bdbdbd",
      },
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      color: "#62BCD8",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(8px, -10px) scale(0.85)",
      fontWeight: 600,
      backgroundColor: "white",
      lineHeight: 1.2,
    },

    "& .MuiInputLabel-shrink.Mui-focused": {
      color: "#62BCD8", // focused shrink
    },
    "& .MuiInputLabel-shrink.Mui-error": {
      color: "#d32f2f",
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: Labels.borderRadious.sm,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(6px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.input,
      color: "#424242",
      maxHeight: multiple ? "auto" : "48px",
      minHeight: "48px",

      "& .MuiSelect-select": {
        display: "flex",
        alignItems: multiple ? "flex-start" : "center",
        flexWrap: multiple ? "wrap" : "nowrap",
        gap: multiple ? "4px" : 0,
        padding: multiple ? "8px 14px" : "14px",
        minHeight: multiple ? "20px" : "auto",
      },

      "& fieldset": {
        borderColor: "#62BCD8",
      },
      "&:hover fieldset": {
        borderColor: "#62BCD8",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#62BCD8",
        boxShadow: "0 0 0 3px rgba(98, 188, 216, 0.25)",
      },
      "&.Mui-error fieldset": {
        borderColor: "#d32f2f",
      },
    },

    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: 0,
      transition: "max-width 0.2s ease-in-out",

    },
    "& .MuiInputLabel-shrink ~ .MuiOutlinedInput-root legend": {
      maxWidth: "100%",
      color: "#62BCD8",
    },

    "& .MuiFormHelperText-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.error,
      color: CommonColors.textError,
    },

    "& .MuiChip-root": {
      height: "24px",
      fontSize: "12px",
      fontFamily: FontFamily.bold,
      backgroundColor: "#62BCD8",
      color: "white",
      "& .MuiChip-deleteIcon": {
        color: "rgba(255, 255, 255, 0.7)",
        "&:hover": {
          color: "white",
        },
      },
    },
  };

  const renderValue = (selected) => {
    if (!multiple) {
      const selectedOption = options.find(
        (option) => (option?.value ?? option) === selected
      );
      return selectedOption
        ? typeof selectedOption === "object"
          ? selectedOption.label
          : selectedOption
        : "";
    }

    if (!Array.isArray(selected) || selected.length === 0) {
      return "";
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {selected.map((value) => {
          const option = options.find(
            (opt) => (opt?.value ?? opt) === value
          );
          const label = option
            ? typeof option === "object"
              ? option.label
              : option
            : value;

          return (
            <Chip
              key={value}
              label={label}
              size="small"
              onMouseDown={(e) => e.stopPropagation()} 
              onDelete={(e) => {
                e.stopPropagation();
                const newValue = selected.filter((item) => item !== value);
                onChange({
                  target: {
                    name,
                    value: newValue,
                  },
                });
              }}
            />
          );
        })}
      </Box>
    );
  };


  return (
    <FormControl
      disabled={disabled}
      variant="outlined"
      error={Boolean(helperText)}
      sx={baseSx}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={`select-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        multiple={multiple}
        label={label}
        input={<OutlinedInput notched label={label} />}
        displayEmpty
        renderValue={multiple ? renderValue : undefined}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 200,
            },
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option?.value ?? option}>
            {typeof option === "object" ? option.label : option}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>
        {helperText == undefined ? " " : helperText == "" ? " " : helperText}
      </FormHelperText>
    </FormControl>
  );
}