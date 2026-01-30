import { Component } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore"; // for undelete icon
import IconButton from "@mui/material/IconButton";
import ZTable from "../../component/ZTable/ztable";
import { PostApi } from "../../utils/api/networking";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { Labels } from "../../utils/constants/labels";
import { Box } from "@mui/material";
import { AssignMethod_Api } from "../../utils/api/apiUrl";

class AssignMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      openDialog: false,
      selectedId: null,
      dialogAction: null, // "delete" or "restore"
      toast: {
        open: false,
        message: "",
        severity: "success",
        duration: 3000,
        position: { 
          vertical: "bottom", 
          horizontal: "right" 
        }
      }
    };
  }

    showToast = (message, severity = "success", position = null) => {
    this.setState({
      toast: {
        open: true,
        message,
        severity,
        duration: 3000,
        position: position || this.state.toast.position
      }
    });
  };

  handleCloseToast = () => {
    this.setState(prevState => ({
      toast: {
        ...prevState.toast,
        open: false
      }
    }));
  };
  // handleShowToast = () => {
  //   this.setState({ toastOpen: true });
  // };

  // handleCloseToast = () => {
  //   this.setState({ toastOpen: false });
  // }
  
  componentDidMount = () => {
    PostApi(AssignMethod_Api.getAssignmethodMaster).then((res) => {
      if (res.status === "S") {
        console.log(res, "dfsjfd");
        const rowsWithId = res.assignmethodList.map((item, index) => ({
          ...item,
          id: item.id ?? index,
          assignmethod: item.assignMethod,
        }));

        this.setState({ rows: rowsWithId });
      } else {
        console.error("Api returned an error:", res.message);
      }
    });
  };

  handleDelete = async (id) => {
    this.setState({ toastOpen: true });
    try {
      const res = await PostApi(AssignMethod_Api.deleteAssignMethod, {
        Id: id,
      });
      if (res.status === "S") {
        this.showToast(res.message);
        // Update the isactive to 0 for the deleted row
        const updatedRows = this.state.rows.map((row) =>
          row.id === id ? { ...row, isactive: 0 } : row
        );
        this.setState({ rows: updatedRows });
      } else {
        this.showToast(res.message, "error");
      }
    } catch (error) {
      this.showToast(error?.response?.data?.message, "error");
      console.error("Delete error:", error);
    }
  };

  handleRestore = async (id) => {
    try {
      const res = await PostApi(AssignMethod_Api.undoAssignMethod, { Id: id });

      if (res.status === "S") {
        this.showToast(res.message);

        const updatedRows = this.state.rows.map((row) =>
          row.id === id ? { ...row, isactive: 1 } : row
        );

        this.setState({ rows: updatedRows });
      } else {
        this.showToast(res.message, "error");
      }
    } catch (error) {
      this.showToast(error?.response?.data?.message, "error");
      console.error("Restore error:", error);
    }
  };

 getColumns = () => [
  {
    field: Labels.getcolumnfield,
    headerName: Labels.getcolumnField,
    flex: 1,
    renderCell: ({ row }) => (
      <span
        style={{
          color: row.isactive
            ? Labels.zTable.inherit
            : Labels.zTable.gray,
        }}
      >
        {row.assignmethod}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }) => (
      <>
        <IconButton sx={{ fontSize: 20 }}
          onClick={() =>
            this.setState({
              openDialog: true,
              selectedId: row.id,
              dialogAction: Labels.delete,
            })
          }
          disabled={!row.isactive}
        >
          <DeleteIcon  sx={{ fontSize: 20 }} color={row.isactive ? "error" : "disabled"} />
        </IconButton>

        {!row.isactive && (
          <IconButton sx={{ fontSize: 20 }}
            onClick={() =>
              this.setState({
                openDialog: true,
                selectedId: row.id,
                dialogAction: Labels.restore,
              })
            }
            color="primary"
          >
            <RestoreIcon  sx={{ fontSize: 20 }}/>
          </IconButton>
        )}
      </>
    ),
  },
];


  handleAdd = () => {
    console.log("Add button clicked");
  };

  render() {
    const sizeType = "small";
    console.log("ZTable sizeType:", sizeType);

    return (
      <div className="flex p-5 gap-4">
        {/* LEFT SIDE - CONTENT */}
        <div className="w-1/2">
          <ZTable
            headerLabel={"Assign Method"}
            columns={this.getColumns()}
            rows={this.state.rows}
            onHandleAdd={this.handleAdd}
            showAdd={false}
            viewType="assignMethod"
            sizeType="medium"
            tableWidth="400px"
          />

          <ZDialogueBox
            open={this.state.openDialog}
            onClose={() =>
              this.setState({
                openDialog: false,
                selectedId: null,
                dialogAction: null,
              })
            }
            onConfirm={() => {
              if (this.state.dialogAction === Labels.delete) {
                this.handleDelete(this.state.selectedId);
              } else if (this.state.dialogAction === Labels.restore) {
                this.handleRestore(this.state.selectedId);
              }

              this.setState({
                openDialog: false,
                selectedId: null,
                dialogAction: null,
              });
            }}
            title={
              this.state.dialogAction === Labels.delete
                ? Labels.titleDelete
                : Labels.titleRestore
            }
            labelText={
              this.state.dialogAction === Labels.delete
                ? Labels.DeleteDialog
                : Labels.RestoreDialog
            }
            confirmText={
              this.state.dialogAction === Labels.delete
                ? Labels.yes
                : Labels.yes
            }
            cancelText={Labels.no}
          />

         <ZToasterMsg
          open={this.state.toast.open}
          message={this.state.toast.message}
          severity={this.state.toast.severity}
          duration={this.state.toast.duration}
          position={this.state.toast.position}
          onClose={this.handleCloseToast}
        />
        </div>

        {/* RIGHT SIDE - EMPTY */}
        <div className="w-1/2"></div>
      </div>
    );
  }
}

export default AssignMethod;
