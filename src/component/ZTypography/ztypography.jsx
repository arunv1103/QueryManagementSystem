import { CommonColors } from "../../utils/constants/colors";
import { FontFamily } from "../../utils/constants/fonts";
import { Labels } from "../../utils/constants/labels";
import Typography from "@mui/material/Typography";
import React from "react";

export default function ZTypography({
  flag,
  labelText = "",
  weight,
  color = CommonColors.textPrimary,
  font = "",
  marginBottom,
  onClick, 
  underline = false, 
}) {
  return (
    <Typography
      onClick={onClick}
      className={`${color === CommonColors.textPrimary ? Labels.darktext : ""}`}
      sx={{
        fontSize:
          flag === Labels.mainHeader
            ? Labels.xxl
            : flag === Labels.header
            ? Labels.xl
            : flag === Labels.subHeader
            ? Labels.lg
            : flag === Labels.errorLbl
            ? Labels.xs
            : flag === Labels.smallText
            ? Labels.xxs
            : flag === Labels.veryVerySmallText
            ? Labels.xxxxs
            : flag === "big"
            ? Labels.xxxl
            : Labels.sm,
        fontFamily:
          font === Labels.bold
            ? FontFamily.bold
            : font === Labels.semiBold
            ? FontFamily.semiBold
            : font === Labels.medium
            ? FontFamily.medium
            : FontFamily.regular,
        fontWeight:
          weight === Labels.bold
            ? Labels.num_sevenHundered
            : font === Labels.semiBold
            ? Labels.num_sixHundred
            : font === Labels.medium
            ? Labels.num_fiveHundred
            : Labels.num_fourHundred,
        color: color,
        mb: marginBottom,
        cursor: onClick ? "pointer" : "default",
        textDecoration: underline ? "underline" : "none", 
      }}
    >
      {labelText}
    </Typography>
  );
}
