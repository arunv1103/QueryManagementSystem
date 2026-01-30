import React from 'react';
import { Stack } from '@mui/material';


const ZStack = ({
  children,
  direction = 'column',
  spacing = 2,
  justifyContent,
  alignItems,
  style,
  stackProps = {}
}) => {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
      style={style}
      {...stackProps}
    >
      {children}
    </Stack>
  );
};

export default ZStack;
