import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./zcard.css";
export default function ZCard({ title, onBackClick, children, className = "" }) {
  return (
    <div className={`zcard-container ${className}`}>
      {title && (
        <div className="zcard-header">
          <div className="zcard-side" />
          <h2 className="zcard-title">{title}</h2>
          {onBackClick ? (
            <div className="zcard-side zcard-back-button-wrapper">
              <IconButton onClick={onBackClick} className="zcard-back-button">
                <ArrowBackIcon />
              </IconButton>
            </div>
          ) : (
            <div className="zcard-side" />
          )}
        </div>
      )}
      <div className="zcard-content">{children}</div>
    </div>
  );
}