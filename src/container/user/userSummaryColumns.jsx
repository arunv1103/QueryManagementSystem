import React from "react";
import { Tooltip, IconButton, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Labels } from "../../utils/constants/labels";
import { maskEmail, maskMobile } from "../../utils/commonFunction/common";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { CommonColors } from "../../utils/constants/colors";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';


export const getUserSummaryColumns = (
  handleEditUsers,
  handleResetPassword,
  handleSwitchChange,
  handleDeleteClick
  ) => [
    {
      headerName: Labels.userName,
      renderCell: ({ row }) => (
        <Tooltip title={Labels.edit}>
          <span
            style={{
              color: row.IsActive ? CommonColors.zTable.blue : CommonColors.zTable.inherit,
              textDecoration: row.IsActive ? Labels.underline : Labels.none,
              cursor: row.IsActive ? Labels.cursor.pointer : Labels.not_allowed,
              pointerEvents: row.IsActive ? Labels.auto : Labels.none,
            }}
            onClick={() => row.IsActive && handleEditUsers(row)}
          >
            {`${typeof row.FirstName === 'object' ? '' : row.FirstName ?? ''} ${typeof row.LastName === 'object' ? '' : row.LastName ?? ''}`}
          </span>
        </Tooltip>
      ),
    },
    {
      headerName: Labels.email,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {maskEmail(row.Email)}
        </span>
      ),
    },
    {
      headerName: Labels.mobileNo,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ?CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {maskMobile(row.MobileNo)||"—"}
        </span>
      ),
    },
    {
      headerName: Labels.lastLogin,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit  }}>
          {row.LastLogin || "—"}
        </span>
      ),
    },
    {
      headerName: Labels.resetPassword,
      renderCell: ({ row }) => (
        <Tooltip title={Labels.reset}>
          <span
            style={{
              color: row.IsActive ? CommonColors.zTable.blue : CommonColors.zTable.inherit ,
              textDecoration: row.IsActive ? "underline" : "none",
              cursor: row.IsActive ? "pointer" : "not-allowed",
              pointerEvents: row.IsActive ? "auto" : "none",
            }}
            onClick={() => row.IsActive && handleResetPassword(row)}
          >
            Reset Password
          </span>
        </Tooltip>
      ),
    },
    {
      headerName: Labels.isAdmin,
      renderCell: ({ row }) => (
        <IconButton
          disabled={!row.IsActive}
          onClick={() => handleSwitchChange(row, true)}
          color={row.IsActive ? Labels.success : Labels.error}
        >
          {row.IsAdmin ? <SupervisorAccountIcon color={row.IsActive ? CommonColors.zTable.success : CommonColors.zTable.disabled} />
            : <NoAccountsIcon color={CommonColors.zTable.disabled} />}
        </IconButton>
      ),
    },
    {
      headerName: Labels.isAgent,
      renderCell: ({ row }) => (
        <IconButton
          disabled={!row.IsActive}
          onClick={() => handleSwitchChange(row, false)}
          color={row.IsActive ? Labels.success : Labels.error}
        >
          {row.IsAgent ? <HowToRegRoundedIcon color={row.IsActive ? CommonColors.zTable.success : CommonColors.zTable.disabled} />
            : <HowToRegRoundedIcon color={CommonColors.zTable.disabled} />}
        </IconButton>
      ),
    },
    {
      headerName: Labels.active,
      renderCell: ({ row }) => (
        <Tooltip title={row.IsActive ? Labels.clickToDeActivate : Labels.clickToActivate}>
          <IconButton

            onClick={() => handleDeleteClick(row)}
            color={row.IsActive ? Labels.success : Labels.error}
          >
            {row.IsActive ? <DeleteIcon sx={{ fontSize: 20 }} color={Labels.error} /> : <EditIcon sx={{ fontSize: 20 }} color="disabled" />}
          </IconButton>
        </Tooltip>
      ),
    },
  ];
