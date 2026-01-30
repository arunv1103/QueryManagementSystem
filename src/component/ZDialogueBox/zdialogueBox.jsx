import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles"; // ✅ ADD THIS
import CloseIcon from "@mui/icons-material/Close";
import { Labels } from "../../utils/constants/labels";
import ZButton from "../ZButton/zbutton";
import ZTypography from "../ZTypography/ztypography";
import ZTextField from "../ZTextField/ztextfield";
import ZDropdown from "../ZDropdown/zdropdown";
import ZCheckBox from "../ZCheckBox/ZCheckBox";
import { CommonColors } from "../../utils/constants/colors";

export default function ZDialogueBox({
  open,
  onClose,
  title = "Are you sure",
  Emailtitle,
  labelText = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  showCancel = true,
  showConfirm = true,
  maxWidth = Labels.maxWidth.sm,
  children, // ✅ keep only one
  icon = null,
  disableBackdropClick = true,
  viewType = "default",
  departmentList,
  assignmethodList,
  errors = {},
  onSubmit,
  onUpdate,
  IsVisibleCloseIcon=false,
  id,
  flag,
  width = 380,
  serviceQueueName: initialServiceQueueName = "",
  department: initialDepartment = "",
  assignMethod: initialAssignMethod = "",
  isActive: initialIsActive = true,
}) {
  const theme = useTheme();

  const [serviceQueueName, setServiceQueueName] = useState(
    initialServiceQueueName
  );
  const [department, setDepartment] = useState(initialDepartment);
  const [assignMethod, setAssignMethod] = useState(initialAssignMethod);
  const [isActive, setIsActive] = useState(initialIsActive);

  // 🔁 Sync when props change (on Edit)
  useEffect(() => {
    setServiceQueueName(initialServiceQueueName);
    setDepartment(initialDepartment);
    setAssignMethod(initialAssignMethod);
    setIsActive(initialIsActive);
  }, [
    initialServiceQueueName,
    initialDepartment,
    initialAssignMethod,
    initialIsActive,
  ]);

  const handleserviceQueueChange = (event) => {
    // console.log(event, "service");
    setServiceQueueName(event.target.value);
  };
  const handledepartmentChange = (event) => {
    // console.log(event, "DROPDOWN1");
    setDepartment(event.target.value); // value = departmentId
  };

  const handleassignMethodChange = (event) => {


    setAssignMethod(event.target.value); // value = assignMethodId
  };

  const handleCheckboxChange = (checked) => {
    setIsActive(checked);
  };

  const serviceQueueData = () => ({
    serviceQueueName,
    department,
    assignMethod,
    isActive,
  });

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") return;
    onClose?.();
  };

  const handleDelete = (e) => {
    onConfirm(e);
  };
  const handleCloseFormFeild = () => {
    onClose?.();
    setServiceQueueName("");
    setDepartment("");
    setAssignMethod("");
    setIsActive(false);
  };

  return viewType === "popup" ? (
    <Dialog open={open} onClose={handleCloseFormFeild}>
      <DialogTitle>
        Service Queue
        <IconButton
          onClick={handleCloseFormFeild}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ width: 380 }}>
        {/* <ZTextField
          label="Service Queue Name"
          required
          name="serviceQueueName"
          value={serviceQueueName}
          onChange={(e) => setServiceQueueName(e.target.value)}
          error={!!errors.serviceQueueName}
          helperText={errors.serviceQueueName}
          sx={{ mt: 2 }}
        />

        <ZDropdown
          label="Department *"
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={departmentList.map((dept) => ({
            value: dept.departmentId,
            label: dept.departmentName,
          }))}
          error={!!errors.department}
          helperText={errors.department}
        />

        <ZDropdown
          label="Assign Method *"
          name="assignMethod"
          value={assignMethod}
          onChange={(e) => setAssignMethod(e.target.value)}
          options={assignmethodList?.map((item) => ({
            label: item.assignMethod,
            value: item.id,
          }))}
          error={!!errors.assignMethod}
          helperText={errors.assignMethod}
        />

        <ZCheckBox
          label="Is Active"
          name="isActive"
          checked={isActive}
          onChange={setIsActive}
          sx={{ mt: -2 }}
        /> */}

        <ZTextField
          label="Service Queue Name"
          required
          name="serviceQueueName"
          value={serviceQueueName}
          onChange={(e) => setServiceQueueName(e.target.value)}
          error={!!errors.serviceQueueName}
          helperText={errors.serviceQueueName}
          sx={{ mt: 2 }}
        />

        <ZDropdown
          label="Department *"
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={departmentList.map((dept) => ({
            value: dept.departmentId,
            label: dept.departmentName,
          }))}
          error={!!errors.department}
          helperText={errors.department}
        />

        <ZDropdown
          label="Assign Method *"
          name="assignMethod"
          value={assignMethod}
          onChange={(e) => setAssignMethod(e.target.value)}
          options={assignmethodList?.map((item) => ({
            label: item.assignMethod,
            value: item.id,
          }))}
          error={!!errors.assignMethod}
          helperText={errors.assignMethod}
        />

        <ZCheckBox
          label="Is Active"
          name="isActive"
          checked={isActive}
          onChange={setIsActive}
          sx={{ mt: -2 }}
        />


        {flag == "Add" ? (
          <ZButton
            label="Submit"
            fullWidth
            onClick={() => onSubmit(serviceQueueData())}
            sx={{ mt: 2 }}
          />
        ) : (
          <ZButton
            label="Update"
            fullWidth
            onClick={() => onUpdate(serviceQueueData(), id)}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>
    </Dialog>
  ) : viewType === "Dialog" ? (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <ZTypography
            labelText={Emailtitle}
            flag={Labels.header}
            font={Labels.semiBold}
            color={CommonColors.textPrimary}
            marginBottom={1}
          />
          {IsVisibleCloseIcon ===true ? <> <IconButton
            onClick={onClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          </> : <></>}

        </DialogTitle>

        <DialogContent style={{ width }}>{children}</DialogContent>
      </Dialog>
    </>
  ) : (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: theme.shadows[5],
            px: 1,
            py: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            // px: 2,
            py: 2,
            fontWeight: 600,
            fontSize: "1.25rem",
            color: theme.palette.text.primary,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {/* {icon}
            {title} */}
            <h4 className="zcard-title">{title}</h4>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            // px:2,
            py: 2,
            color: theme.palette.text.secondary,
            // textAlign:"initial",
            fontSize: "0.95rem",
          }}
        >
          {typeof labelText === "string" ? (
            <ZTypography
              flag={Labels.smallText}
              labelText={labelText}
              sx={{ fontSize: "0.65rem" }}
            />

          ) : (
            children
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-end",
            px: 3,
            pb: 3,
            pt: 0,
            gap: 1.5,
          }}
        >
          {showCancel && (
            // <ZButton
            //   variant="contained"
            //   onClick={onClose}
            //   label={cancelText}
            //   sx={{
            //     borderRadius: "999px",
            //     minWidth: "110px",
            //     textTransform: "uppercase",
            //     fontWeight: 500,
            //     color: "#fff",
            //     backgroundColor: "#f44336", // Red
            //     "&:hover": {
            //       backgroundColor: "#e57373", // Light red on hover
            //     },
            //   }}
            // />
            <ZButton
              variant={Labels.outlined}
              onClick={onClose}
              label={cancelText}
              color="#23A9F2"
            // sx={{
            //   borderRadius: "999px",
            //   minWidth: "110px",
            //   textTransform: "uppercase",
            //   fontWeight: 500,
            //   color: "#fff",
            //   backgroundColor: "#f44336", // Red
            //   "&:hover": {
            //     backgroundColor: "#e57373", // Light red on hover
            //   },
            // }}
            />
          )}
          {showConfirm && (
            // <ZButton
            //   variant="contained"
            //   onClick={onConfirm}
            //   label={confirmText}
            //   sx={{
            //     borderRadius: "999px",
            //     minWidth: "110px",
            //     backgroundColor: "#4CAF50", // base green
            //     color: "#fff",
            //     textTransform: "uppercase",
            //     fontWeight: 600,
            //     "&:hover": {
            //       backgroundColor: "#81C784", // light green on hover
            //     },
            //   }}
            // />
            <ZButton
              variant="contained"
              onClick={handleDelete}
              label={confirmText}
              color="error"
            // sx={{
            //   borderRadius: "999px",
            //   minWidth: "110px",
            //   backgroundColor: "#4CAF50", // base green
            //   color: "#fff",
            //   textTransform: "uppercase",
            //   fontWeight: 600,
            //   "&:hover": {
            //     backgroundColor: "#81C784", // light green on hover
            //   },
            // }}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
