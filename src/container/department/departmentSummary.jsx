import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import { PostApi } from "../../utils/api/networking";
import { AppNavigation } from "../../navigations/appNavigation";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Department_Api } from "../../utils/api/apiUrl";
import { Labels } from "../../utils/constants/labels";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { maskEmail } from "../../utils/commonFunction/common";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CommonColors } from "../../utils/constants/colors";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import DisabledVisibleIcon from "@mui/icons-material/DisabledVisible";
import { labelRoutes } from "../../navigations/labelRoutes";
class DepartmentSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentData: [],
      deleteDialog: false,
      activeDialog: false,
      departmentId: "",
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: 3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
  }
  componentDidMount() {
    this.fetchDepartments();
    const insertResponse = this.props.location?.state;
    if (insertResponse) {
      this.showToast(insertResponse, Labels.success);
      window.history.replaceState({}, document.title);
    }
  }
  fetchDepartments = () => {
    PostApi(Department_Api.DepartmentSummary, {}).then((res) => {
      
      if (res.status === Labels.res.status) {
        console.log("fetchdept",res);
        
        const validRows = (res.data.table0 || []).filter(
          (item) => item && Object.keys(item).length > 0
        );
        const departmentData = validRows.map((item) => ({
          departmentId: item.DepartmentId || 0,
          DepartmentName: item.DepartmentName || "-",
          Manager: item.ManagerName || "-",
          SLA: item.SlaName || "-",
          Email: item.EmailId || "-",
          IsPublic: item.IsPublic==0?false:true ,
          IsVisible: item.IsVisible ==0?false:true,
          IsActive: item.IsActive==0?false:true ,
          ParentDepartmentId:
            typeof item.ParentDepartmentId === "object" &&
            item.ParentDepartmentId !== null
              ? ""
              : item.ParentDepartmentId || "",
          ManagerId: item.ManagerId || "",
          SlaId: item.SlaId || "",
          AutoRespEmailId: item.AutoRespEmailId || "",
          AutoRespTemplateId: item.AutoRespTemplateId || "",
          EmailSignature: item.EmailSignature || "",
          AlertsToId: item.AlertsToId || "",
          NoticesToId: item.NoticesToId || "",
          FilePath: item.FilePath || "",
        }));
        this.setState({ departmentData });
      } else {
        this.setState({ departmentData: [] });
      }
    });
  };
  showToast = (
    message,
    severity = Labels.success,
    duration = Labels.num_3000
  ) => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    });
    setTimeout(() => {
      this.setState((prev) => ({
        toast: { ...prev.toast, open: false },
      }));
    }, duration);
  };
  handleCloseToast = () => {
    this.setState((prev) => ({
      toast: { ...prev.toast, open: false },
    }));
  };
  handleEdit = async (row) => {
    try {
      const response = await PostApi(
        `${Department_Api.DepartmentSummary}?DepartmentId=${row.departmentId}`
      );
      if (
        response.status === Labels.flag.select &&
        response.data?.table0?.length > 0
      ) {
        const department = response.data.table0[0];
        this.props.navigate(labelRoutes.department, {
          state: {
            departmentId: department.DepartmentId,
            DepartmentName: department.DepartmentName,
            ParentDepartmentId: department.ParentDepartmentId,
            ManagerId: department.ManagerId,
            EmailId: department.EmailId,
            AutoRespEmailId: department.AutoRespEmailId,
            AutoRespTemplateId: department.AutoRespTemplateId,
            EmailSignature: department.EmailSignature,
            SlaId: department.SlaId,
            AlertsToId: department.AlertsToId,
            NoticesToId: department.NoticesToId,
            FilePath: department.FilePath,
            IsPublic: department.IsPublic,
            IsVisible: department.IsVisible,
            IsActive: department.IsActive,
          },
        });
      } else {
        this.showToast(response.message, Labels.error);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  handleDeleteClick = (row) => {
    this.setState({
      [row.IsActive ? Labels.deleteDialog : Labels.activeDialog]: true,
      departmentId: row.departmentId,
    });
  };
  handleDelete = (del) => {
    const Url = Department_Api.DeleteDepartment;
    if (del === true) {
      const data = {
        departmentId: this.state.departmentId,
        flag: Labels.flag.deActiate,
      };
      PostApi(Url, data).then((res) => {
        if (res.status === Labels.res.status) {
          this.setState({ deleteDialog: false, departmentId: "" });
          this.fetchDepartments();
          this.showToast(res.data.table0[0].Message);
        }
      });
    } else {
      const data = {
        departmentId: this.state.departmentId,
        flag: Labels.flag.activate,
      };
      PostApi(Url, data).then((res) => {
        if (res.status === Labels.res.status) {
          this.setState({ activeDialog: false, departmentId: "" });
          this.fetchDepartments();
          this.showToast(res.data.table0[0].Message);
        }
      });
    }
  };
  handleCancel = () => {
    this.setState({ deleteDialog: false, activeDialog: false });
  };
  handleConfirmDelete = () => {
    this.setState({ openDialog: false });
  };
  handleSwitchChange = (row, IsPublic) => {
    const flag = IsPublic
      ? row.IsPublic
        ? " "
        : Labels.flag.public
      : row.IsVisible
      ? " "
      : Labels.flag.visible;
    const url = IsPublic
      ? Department_Api.makePublic
      : Department_Api.makeVisible;
    const data = {
      DepartmentId: row.departmentId,
      Flag: flag,
      UserId: 1,
    };
    PostApi(url, data).then((res) => {
      if (res.status === Labels.res.status) {
        this.fetchDepartments();
        this.showToast(res.data.table0[0].Message);
      } else {
        this.showToast(res.data.data.table0[0].Message);
      }
    });
  };
  render() {
    const columns = [
      {
        field: Labels.departmentName,
        headerName: Labels.department,
        renderCell: ({ row }) => (
          <Tooltip title={Labels.edit}>
            <span
              style={{
                color: row.IsActive ? Labels.zTable.blue : Labels.zTable.gray,
                textDecoration: row.IsActive ? Labels.underline : Labels.none,
                cursor: row.IsActive
                  ? Labels.cursor.pointer
                  : Labels.not_allowed,
                pointerEvents: row.IsActive ? Labels.auto : Labels.none,
              }}
              onClick={() => row.IsActive && this.handleEdit(row)}
            >
              {row.DepartmentName}
            </span>
          </Tooltip>
        ),
      },
      {
        field: Labels.manager,
        headerName: Labels.manager,
        renderCell: ({ row }) => (
          <span
            style={{
              color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray,
            }}
          >
            {row.Manager || "—"}
          </span>
        ),
      },
      {
        field: Labels.sla,
        headerName: Labels.sla,
        renderCell: ({ row }) => (
          <span
            style={{
              color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray,
            }}
          >
            {row.SLA || "—"}
          </span>
        ),
      },
      {
        field: Labels.email,
        headerName: Labels.Email,
        renderCell: ({ row }) => (
          <span
            style={{
              color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray,
            }}
          >
            {maskEmail(row.Email)}
          </span>
        ),
      },
      {
        field: Labels.autoRespEmailField,
        headerName: Labels.autoRespEmailHeader,
        renderCell: ({ row }) => (
          <span
            style={{
              color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray,
            }}
          >
            {maskEmail(row.AutoRespEmailId)}
          </span>
        ),
      },
      {
        field: Labels.isPublicField,
        headerName: Labels.DepartmentLabels.isPublic,
        renderCell: ({ row }) => (
          <IconButton
            disabled={!row.IsActive}
            onClick={() => this.handleSwitchChange(row, true)}
            color={row.IsActive ? Labels.success : Labels.error}
          >
            {row.IsPublic ? (
              <PublicIcon sx={{ fontSize: 20 }}
                color={
                  row.IsActive
                    ? CommonColors.zTable.success
                    : CommonColors.zTable.disabled
                }
              />
            ) : (
              <PublicOffIcon sx={{ fontSize: 20 }} color={CommonColors.zTable.disabled} />
            )}
          </IconButton>
        ),
      },
      {
        // field: Labels.isVisibleField,
        headerName: Labels.isVisible,
        renderCell: ({ row }) => (
          <IconButton
            disabled={!row.IsActive}
            onClick={() => this.handleSwitchChange(row, false)}
            color={row.IsActive ? Labels.success : Labels.error}
          >
            {row.IsVisible ? (
              <VisibilityIcon sx={{ fontSize: 20 }}
                color={
                  row.IsActive
                    ? CommonColors.zTable.success
                    : CommonColors.zTable.disabled
                }
              />
            ) : (
              <DisabledVisibleIcon sx={{ fontSize: 20 }} color={CommonColors.zTable.disabled} />
            )}
          </IconButton>
        ),
      },
      {
        field: Labels.isActiveField,
        headerName: Labels.isActive,
        renderCell: ({ row }) => (
          <Tooltip title={row.IsActive ? Labels.deActivate : Labels.activate}>
            <IconButton
              onClick={() => this.handleDeleteClick(row)}
              color={row.IsActive ? Labels.success : Labels.error}
            >
              {row.IsActive ? (
                <DeleteIcon sx={{ fontSize: 20 }} color={Labels.error} />
              ) : (
                <EditIcon sx={{ fontSize: 20 }} color="disabled" />
              )}
            </IconButton>
          </Tooltip>
        ),
      },
    ];
    return (
      <React.Fragment>
        <ZTable
          columns={columns}
          rows={this.state.departmentData}
          onHandleAdd={() => this.props.navigate(labelRoutes.department)}
          headerLabel={Labels.departmentSummary}
        />
        <ZDialogueBox
          open={this.state.deleteDialog}
          onClose={this.handleCancel}
          title={Labels.deleteDepartment}
          labelText={Labels.deleteConfirmationMsg}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={() => this.handleDelete(true)}
        />
        <ZDialogueBox
          open={this.state.activeDialog}
          onClose={this.handleCancel}
          title={Labels.activateDepartment}
          labelText={Labels.activateConfirmDepartment}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={() => this.handleDelete(false)}
        />
        <ZToasterMsg
          open={this.state.toast.open}
          message={this.state.toast.message}
          severity={this.state.toast.severity}
          duration={this.state.toast.duration}
          position={this.state.toast.position}
          onClose={this.handleCloseToast}
        />
      </React.Fragment>
    );
  }
}
export default AppNavigation(DepartmentSummary);