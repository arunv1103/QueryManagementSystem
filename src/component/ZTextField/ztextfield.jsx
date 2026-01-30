import React, { useEffect, useState } from "react";
import {
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";

export default function ZTextField({
  inputRef,
  flag,
  label = "",
  value = "",
  onChange,
  onKeyPress,
  autoFocus = false,
  eyeIcon,
  onKeyUp,
  disabled = false,
  name = "",
  helperText = "",
  type = "text",
  multiline = false,
  rows = 1,
  color = "#1976d2",
  font = FontFamily.bold,
  sx = {},
  variant = "outlined",
  inputProps = {},
  startIcon,
  width,
  maxLength,
  multiple = false,
  defaultFileUrl = "",
  onBlur
}) {
  const isFileInput = type === "file";
  const isPasswordField = flag === "password";
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const internalRef = React.useRef(null);
  const textFieldRef = inputRef || internalRef;

  
  useEffect(() => {
    if (defaultFileUrl || value) {
      const url = defaultFileUrl || value;
      const name = url.split("/").pop() || "file.png";
      setSelectedFiles([{ name, url }]);
    } else {
      setSelectedFiles([]);
    }
  }, [defaultFileUrl, value]);

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const fileWithPreview = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles(fileWithPreview);
    onChange?.(e);
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    const fakeEvent = {
      target: {
        name,
        files: [],
      },
    };
    onChange?.(fakeEvent);
  };

  const baseSx = {
    width: width || Labels.fullWidth,
    mt: 0.4,
    ...(variant === "outlined" && {
      "& .MuiOutlinedInput-root": {
        alignItems: "center",
        borderRadius: Labels.borderRadious.sm,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "& fieldset": {
          borderColor: helperText ? "#d32f2f" : "#62BCD8",
        },
        "&:hover fieldset": {
          borderColor: helperText ? "#d32f2f" : "#62BCD8",
        },
        "&.Mui-focused fieldset": {
          borderColor: helperText ? "#d32f2f" : "#62BCD8",
          boxShadow: helperText
            ? "0 0 0 3px rgba(211, 47, 47, 0.25)"
            : "0 0 0 3px rgba(98, 188, 216, 0.25)",
        },
      },
    }),
    "& .MuiInputBase-root": {
      fontFamily: font,
      color: "#424242",
    },
    "& .MuiInputBase-input": {
      padding: multiline ? "0px" : "14px",
      fontFamily: font,
      fontSize: FontSize.textField.input,
      color: "#616161",
      lineHeight: 1.5,
    },
    "& .MuiInputLabel-root": {
      fontFamily: font,
      fontSize: FontSize.textField.label,
      color: "#9e9e9e",
      transform: "translate(14px, 14px) scale(1)",
      transformOrigin: "top left",
      transition: "all 0.2s ease-in-out",
      pointerEvents: "none",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#62BCD8",
    },
    "& .MuiFormHelperText-root": {
      fontFamily: font,
      fontSize: FontSize.textField.error,
      color: "#d50000",
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "#d32f2f",
    },
    "& .MuiOutlinedInput-root legend": {
      maxWidth: 0.0,
      transition: "max-width 0.2s ease-in-out",
    },
    "& .MuiInputLabel-shrink ~ .MuiOutlinedInput-root legend": {
      maxWidth: "100%",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, -10px) scale(0.85)",
      color: "#80d8ff",
      fontWeight: 600,
      backgroundColor: "white",
      lineHeight: 1.5,
    },
    "& input::placeholder": {
      color: "#9e9e9e",
      opacity: 1,
    },
    ...sx,
  };

  if (isFileInput) {
    return (
      <>
        <TextField
          name={name}
          label={label}
          variant={variant}
          error={!!helperText}
          disabled={disabled}
          onBlur={onBlur}
          inputRef={textFieldRef}
          placeholder="ChooseFile"
          helperText={helperText || " "}
          // InputLabelProps={{ shrink: true }}
          sx={baseSx}
          inputProps={{ readOnly: true }}
          value={
            selectedFiles.length > 0
              ? selectedFiles
                .map((f) => (f.name.length > 30 ? `${f.name.slice(0, 30)}...` : f.name))
                .join(", ")
              : ""
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <UploadFileIcon sx={{ color: disabled ? "#6B7280" : "#62BCD8", mr: -2.2 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {selectedFiles.length > 0 && (
                  <Tooltip title="Clear">
                    <IconButton size="small" onClick={handleClearFiles} sx={{ mr: -1 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <input
                  disabled={disabled}
                  hidden
                  type="file"
                  name={name}
                  multiple={multiple}
                  onChange={handleFileChange}
                  id={`upload-${name}`}
                />
                <label htmlFor={`upload-${name}`}>
                  <Tooltip title="Upload">
                    <IconButton component="span" sx={{ ml: 1 }}>
                      <InsertDriveFileIcon />
                    </IconButton>
                  </Tooltip>
                </label>
              </>
            ),
          }}
        />
      </>
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
      autoFocus={autoFocus}
      type={
        isPasswordField && !showPassword
          ? "password"
          : type
      }
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      helperText={helperText || " "}
      error={!!helperText}
      variant={variant}
      sx={baseSx}
      inputProps={{ ...inputProps, maxLength }}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: isPasswordField && (
          <InputAdornment sx={{ pr: 0.5 }} position="end">
            <IconButton onClick={handleToggleVisibility} edge="end">
              {showPassword ? <VisibilityOff sx={{ fontSize: eyeIcon || 23, }} /> : <Visibility sx={{ fontSize: eyeIcon || 23 }} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
