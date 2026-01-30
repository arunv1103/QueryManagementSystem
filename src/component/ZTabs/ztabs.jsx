import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const ZTabs = ({
  tabs = [],
  value,
  onChange,
  variant = "scrollable",
  indicatorColor = "primary",
  textColor = "primary",
  position = "left", // 'left' | 'right'
}) => {
  return (
    <div
      className={`border-b border-gray-300 flex ${
        position === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <Box>
        <Tabs
          value={value}
          onChange={(e, newValue) => onChange(newValue)}
          variant={variant}
          indicatorColor={indicatorColor}
          textColor={textColor}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default ZTabs;
