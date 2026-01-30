import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import { GetApi, PostApi } from "../../utils/api/networking";
import { AppNavigation } from "../../navigations/appNavigation";
import { Labels } from "../../utils/constants/labels";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { UsersForm_Api } from "../../utils/api/apiUrl";
import { isSuccess } from "../../utils/commonFunction/common";
import { labelRoutes } from "../../navigations/labelRoutes";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { getUserSummaryColumns } from "./userSummaryColumns";
import ResetPasswordDialog from "./resetPassword";
import SessionExpired from "../sessionExpired/sessionExpired";
import { connect } from "react-redux";

class UserSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      email: "",
      resetPassword: false,
      deleteDialog: false,
      activeDialog: false,
      userId: "",
      authorizedDialog:false,
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
  }

  componentDidMount = () => {
    this.summaryTable();
    const insertSuccess = this.props.location?.state;
    if (insertSuccess) {
      this.showToast(insertSuccess, Labels.res.success, Labels.num_1000, {
        vertical: Labels.bottom,
        horizontal: Labels.right,
      });
      window.history.replaceState({}, document.title);
    }
  };

  showToast = (message, severity = Labels.res.success, duration = Labels.num_1000, position = { vertical: Labels.bottom, horizontal: Labels.right }) => {
    this.setState({
      toast: { open: true, message, severity, duration, position },
    });
    setTimeout(() => {
      this.setState((prev) => ({ toast: { ...prev.toast, open: false } }));
    }, duration);
  };


  summaryTable = () => {
    const Url = UsersForm_Api.getUsersData;
    PostApi(Url, { userId: 0 }).then((res) => {
      console.log(res, "res");

      if (isSuccess(res)) {
        this.setState({ userData: res.data.table0 });
        console.log(res);
      }
    });
  };


  handleEditUsers = (row) => {
    PostApi( UsersForm_Api.getUsersData, { userId: row.UserId }).then((res) => {
      if (isSuccess(res)) {
        this.props.navigate(labelRoutes.userForm, { state: res.data.table0[0] });
      }
    });
  };
  handleResetPassword = (row) => {
    this.setState({ email: row.Email, resetPassword: true })
  }

  handleDeleteClick = (row) => {
    this.setState({
      deleteDialog: row.IsActive,
      activeDialog: !row.IsActive,
      userId: row.UserId,
    });
  };

  handleDelete = () => {
    PostApi(UsersForm_Api.makeInActiveUsers, { userId: this.state.userId , modifiedBy:this.props.user.UserId }).then((res) => {
      if (isSuccess(res)) {
        this.setState({ deleteDialog: false, activeDialog: false, userId: "" });
        this.showToast(res.message);
        this.summaryTable();
      }
    });
  };

  handleCancel = () => {
    this.setState({ deleteDialog: false, activeDialog: false });
  };

  // Switch toggle
  handleSwitchChange = (row, isAdmin) => {
    const url = isAdmin ? UsersForm_Api.makeAdmin : UsersForm_Api.makeAgent;
    PostApi(url, { userId: row.UserId,modifiedBy:this.props.user.UserId }).then((res) => {
      if (isSuccess(res)) {
        this.showToast(res.message);
        this.summaryTable();
      }
    });
  };

  render() {
    const columns = getUserSummaryColumns(
      this.handleEditUsers,
      this.handleResetPassword,
      this.handleSwitchChange,
      this.handleDeleteClick
    );

    return (
      <>
        <ZTable
          columns={columns}
          rows={this.state.userData}
          onHandleAdd={() => this.props.navigate(labelRoutes.userForm)}
          buttonTitle={Labels.add}
          headerLabel={Labels.userSummary}
        />

        <ZDialogueBox
          open={this.state.deleteDialog}
          onClose={this.handleCancel}
          title={Labels.deleteUser}
          labelText={Labels.makeActiveMessage}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={this.handleDelete}
        />

        <ZDialogueBox
          open={this.state.activeDialog}
          onClose={this.handleCancel}
          title={Labels.makeActive}
          labelText={Labels.deleteUserMessage}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={this.handleDelete}
        />

        <ZToasterMsg {...this.state.toast} onClose={() => this.setState({ toast: { ...this.state.toast, open: false } })} />
        <ResetPasswordDialog emailState={this.state.email} open={this.state.resetPassword} onClose={() => this.setState({ resetPassword: false })}
          updatePasswordStatus={this.showToast} readOnly={true} />
        <SessionExpired  />
      </>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.userDetails.user,
  };
};

export default AppNavigation(connect(mapStateToProps)(UserSummary));
