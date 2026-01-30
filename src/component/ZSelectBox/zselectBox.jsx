import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit, CheckCircle } from '@mui/icons-material';

const ZSelectBox = ({
  label = 'No Value',
  onSelect,
  defaultSelected = false,
  isEditing = false,
  width = 150,
  height = 80,
  handleEditGroup,
  disabled = false,
  variant = 'standard' 
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    onSelect?.(e);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    handleEditGroup?.(e);
  };

  const getVariantStyles = () => {
    const baseStyles = {
      standard: {
        borderRadius: '12px',
        padding: '16px 12px',
      },
      compact: {
        borderRadius: '8px',
        padding: '12px 8px',
      },
      elevated: {
        borderRadius: '16px',
        padding: '20px 16px',
      }
    };
    return baseStyles[variant] || baseStyles.standard;
  };

  const variantStyles = getVariantStyles();

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...variantStyles,
        
        // Background & Border
        bgcolor: defaultSelected 
          ? 'rgba(128, 216, 255, 0.08)' 
          : disabled 
            ? '#fafafa' 
            : '#ffffff',
        border: defaultSelected 
          ? '2px solid #80d8ff' 
          : disabled 
            ? '1px solid #e0e0e0'
            : '1px solid #e1e5e9',
            
        boxShadow: defaultSelected
          ? '0 4px 20px rgba(128, 216, 255, 0.15), 0 1px 3px rgba(128, 216, 255, 0.2)'
          : disabled
            ? '0 1px 3px rgba(0, 0, 0, 0.05)'
            : '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
            
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Hover & Focus states
        '&:hover': disabled ? {} : {
          transform: 'translateY(-1px)',
          boxShadow: defaultSelected
            ? '0 6px 25px rgba(128, 216, 255, 0.2), 0 2px 8px rgba(128, 216, 255, 0.25)'
            : '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.15)',
          bgcolor: defaultSelected 
            ? 'rgba(128, 216, 255, 0.12)' 
            : '#f8f9fa',
          borderColor: defaultSelected ? '#80d8ff' : '#c4c7cc',
        },
        
        '&:active': disabled ? {} : {
          transform: 'translateY(0px)',
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        
        // Focus outline for accessibility
        '&:focus-visible': {
          outline: '2px solid #80d8ff',
          outlineOffset: '2px',
        },
        
        // Disabled state
        opacity: disabled ? 0.6 : 1,
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={defaultSelected}
      aria-disabled={disabled}
    >
      {/* Selection indicator */}
      {defaultSelected && (
        <CheckCircle
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: 16,
            color: '#80d8ff',
            filter: 'drop-shadow(0 1px 2px rgba(128, 216, 255, 0.3))',
          }}
        />
      )}
      
      {/* Main content */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: defaultSelected ? 600 : 600,
          color: defaultSelected 
            ? '#80d8ff' 
            : disabled 
              ? '#9e9e9e'
              : '#2c3e50',
          textAlign: 'center',
          lineHeight: 1.4,
          fontSize: '0.875rem',
          fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </Typography>

      {/* Edit button */}
      {isEditing && !disabled && (
        <Tooltip 
          title="Edit" 
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#80d8ff',
                fontSize: '0.75rem',
                fontWeight: 500,
              }
            }
          }}
        >
          <IconButton
            size="small"
            onClick={handleEditClick}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 28,
              height: 28,
              bgcolor: '#ffffff',
              border: '1px solid #e1e5e9',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 2,
              
              '&:hover': {
                bgcolor: '#f5f5f5',
                borderColor: '#80d8ff',
                transform: 'scale(1.05)',
                boxShadow: '0 3px 8px rgba(128, 216, 255, 0.2)',
                
                '& .MuiSvgIcon-root': {
                  color: '#80d8ff',
                }
              },
              
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
            aria-label="Edit selection"
          >
            <Edit sx={{ 
              fontSize: 14,
              color: '#6b7280',
              transition: 'color 0.2s ease'
            }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ZSelectBox;