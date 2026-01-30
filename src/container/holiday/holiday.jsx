import React, { Component } from "react";
import ZCard from "../../component/ZCard/zcard";
import ZTable from "../../component/ZTable/ztable";
import ZButton from "../../component/ZButton/zbutton";
import ZDatePicker from "../../component/ZDatePicker/zdatePicker"
import ZTextField from "../../component/ZTextField/ztextfield";
import { GetApi, PostApi } from "../../utils/api/networking";
import { Labels } from "../../utils/constants/labels";
import ZTypography from "../../component/ZTypography/ztypography";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "./holiday.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { Holiday_Api } from "../../utils/api/apiUrl";
import DeleteIcon from "@mui/icons-material/Delete";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { CommonColors } from "../../utils/constants/colors";
import ZDateRangePicker from "../../component/ZDateRangePicker/zdateRangePicker";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { allowAlphaSpace, isNotEmpty } from "../../utils/commonFunction/common";

class Holiday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Form fields
      txt_holidayListName: "",
      dp_year: new Date().getFullYear(),
      drp_holidayDateRange: [null, null],
      txt_newHolidayName: "",
      // Data states
      holidayLists: [],
      holidayData: [],
      // Selection states
      selectedHolidayListId: null,
      selectedHolidayListName: "",
      selectedRowToDelete: null,
      editingHoliday: null,

      // UI control states
      showTable: false,
      isEditHolidayMode: false,

      // Dialog states
      showListDialog: false,
      showHolidayNameDialog: false,
      showDateRangePicker: false,
      showDeleteDialog: false,
      showConfirmDialog: false,
      // Dialog content
      dialogMode: " ",
      confirmTitle: "",
      confirmMessage: "",
      confirmCallback: null,
      // Toast
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
    this.showToast = this.showToast.bind(this);
    this.handleCloseToast = this.handleCloseToast.bind(this);
  }
  // Toast handlers
  showToast = (message, severity = Labels.success, duration = 4000) => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    });
  };
  handleCloseToast = () => {
    this.setState({
      toast: {
        ...this.state.toast,
        open: false,
      },
    });
  };
  componentDidMount() {
    this.fetchHolidayLists();
  }
  // API call handlers
  fetchHolidayLists = async () => {
    const { dp_year } = this.state;
    try {
      const res = await GetApi(`${Holiday_Api.GetHoliday}?year=${dp_year}`);
      
      if (res?.status === Labels.flag.select) {
        const filterData = res.data.data.table0
          .filter((obj) => obj && Object.keys(obj).length > 0)
          .map((obj) => {
            const updatedObj = { ...obj };
            updatedObj.NoOfHolidays = isNotEmpty(updatedObj.NoOfHolidays)
              ? String(updatedObj.NoOfHolidays)
              : ("0");
            return updatedObj;
          });
        this.setState({ holidayLists: filterData || [] });
      } else {
        this.setState({ holidayLists: [] });
      }
    } catch (error) {
      this.setState({ holidayLists: [] });
    }
  };
  fetchHolidays = async (holidayListId) => {
    try {
      const res = await GetApi(
        `${Holiday_Api.GetHolidayName}?HolidayListId=${holidayListId}`
      );
      if (res?.status === Labels.flag.select) {
        const data = res?.data?.data?.table0 || [];
        this.setState({
          holidayData: data,
          showTable: data.length > 0,
        });
      } else {
        this.setState({ holidayData: [] });
      }
    } catch (error) {
      this.setState({ holidayData: [] });
    }
  };
  // UI event handlers
  handleAddListClick = () => {
    this.setState({
      showListDialog: true,
      txt_holidayListName: "",
      dialogMode: Labels.add,
      selectedId: null,
    });
  };
  handleEditListClick = (row) => {
    this.setState({
      showListDialog: true,
      txt_holidayListName: row.HolidayListName,
      dialogMode: Labels.edit,
      selectedId: row.HolidayListId,
    });
  };
  handleYearChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const selectedYear = dayjs(newValue).year();
      this.setState(
        {
          dp_year: selectedYear,
          selectedHolidayListId: null,
          holidayData: [],
          holidayLists: [],
        },

        () => {
          this.fetchHolidayLists();
        }
      );
    }
  };
  handleViewDetails = (holidayListId, holidayListName) => {
    this.setState(
      {
        selectedHolidayListId: holidayListId,
        selectedHolidayListName: holidayListName,
      },
      () => {
        this.fetchHolidays(holidayListId);
      }
    );
  };
  handleToggleActive = (row) => {
    const flag = row.IsActive ? Labels.flag.delete : Labels.flag.active;
    const action =
      flag === Labels.flag.delete
        ? Labels.action.deactivate
        : Labels.action.activate;
    this.setState({
      showConfirmDialog: true,
      confirmTitle: `${action} Holiday List`,
      confirmMessage: `Are you sure want to ${action.toLowerCase()} this holiday list?`,
      confirmCallback: () => this.confirmToggleActive(row, flag),
    });
  };
  confirmToggleActive = async (row, flag) => {
    const payload = {
      HolidayListId: row.HolidayListId,
      HolidayListName: row.HolidayListName,
      Year: this.state.dp_year,
      flag: flag,
    };
    try {
      const res = await PostApi(Holiday_Api.AddUpdateDeleteHolidayList, payload);
      if (res?.status === Labels.flag.select) {
        this.showToast(res.data.table0[0].Message);
        this.fetchHolidayLists();
        if (
          flag === Labels.flag.delete &&
          this.state.selectedHolidayListId === row.HolidayListId
        ) {
          this.setState({
            selectedHolidayListId: null,
            holidayData: [],
            showTable: false,
          });
        } else {
          this.showToast(res.data.table0[0].Message);
        }
      } else {
        this.showToast(res.data.table0[0].Message, Labels.error);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    } finally {
      this.setState({ showConfirmDialog: false });
    }
  };
  // Date range picker handlers
  handleOpenDateRangePicker = () => {
    this.setState({
      showDateRangePicker: true,
      drp_holidayDateRange: [null, null],
      txt_newHolidayName: "",
      isEditHolidayMode: false,
      editingHoliday: null,
    });
  };

  handleDateRangeChange = (newRange) => {
    this.setState({ drp_holidayDateRange: newRange });
  };

  handleConfirmDateRange = () => {
    this.setState({
      showDateRangePicker: false,
      showHolidayNameDialog: true,
    });
  };
  handleCancelDateRange = () => {
    this.setState({
      showDateRangePicker: false,
      drp_holidayDateRange: [null, null],
    });
  };
  // Holiday name dialog handlers
  handleEditHoliday = (holiday) => {
    this.setState({
      isEditHolidayMode: true,
      editingHoliday: holiday,
      txt_newHolidayName: holiday.HolidayName,
      drp_holidayDateRange: [dayjs(holiday.FromDate), dayjs(holiday.ToDate)],
      showHolidayNameDialog: true,
    });
  };
  handleSubmitHolidayName = async () => {
    const {
      selectedHolidayListId,
      drp_holidayDateRange,
      txt_newHolidayName,
      isEditHolidayMode,
      editingHoliday,
    } = this.state;
    if (
      !selectedHolidayListId ||
      !txt_newHolidayName ||
      !drp_holidayDateRange[0] ||
      !drp_holidayDateRange[1]
    ) {
      return;
    }
    const payload = {
      HolidayListId: selectedHolidayListId,
      holidayName: txt_newHolidayName,
      fromDate: drp_holidayDateRange[0].format("YYYY-MM-DD"),
      toDate: drp_holidayDateRange[1].format("YYYY-MM-DD"),
      flag: isEditHolidayMode ? Labels.flag.update : Labels.flag.insert,
    };
    if (isEditHolidayMode && editingHoliday) {
      payload.HolidayId = editingHoliday.HolidayId;
    }
    try {
      const res = await PostApi(
        Holiday_Api.AddUpdateDeleteHolidayName,
        payload
      );
      // console.log(res, "Holiday Name Response");
      if (res.data.table0[0].Status === Labels.flag.select) {
        this.showToast(
          isEditHolidayMode ? Labels.updateHoliday : Labels.addedHoliday
        );
        this.setState(
          {
            showHolidayNameDialog: false,
            txt_newHolidayName: "",
            drp_holidayDateRange: [null, null],
            isEditHolidayMode: false,
            editingHoliday: null,
          },
          () => this.fetchHolidays(selectedHolidayListId)
        );
        this.fetchHolidayLists();
      }
      else {
        this.showToast(res.data.table0[0].Message, Labels.error);
      }
    } catch (err) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  // Delete handlers
  handleDeleteHoliday = (row) => {
    this.setState({
      showDeleteDialog: true,
      selectedRowToDelete: row,
       confirmTitle: Labels.confirmDelete || "Delete Holiday",
    confirmMessage: Labels.deleteHolidayConfirmation || `Are you sure you want to delete "${row.HolidayName}"?`,

    });
  };
  handleConfirmDelete = async () => {
    const { selectedRowToDelete } = this.state;
    const payload = {
      Flag: Labels.flag.delete,
      HolidayId: selectedRowToDelete.HolidayId,
      HolidayName: selectedRowToDelete.HolidayName || "",
      HolidayListId: selectedRowToDelete.HolidayListId || null,
      FromDate: selectedRowToDelete.FromDate || null,
      ToDate: selectedRowToDelete.ToDate || null,
    };
    try {
      const response = await PostApi(
        Holiday_Api.AddUpdateDeleteHolidayName,
        payload
      );
      if (response?.status === Labels.flag.select) {
        this.showToast(response.data.table0[0].Message);
        this.fetchHolidays(this.state.selectedHolidayListId);
        this.fetchHolidayLists();
      } else {
        this.showToast(Labels.deleteHolidayError);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    } finally {
      this.setState({ showDeleteDialog: false, selectedRowToDelete: null });
    }
  };
  handleCancelDelete = () => {
    this.setState({ showDeleteDialog: false, selectedRowToDelete: null });
  };
  // Form handlers
  handleListDialogClose = () => {
    this.setState({
      showListDialog: false,
      txt_holidayListName: "",
      selectedId: null,
      dialogMode: Labels.add,
    });
  };
  handleHolidayNameDialogClose = () => {
    this.setState({
      showHolidayNameDialog: false,
      txt_newHolidayName: "",
      drp_holidayDateRange: [null, null],
      isEditHolidayMode: false,
      editingHoliday: null,
    });
  };
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmitList = async () => {
    const { txt_holidayListName, dp_year, selectedId, dialogMode } = this.state;
    if (!txt_holidayListName.trim()) return;
    const payload = {
      HolidayListId: selectedId || 0,
      HolidayListName: txt_holidayListName,
      Year: dp_year,
      flag:
        dialogMode === Labels.edit ? Labels.flag.update : Labels.flag.insert,
    };
    try {
      const res = await PostApi(Holiday_Api.AddUpdateDeleteHolidayList, payload);
      if (res.data.table0[0].Status === Labels.res.status) {
        this.setState(
          {
            showListDialog: false,
            txt_holidayListName: "",
            selectedId: null,
          },
          this.fetchHolidayLists
        );
        this.showToast(res.data.table0[0].Message);
      }
      else {
        this.showToast(res.data.table0[0].Message, Labels.error);
      }
    } catch (error) {
      console.error(Labels.catchErrorMsg, error);
    }
  };
  render() {
    return (
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <ZCard>
          <Box className="holiday-list-header">
            <Box className="header-left-container">
              <ZTypography
                flag={Labels.header}
                labelText={Labels.holidayList}
                font={Labels.semiBold}
                weight={Labels.bold}
                color={CommonColors.textPrimary}
              />

              <Tooltip title={Labels.add}>
                <IconButton onClick={this.handleAddListClick}>
                  <AddIcon style={{ color: "#23A9F2" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <div className="datepicker">
              <ZDatePicker
                views={["year"]}
                value={dayjs().set("year", this.state.dp_year)}
                onChange={this.handleYearChange}
                label="Year"
              />
            </div>
          </Box>
          {this.state.holidayLists.length > 0 ? (
            <ZTable
              columns={[
                {
                  field: Labels.holidayListField,
                  headerName: Labels.holidayList,
                  // width: 10 ,
                  renderCell: ({ row }) => (
                    <Box className="holiday-list-cell">
                      <span
                        style={{
                          color: row.IsActive
                            ? Labels.zTable.blue
                            : Labels.zTable.gray,
                          textDecoration: row.IsActive
                            ? Labels.underline
                            : Labels.none,
                          cursor: row.IsActive
                            ? Labels.cursor.pointer
                            : Labels.not_allowed,
                          pointerEvents: row.IsActive
                            ? Labels.auto
                            : Labels.none,
                        }}
                        onClick={() =>
                          row.IsActive &&
                          this.handleViewDetails(
                            row.HolidayListId,
                            row.HolidayListName
                          )
                        }
                      >
                        {row.HolidayListName}
                      </span>
                      <Tooltip title={Labels.edit}>
                        <IconButton
                          size={Labels.small}
                          disabled={!row.IsActive}
                          onClick={() => this.handleEditListClick(row)}
                          className="edit-icon"
                        >
                          <EditIcon fontSize={Labels.small} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ),
                },
                {
                  field: Labels.noOfHolidaysField,
                  headerName: Labels.noOfHolidaysHeader,
                  valueGetter: (params) => params.row.NoOfHolidays || 0,
                  renderCell: ({ row }) => (
                    <span
                      style={{
                        color: row.IsActive
                          ? Labels.zTable.inherit
                          : Labels.zTable.gray,
                      }}
                    >
                      {row.NoOfHolidays == "[object Object]" ? 0 : row.NoOfHolidays}
                    </span>
                  ),
                },
                {
                  field: Labels.isActiveField,
                  headerName: Labels.actions,
                  renderCell: ({ row }) => (
                    <Tooltip
                      title={row.IsActive ? Labels.deActivate : Labels.activate}
                    >
                      <IconButton
                        onClick={() => this.handleToggleActive(row)}
                        style={{
                          color: row.IsActive ? Labels.zTable.red : Labels.zTable.gray,
                        }}
                      >
                        {row.IsActive ? <DeleteIcon sx={{ fontSize: 20 }} /> : <EditIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </Tooltip>
                  ),
                },
              ]}
              rows={this.state.holidayLists}
              showAdd={false}
              tableWidth={Labels.fourHundredPixel}
            />
          ) : (
            <div className="no-data-message">No Data Available</div>
          )}
        </ZCard>
        {/* RIGHT GRID - Holidays */}
        <ZCard>
          <Box className="holiday-grid-container">
            <Box className="header-right-container">
              <ZTypography
                flag={Labels.header}
                labelText={Labels.holidayListName}
                font={Labels.semiBold}
                weight={Labels.bold}
                color={CommonColors.textPrimary}
              />

              <Tooltip title={Labels.add}>
                <IconButton onClick={this.handleOpenDateRangePicker}>
                  <AddIcon style={{ color: "#23A9F2" }} />
                </IconButton>
              </Tooltip>
            </Box>
            {this.state.selectedHolidayListId ? (
              this.state.showTable ? (
                <ZTable
                  columns={[
                    {
                      field: Labels.holidayNameField,
                      headerName: Labels.holidayName,
                      flex: 1,
                    },
                    {
                      field: Labels.fromDate,
                      headerName: Labels.from,
                      flex: 1,
                      renderCell: (params) =>
                        dayjs(params.row.FromDate).format("DD MMM YYYY"),
                    },
                    {
                      field: Labels.toDate,
                      headerName: Labels.to,
                      flex: 1,
                      renderCell: (params) =>
                        dayjs(params.row.ToDate).format("DD MMM YYYY"),
                    },
                    {
                      field: Labels.isActiveField,
                      headerName: Labels.active,
                      renderCell: ({ row }) => (
                        <Box>
                          <Tooltip title={Labels.edit}>
                            <IconButton
                              onClick={() => this.handleEditHoliday(row)}
                              color="primary"
                            >
                              <EditIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              row.IsActive
                                ? Labels.Delete
                                : Labels.action.activate
                            }
                          >
                            <IconButton
                              onClick={() => this.handleDeleteHoliday(row)}
                              color={
                                row.IsActive ? Labels.error : Labels.success
                              }
                            >
                              {row.IsActive ? (
                                <DeleteIcon sx={{ fontSize: 20 }} />
                              ) : (
                                <AddIcon sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ),
                    },
                  ]}
                  rows={this.state.holidayData}
                  showAdd={false}
                  tableWidth="400px"
                />
              ) : (
                <div className="no-holidays-message">
                  {Labels.noHolidaysFound}{" "}
                  <span
                    className="add-holiday-link"
                    onClick={this.handleOpenDateRangePicker}
                  >
                    {Labels.clickToAdd}
                  </span>
                </div>
              )
            ) : (
              <div className="select-holiday-message">
                {Labels.selectHolidayList}
              </div>
            )}
          </Box>
        </ZCard>
        {/* Date Range Picker Dialog */}
        <ZDateRangePicker
          open={this.state.showDateRangePicker}
          onClose={this.handleCancelDateRange}
          title={Labels.selectHoliday}
          value={this.state.drp_holidayDateRange}
          onChange={this.handleDateRangeChange}
          minDate={dayjs(`${this.state.dp_year}-01-01`)}
          maxDate={dayjs(`${this.state.dp_year}-12-31`)}
          onConfirm={this.handleConfirmDateRange}
          onCancel={this.handleCancelDateRange}
          confirmText={Labels.confirmDate}
        />

        {/* Holiday Name Dialog */}
        <Dialog
          open={this.state.showHolidayNameDialog}
          onClose={() => this.handleHolidayNameDialogClose()}
        >
          <DialogTitle>
            <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}><span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
      {this.state.isEditHolidayMode
        ? Labels.editHoliday
        : Labels.addHoliday}</span>
      <IconButton 
        onClick={() => this.handleHolidayNameDialogClose()}
        size="small"
        sx={{ padding: 0 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
          </DialogTitle>
          <DialogContent>
            <Box className="holiday-name-dialog-content">
              <ZTextField
                value={this.state.txt_newHolidayName}
                onChange={(e) =>
                  this.setState({ txt_newHolidayName: e.target.value })
                }
                label={Labels.holidayName}
                onKeyPress={allowAlphaSpace}
              />
              <Box className="date-range-container">
                {/* <ZButton
                  variant="outlined"
                  onClick={() => this.setState({ showDateRangePicker: true })}
                  className="change-dates-button"
                >
                  {Labels.changeDates}
                </ZButton> */}
                <div className="selected-dates">
                  Selected:{" "}
                  {this.state.drp_holidayDateRange[0]?.format("DD MMM YYYY")} -{" "}
                  {this.state.drp_holidayDateRange[1]?.format("DD MMM YYYY")}
                </div>
                <span
                  className="change-dates-link"
                  onClick={() => this.setState({ showDateRangePicker: true })}
                >
                  {Labels.changeDates}
                </span>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <ZButton
              onClick={this.handleHolidayNameDialogClose}
              variant="outlined"
            >
              {Labels.Cancel}
            </ZButton>
            <ZButton
              onClick={this.handleSubmitHolidayName}
              variant="contained"
              disabled={
                !this.state.txt_newHolidayName ||
                !this.state.drp_holidayDateRange[0] ||
                !this.state.drp_holidayDateRange[1]
              }
            >
              {this.state.isEditHolidayMode ? Labels.update : Labels.submit}
            </ZButton>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {this.state.showDeleteDialog && (
          <ZDialogueBox
            open={this.state.showDeleteDialog}
            title={Labels.confirmDelete}
            onClose={this.handleCancelDelete}
            onConfirm={this.handleConfirmDelete}
            labelText={Labels.deleteHolidayConfirmation}
          />
        )}

        {/* Holiday List Add/Edit Dialog */}
        <Dialog
          open={this.state.showListDialog}
          onClose={this.handleListDialogClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: '400px',
              padding: 1
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingRight: 0
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {this.state.dialogMode === Labels.edit
                  ? Labels.editHolidayList
                  : Labels.addHolidayList}
              </span>
              <IconButton 
                onClick={this.handleListDialogClose}
                size="small"
                sx={{ 
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '16px !important' }}>
            <Box className="holiday-list-dialog-content" sx={{ minHeight: '80px' }}>
              <ZTextField
                value={this.state.txt_holidayListName}
                onChange={(e) =>
                  this.setState({ txt_holidayListName: e.target.value })
                }
                label={Labels.holidayListName}
                onKeyPress={allowAlphaSpace}
                fullWidth
                variant="outlined"
                sx={{ marginTop: 1 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px', gap: 1 }}>
         
            <ZButton 
              onClick={this.handleSubmitList} 
              variant="contained"
              disabled={!this.state.txt_holidayListName.trim()}
              sx={{ 
               
                borderRadius: 2,
                paddingX: 3,
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              {this.state.dialogMode === Labels.edit
                ? Labels.update
                : Labels.add}
            </ZButton>
          </DialogActions>
        </Dialog>
        {/* General Confirmation Dialog */}
        <ZDialogueBox
          open={this.state.showConfirmDialog}
          title={this.state.confirmTitle}
          labelText={this.state.confirmMessage}
          onClose={() => this.setState({ showConfirmDialog: false })}
          onConfirm={() => {
            if (this.state.confirmCallback) this.state.confirmCallback();
          }}
        />
        <ZToasterMsg
          open={this.state.toast.open}
          message={this.state.toast.message}
          severity={this.state.toast.severity}
          duration={this.state.toast.duration}
          position={this.state.toast.position}
          onClose={this.handleCloseToast}
        />
      </Box>
    );
  }
}

export default Holiday;
