import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { CommonColors } from "../../utils/constants/colors";
import { Labels } from "../../utils/constants/labels";

export default function RadioButton({
  label,
  name,
  value,
  onChange,
  options,
  row = false, // horizontal layout
  size = Labels.medium,
  color = CommonColors.primary,
}) {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}

      <RadioGroup name={name} value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size={size} color={color} />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
