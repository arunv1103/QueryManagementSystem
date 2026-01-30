import React from 'react';
import { Popover, Paper } from '@mui/material';

const ZPopoverDialog = ({ open, position, onClose, children }) => {
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
      PaperProps={{
        component: Paper,
        sx: {
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
          minWidth: 300,
          maxWidth: '90vw',
        },
      }}
    >
      {children}
    </Popover>
  );
};

export default ZPopoverDialog;
