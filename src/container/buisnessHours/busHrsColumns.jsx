import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Labels } from "../../utils/constants/labels"; // adjust as needed
import { CommonColors } from "../../utils/constants/colors";

export const getBusHrsColumns = (handleEdit, handleDelete) => [
  {
    headerName: Labels.buisnessHours,
    renderCell: ({ row }) => (
      <Tooltip title={Labels.edit} onClick={() => handleEdit(row)}>
        <span
          style={{
            color: row.IsActive ? CommonColors.zTable.blue : CommonColors.zTable.inherit,
            textDecoration: row.IsActive ? Labels.underline : Labels.none,
            cursor: row.IsActive ? Labels.cursor.pointer : Labels.not_allowed,
            pointerEvents: row.IsActive ? Labels.auto : Labels.none,
          }}
        >
          {row.BusinessHoursName}
        </span>
      </Tooltip>
    )
  },
  
{
    headerName: Labels.timeZone,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ?CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.TimeZoneName}
        </span>
      ),
  },
{
    headerName: Labels.weekStarts,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ?CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.FirstWeekDay}
        </span>
      ),
  },
{
    headerName: Labels.weekList.first,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.FirstWeekOff_Days}
        </span>
      ),
  },
{
    headerName: Labels.weekList.second,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.SecondWeekOff_Days}
        </span>
      ),
  },
{
    headerName: Labels.weekList.third,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ?CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.ThirdWeekOff_Days}
        </span>
      ),
  },
{
    headerName: Labels.weekList.fourth,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ?CommonColors.zTable.gray : CommonColors.zTable.inherit}}>
          {row.FourthWeekOff_Days}
        </span>
      ),
  },
{
    headerName: Labels.weekList.fifth,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit}}>
          {row.FifthWeekOff_Days}
        </span>
      ),
  },
{
    headerName: Labels.holidayList,
      renderCell: ({ row }) => (
        <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
          {row.HolidayListName}
        </span>
      ),
  },
{
    headerName: Labels.active,
      renderCell: ({ row }) => (
        <Tooltip title={row.IsActive ? Labels.clickToDeActivate : Labels.clickToActivate}>
          <IconButton onClick={() => handleDelete(row)} color={row.IsActive ? Labels.success : Labels.error}>
            {row.IsActive ? (
              <DeleteIcon sx={{ fontSize: 20 }} color={Labels.error} />
            ) : (
              <EditIcon sx={{ fontSize: 20 }} color={Labels.disabled} />
            )}
          </IconButton>
        </Tooltip>
      ),
  },
];
