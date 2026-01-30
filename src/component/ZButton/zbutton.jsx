import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { FontFamily } from "../../utils/constants/fonts";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { CircularProgress } from "@mui/material";

export default function ZButton({
  label,
  onClick,
  loading = false,
  width,
  children,
  color = "primary",
  font = FontFamily.medium,
  size = "medium",
  variant = "contained",
  disabled = false,
  startIcon = null,
  loaderSize,
  endIcon = null,
  disableRipple = false,
  fullWidth = false,
  gradient = false,
  type = "button",
  rounded = "md",
  shadow = true,
  sx = {},
}) {
  const theme = useTheme();

  const gradientBackground =
    CommonColors.gradientBackgrounds?.[color] || "linear-gradient(to right, #4e54c8, #8f94fb)";
  const solidColor = theme.palette[color]?.main || CommonColors.primary;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "20px",
    xl: "30px",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disableRipple={disableRipple}
      variant={variant}
      size={size}
      endIcon={endIcon}
      disabled={disabled}
      fullWidth={fullWidth}

      sx={{
        cursor: "pointer",
        textTransform: "none",
        fontFamily: font,
        fontWeight: 600,
        fontSize: size === "small" ? "0.8rem" : size === "large" ? "1rem" : "0.9rem",
        borderRadius: radiusMap[rounded],
        color:
          variant === "contained" || gradient
            ? theme.palette.common.white
            : "#23A9F2",
        background: gradient
          ? gradientBackground
          : variant === "contained"
            ? "#23A9F2"
            : "transparent",
        borderColor: variant === "outlined" ? "#23A9F2" : "transparent",
        boxShadow: shadow && variant === "contained" ? "0px 4px 12px rgba(0, 0, 0, 0.15)" : "none",
        transition: "all 0.3s ease",
        "&:disabled": {
          background: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
          boxShadow: "none",
          cursor: "not-allowed",
        },
        ...sx,
      }}
    >
      {loading ? <CircularProgress size={loaderSize || 26} color="inherit" /> : (label || children)}
    </Button>
  );
}

