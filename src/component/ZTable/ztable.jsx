import React, { useState } from "react";
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import ZTypography from "../ZTypography/ztypography";
import ZSearchBox from "../ZSearchBox/zsearchbox";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import AssignMethod from "../../container/AssignMethod/assignMethod";
import "../ZCard/zcard.css";
import ServiceQueue from "../../container/serviceQueue/serviceQueue";
// ✅ Style hook
const useStyles = makeStyles({
  paper: {
    backgroundColor: "#f9f9fb",
    borderRadius: "16px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.03)",
  },
  tableHeadCell: {
    fontWeight: "bold",
    color: "#555",
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    // REMOVE LEFT/RIGHT CELL BORDER
    "&:first-of-type": {
      borderLeft: "none", // ❌ No left border
    },
    "&:last-child": {
      borderRight: "none", // ❌ No right border
    },
  },
  tableBodyCell: {
    color: "#333",
    borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee",
    "&:first-of-type": {
      borderLeft: "none", // ❌ No left border
    },
    "&:last-child": {
      borderRight: "none", // ❌ No right border
    },
  },
  rowHover: {
    "&:hover": {
      backgroundColor: "#E3F2FD",
      cursor: "pointer",
    },
  },
  pagination: {
    marginTop: 16,
    display: "flex-end",
    justifyContent: "center",
    borderTop: "1px solid #eee",
  },
});
// ✅ Size styles
const sizeStyles = {
  small: {
    padding: "2px 2px 2px 10px",
    headerFontSize: "11px",
    headerFontWeight: "bold",
    cellFontWeight: "bold",
    cellFontSize: "11px",
    cellPadding: "1px 1px 1px 10px",
  },
  medium: {
    padding: 3,
    headerFontSize: "14px",
    cellFontSize: "13px",
    cellPadding: "8px 12px",
  },
  large: {
    padding: 6,
    headerFontSize: "24px",
    cellFontSize: "20px",
    cellPadding: "12px 16px",
  },
};
export default function ZTable({
  headerLabel,
  columns = [],
  rows = [],
  onHandleAdd,
  disableRowSelectionOnClick,
  onRowSelectionModelChange,
  labelText,
  showAdd = true,
  showCheckbox = false,
  sizeType,
  viewType,
  tableWidth,
  minHeight,
  onRowClick,
}) {
  const classes = useStyles();
  const styles = sizeStyles[sizeType] || sizeStyles.medium;
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]); // ✅ NEW
  const rowsPerPage = 7;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredRows = rows.filter((row) =>
    columns.some((col) =>
      String(row[col.field] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  // const handleSelectAll = (event) => {
  //   if (event.target.checked) {
  //     setSelected(rows.map((r) => r.id)); // assumes each row has a unique `id`
  //   } else {
  //     setSelected([]);
  //   }
  // };

  const handleSelectAll = (event) => {
    let newSelected;
    if (event.target.checked) {
      newSelected = rows.map((row) => row.id);
    } else {
      newSelected = [];
    }

    setSelected(newSelected);

    if (onRowSelectionModelChange) {
      onRowSelectionModelChange(newSelected);
    }
  };

  const handleSelectRow = (rowId) => {
    setSelected((prevSelected) => {
      let newSelected;
      if (prevSelected.includes(rowId)) {
        newSelected = prevSelected.filter((id) => id !== rowId);
      } else {
        newSelected = [...prevSelected, rowId];
      }

      // 🔹 Call parent callback if provided
      if (onRowSelectionModelChange) {
        onRowSelectionModelChange(newSelected);
      }

      return newSelected;
    });
  };

  // const handleSelectRow = (id) => {
  //   if (selected.includes(id)) {
  //     setSelected(selected.filter((s) => s !== id));
  //   } else {
  //     setSelected([...selected, id]);
  //   }
  // };

  if (sortField) {
    filteredRows.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // return
  // viewType === "assignMethod" ? (
  //   <Paper className={classes.paper} elevation={0} sx={{ p: styles.padding }}>
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //         mb: 2,
  //       }}
  //     >
  //       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //         <ZTypography
  //           flag={Labels.header}
  //           labelText={headerLabel}
  //           font={Labels.semiBold}
  //           weight={Labels.bold}
  //           color={CommonColors.textPrimary}
  //         />
  //         {showAdd && (
  //           <Tooltip title="Add">
  //             <Button
  //               color="primary"
  //               startIcon={<AddIcon />}
  //               onClick={onHandleAdd}
  //             >
  //               <ZTypography
  //                 color="primary"
  //                 font={Labels.semiBold}
  //                 weight={Labels.bold}
  //                 labelText="Add"
  //               />
  //             </Button>
  //           </Tooltip>
  //         )}
  //       </Box>
  //       <ZSearchBox
  //         value={search}
  //         onChange={(e) => setSearch(e.target.value)}
  //       />
  //     </Box>
  //     <TableContainer
  //       sx={{
  //         overflow: "hidden",
  //         margin: "0 auto",
  //         borderTop: "1px solid #ccc", // ✅ Keep top border
  //         borderBottom: "1px solid #ccc", // ✅ Keep bottom border
  //       }}
  //     >
  //       <Table
  //         aria-label={Labels.tablelabel}
  //         sx={{
  //           tableLayout: "fixed",
  //           width: "100%",
  //           borderCollapse: "collapse", // ✅ Ensures border lines connect
  //         }}
  //       >
  //         <TableHead>
  //           <TableRow sx={{ backgroundColor: "#fff" }}>
  //             {console.log(columns, "columns")}
  //             {columns.map((col) => (
  //               <TableCell
  //                 key={col.field}
  //                 className={classes.tableHeadCell}
  //                 sx={{
  //                   fontSize: styles.headerFontSize,
  //                   fontWeight: styles.headerFontWeight, // ✅ Apply fontWeight from sizeStyles
  //                   padding: styles.cellPadding,
  //                 }}
  //               >
  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     justifyContent: "space-between",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <span>{col.headerName}</span>
  //                   <IconButton
  //                     size="small"
  //                     onClick={() => handleSort(col.field)}
  //                   >
  //                     <Box
  //                       sx={{
  //                         display: "flex",
  //                         flexDirection: "column",
  //                         lineHeight: 1,
  //                       }}
  //                     >
  //                       <KeyboardArrowUpIcon
  //                         fontSize="small"
  //                         sx={{
  //                           color:
  //                             sortField === col.field && sortOrder === "asc"
  //                               ? "#4a90e2"
  //                               : "rgba(0,0,0,0.3)",
  //                           mb: "-4px",
  //                         }}
  //                       />
  //                       <KeyboardArrowDownIcon
  //                         fontSize="small"
  //                         sx={{
  //                           color:
  //                             sortField === col.field && sortOrder === "desc"
  //                               ? "#4a90e2"
  //                               : "rgba(0,0,0,0.3)",
  //                           mt: "-4px",
  //                         }}
  //                       />
  //                     </Box>
  //                   </IconButton>
  //                 </Box>
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {paginatedRows.map((row, rowIndex) => (
  //             <TableRow key={row.id} className={classes.rowHover}>
  //               {columns.map((col) => (
  //                 <TableCell
  //                   key={col.field}
  //                   className={classes.tableHeadCell}
  //                   sx={{
  //                     fontSize: styles.headerFontSize,
  //                     fontWeight: styles.headerFontWeight, // ✅ Apply fontWeight from sizeStyles
  //                     padding: styles.cellPadding,
  //                   }}
  //                 >
  //                   {col.renderCell ? col.renderCell({ row }) : row[col.field]}
  //                 </TableCell>
  //               ))}
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //     <TablePagination
  //       component="div"
  //       count={filteredRows.length}
  //       page={page}
  //       onPageChange={handleChangePage}
  //       rowsPerPage={rowsPerPage}
  //       rowsPerPageOptions={[]}
  //       className={classes.pagination}
  //     />
  //   </Paper>
  // ) :

  return (
    <Paper
      sx={{
        p: "11px 25px 0 25px",
        m: "5px 5px 5px 5px",
        backgroundColor: "#fff",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          {/* <ZTypography
            flag={Labels.header}
            labelText={headerLabel}
            font={Labels.semiBold}
            weight={Labels.bold}
            color={CommonColors.textPrimary}
          /> */}

          <h2 className="zcard-title">{headerLabel}</h2>
          {showAdd && (
            <Tooltip title="Add ">
              <Button
                sx={{
                  color: CommonColors.primaryBlue,
                }}
                startIcon={<AddIcon />}
                onClick={onHandleAdd}
              >
                <ZTypography
                  color="primary"
                  font={Labels.semiBold}
                  weight={Labels.bold}
                  labelText={labelText || " "}
                />
              </Button>
            </Tooltip>
          )}
        </Box>
        <ZSearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: "250px" }}
        />
      </Box>
      {/* 🔄 Responsive Scroll Wrapper */}
      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          sx={{
            minWidth: "100%",
            borderTop: "0.5px solid #f5f5f5",
              minHeight:minHeight||"unset"
          }}
        >
          <Table
            // aria-label={Labels.tablelabel}
            sx={{
              minWidth: tableWidth || "unset",
              tableLayout: "auto",
              width: "100%",
              borderCollapse: "collapse",
            
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fff" }}>
                {showCheckbox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selected.length === rows.length && rows.length > 0
                      }
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      minWidth: col.width ? `${col.width}px` : "max-content",
                      whiteSpace: "nowrap",
                      fontWeight: sizeStyles.small.headerFontWeight,
                      fontSize: sizeStyles.small.headerFontSize,
                      color: "#555",
                      borderBottom: "0.5px solid #f5f5f5",
                      padding: sizeStyles.small.padding,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{col.headerName}</span>
                      <IconButton
                        size="small"
                        onClick={() => handleSort(col.field)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 1,
                          }}
                        >
                          <KeyboardArrowUpIcon
                            fontSize="small"
                            sx={{
                              color:
                                sortField === col.field && sortOrder === "asc"
                                  ? "#4a90e2"
                                  : "rgba(0,0,0,0.3)",
                              mb: "-4px",
                            }}
                          />
                          <KeyboardArrowDownIcon
                            fontSize="small"
                            sx={{
                              color:
                                sortField === col.field && sortOrder === "desc"
                                  ? "#4a90e2"
                                  : "rgba(0,0,0,0.3)",
                              mt: "-4px",
                            }}
                          />
                        </Box>
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                    sx={{
                      textAlign: "center",
                      fontStyle: "italic",
                      color: "#888",
                      padding: "25px 0",
                      borderBottom: "0.5px solid #f5f5f5",
                    }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id || JSON.stringify(row)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                        cursor: "pointer",
                      },
                    }}
                    onClick={(event) => {
                      // Only trigger if click wasn't on a button or interactive element
                      if (
                        !event.target.closest('button, a, [role="button"]') &&
                        onRowClick
                      ) {
                        onRowClick(row, rowIndex);
                      }
                    }}
                  >
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          borderBottom: "0.5px solid #f5f5f5",
                          fontSize: sizeStyles.small.cellFontSize,
                          padding: sizeStyles.small.cellPadding,
                        }}
                      >
                        {col.renderCell
                          ? col.renderCell({ row, rowIndex })
                          : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        // className={classes.pagination}
      />
    </Paper>
  );
}





