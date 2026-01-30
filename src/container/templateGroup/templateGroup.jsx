import React, { Component } from 'react'
import ZSelectBox from '../../component/ZSelectBox/zselectBox';
import ZCard from '../../component/ZCard/zcard';
import ZTypography from '../../component/ZTypography/ztypography';
import { Labels } from '../../utils/constants/labels';
import "../templateGroup/templateGroup.css";
import ZPopoverDialog from '../../component/ZDialogueBox/zdialog';
import { Button, IconButton, THEME_ID, Tooltip } from '@mui/material';
import ZButton from '../../component/ZButton/zbutton';
import ZTextField from '../../component/ZTextField/ztextfield';
import ZCheckBox from '../../component/ZCheckbox/zcheckbox';
import { TemplateGroup_Api, UsersForm_Api } from '../../utils/api/apiUrl';
import { GetApi, PostApi } from '../../utils/api/networking';
import ZDropdown from '../../component/ZDropdown/zdropdown';
import { allowOnlyAlphabets, isSuccess } from '../../utils/commonFunction/common';
import ZTable from '../../component/ZTable/ztable';
import { labelRoutes } from '../../navigations/labelRoutes';
import { AppNavigation } from '../../navigations/appNavigation';
import { CommonColors } from '../../utils/constants/colors';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ZDialogueBox from '../../component/ZDialogueBox/zdialogueBox';
import ZToasterMsg from '../../component/ZToasterMessage/ztoasterMessage';
import { connect } from 'react-redux';


class TemplateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: false,
      activeDialog: false,
      open: false,
      position: null,
      txt_TemplateGroupName: "",
      txt_Language: "",
      cbl_IsActive: true,
      languageValues: [],
      templateGroupList: [],
      templateGroupId: "",
      selectedIndex: 0,
      selectedItem: "",
      templateList: [],
      update: false,
      toastOpen: false,
      toastMsg: "",
      toastSeverity: Labels.success,
      errors: {}
    };
  }

  componentDidMount = () => {
    this.pageLoad();
  }
  pageLoad = () => {
    this.getTemplateGroup();
    this.dropdownValues();
    this.getTemplateList()
    const message = this.props.location?.state
    if (message) {
      this.setState({
        toastOpen: true,
        toastMsg: message,
        toastSeverity: Labels.success,
      })
      window.history.replaceState({}, document.title);
    }
  }

  //template group
  getTemplateGroup = async () => {
    const url = TemplateGroup_Api.templateGroupCRUD;
    try {
      const data = {
        flag: Labels.flag.select,
      };
      const response = await PostApi(url, data);
      if (isSuccess(response)) {
        this.setState({
          templateGroupList: response.data.table0 || [],
          txt_TemplateGroupName: "",
          txt_Language: "",
          cbl_IsActive: true,
          selectedItem: response.data.table0[0]?.TemplateGroupId || "",
        }, () => {
          this.getTemplateList();
        });
      }
    } catch (error) {
      console.error("Error during getting template group:", error);
    }
  }
  getTemplateList = async () => {
    const url = TemplateGroup_Api.templateListCRUD;
    const payload = {
      flag: Labels.flag.select,
      templateGroupId: this.state.selectedItem,
    }
    console.log("Payload for getting template list:", payload);

    try {
      const response = await PostApi(url, payload);
      if (isSuccess(response)) {
        console.log(response, "response");
        this.setState({
          templateList: response.data.table0 || [],
        });
      }
    } catch (error) {
      console.error("Error during getting template list:", error);
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  }
  openPopover = (e) => {
    this.setState({ position: ({ top: e.clientY, left: e.clientX }), open: true, update: false });
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropdownValues = async () => {
    try {
      const res = await GetApi(UsersForm_Api.getMasters);
      const laguageValues = res.data.data.table2 || [];
      this.setState({
        languageValues: laguageValues,
      });
    } catch (error) {
      console.log("Dropdown fetch failed:", error);
    }
  }
  handleSelect = (index, item) => {
    this.setState(
      { selectedIndex: index, selectedItem: item.TemplateGroupId },
      () => { this.getTemplateList() }
    );
  }
  validate = () => {
    const errors = {};

    if (!this.state.txt_TemplateGroupName.trim()) {
      errors.txt_TemplateGroupName = Labels.required;
    }
    else {
      errors.txt_TemplateGroupName = "";
    }
    if (!this.state.txt_Language) {
      errors.txt_Language = Labels.required;
    }
    else {
      errors.txt_Language = "";
    }

    this.setState({ errors });
    return Object.values(errors).every((val) => val.trim() == "");

  }
  handleEditGroup = (item, e) => {
    this.openPopover(e);
    this.setState({
      txt_TemplateGroupName: item.TemplateGroupName,
      txt_Language: item.Language,
      cbl_IsActive: item.IsActive,
      templateGroupId: item.TemplateGroupId,
      update: true
    })
  }
  handleOpenGroup = (e) => {
    this.openPopover(e);
    this.setState({
      txt_TemplateGroupName: "",
      txt_Language: "",
    })
  }


  handleSubmit = async (isSumbit) => {
    const isValid = this.validate();
    if (!isValid) return;
    const url = TemplateGroup_Api.templateGroupCRUD;
    const flagvalue = isSumbit ? Labels.flag.insert : Labels.flag.update;
    try {
      const data = {
        flag: flagvalue,
        ...(flagvalue === Labels.flag.update && { templateGroupId: this.state.templateGroupId }),
        templateGroupName: this.state.txt_TemplateGroupName,
        language: this.state.txt_Language,
        isActive: this.state.cbl_IsActive,
        ...(isSumbit ? { createdBy: this.props.user.UserId } : { modifiedBy: this.props.user.UserId }
        )
      };
      const response = await PostApi(url, data);

      if (isSuccess(response)) {
        this.setState({
          txt_TemplateGroupName: "",
          txt_Language: "",
          cbl_IsActive: true,
          errors: {},
          toastOpen: true,
          toastMsg: response.message,
          toastSeverity: Labels.success,
        });
        this.handleClose();
        this.getTemplateGroup();
      }
      else {
        this.setState({
          errors: {},
          toastOpen: true,
          toastMsg: response.message,
          toastSeverity: "error",
        });
      }
    } catch (error) {
      console.error("Error during template submission:", error);
    }
  }

  handleCancel = () => {
    this.setState({ deleteDialog: false, activeDialog: false });
  };

  //toast close fuction

  handleToastClose = () => {
    this.setState({ toastOpen: false });
  };


  handleDelete = async () => {
    const Url = TemplateGroup_Api.templateListCRUD;
    {
      const data = {
        flag: Labels.flag.delete,
        id: this.state.templateGroupId,
      };
      PostApi(Url, data).then((res) => {
        if (isSuccess(res)) {
          this.setState({
            activeDialog: false, deleteDialog: false, templateGroupId: "", toastOpen: true,
            toastMsg: res.message,
            toastSeverity: Labels.success,
          }, () => { this.getTemplateList() })
        }
      });

    }
  }
  navigateToEditList = (row) => {
    this.props.navigate(labelRoutes.templateGroupAdd, {
      state: {
        listData: row,
        update: true,
        templateGroupId: this.state.selectedItem
      }
    });
  };

  render() {
    const columns = [

      {
        field: Labels.templateName,
        headerName: Labels.templates,
        renderCell: ({ row }) => (
          <Tooltip title={Labels.edit}>
            <span
              style={{
                color: row.IsActive ? CommonColors.zTable.blue : CommonColors.zTable.inherit,
                textDecoration: row.IsActive ? Labels.underline : Labels.none,
                cursor: row.IsActive ? Labels.cursor.pointer : Labels.not_allowed,
                pointerEvents: row.IsActive ? Labels.auto : Labels.none,
              }}
              onClick={() => row.IsActive && this.navigateToEditList(row)}
            >
              {row.TemplateName}
            </span>
          </Tooltip>
        ),
      },
      {
        field: Labels.templateDisc,
        headerName: Labels.discription,
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? CommonColors.zTable.gray : CommonColors.zTable.inherit }}>
            {row.TemplateDescription}
          </span>
        ),
      },
      {
        field: Labels.isActive,
        headerName: Labels.active,
        renderCell: ({ row }) => (
          <Tooltip title={row.IsActive ? Labels.clickToDeActivate : Labels.clickToActivate}>
            <IconButton
              onClick={() =>
                row.IsActive
                  ? this.setState({ deleteDialog: true, templateGroupId: row.Id })
                  : this.setState({ activeDialog: true, templateGroupId: row.Id })
              }
              color={row.IsActive ? Labels.success : Labels.error}
            >
              {row.IsActive ? <DeleteIcon sx={{ fontSize: 20 }} color={Labels.error} /> : <EditIcon sx={{ fontSize: 20 }} color="disabled" />}
            </IconButton>
          </Tooltip>
        ),
      },
    ]
    return (
      <React.Fragment>
        <ZCard title={Labels.templateGroup}>
          <div className="select-box-container">
            <div className="select-box-inner">
              {this.state.templateGroupList.map((item, index) => {
                const isSelected = this.state.selectedIndex === index;
                return <ZSelectBox
                  defaultSelected={isSelected}
                  label={item.TemplateGroupName}
                  isEditing={isSelected}
                  handleEditGroup={(e) => this.handleEditGroup(item, e)}
                  onSelect={() => this.handleSelect(index, item)}
                />

              })}

              <ZButton
                onClick={this.handleOpenGroup}
                variant={Labels.outlined}
                style={{ marginLeft: 10 }}
              >
                {Labels.add}
              </ZButton>
            </div>
          </div>
          <ZTable
            headerLabel={Labels.templates}
            onHandleAdd={() => this.props.navigate(labelRoutes.templateGroupAdd, { state: { listData: this.state.selectedItem, update: false } })}
            rows={this.state.templateList} columns={columns}
          />
        </ZCard>


        <ZPopoverDialog open={this.state.open} position={this.state.position} onClose={this.handleClose}>
          <div className="grp-config-wrapper">
            <div className="grp-config-header">
              <ZTypography
                flag={Labels.header}
                color={CommonColors.black}
                weight={Labels.semiBold}
                labelText={Labels.templateGroup}
              />
            </div>

            <div className="grp-config-field">
              <ZTextField
                name={Labels.txt_TemplateGroupName}
                label={Labels.templateGroupName}
                value={this.state.txt_TemplateGroupName}
                autoFocus
                onChange={(e) =>
                  this.setState({
                    txt_TemplateGroupName: allowOnlyAlphabets(e.target.value),
                    errors: { ...this.state.errors, txt_TemplateGroupName: '' },
                  })
                }
                helperText={this.state.errors.txt_TemplateGroupName}
                disabled={!this.state.cbl_IsActive}
                maxLength={50}
              />
            </div>

            <div className="grp-config-field">
              <ZDropdown
                name={Labels.txt_Language}
                label={Labels.language}
                options={this.state.languageValues.map((item) => ({
                  label: item.LanguageName,
                  value: item.Language
                }))}
                value={this.state.txt_Language}
                onChange={(e) =>
                  this.setState({
                    txt_Language: e.target.value,
                    errors: { ...this.state.errors, txt_Language: '' },
                  })
                }
                helperText={this.state.errors.txt_Language}
                disabled={!this.state.cbl_IsActive}
              />
            </div>

            <div className="grp-config-toggle">
              <ZCheckBox
                name={Labels.isActive}
                checked={this.state.cbl_IsActive}
                onChange={(val) => this.setState({ cbl_IsActive: val })}
                label={Labels.isActive}
              />
            </div>

            <div className="grp-config-action">
              {!this.state.update ? (
                <ZButton label={Labels.submit} onClick={() => this.handleSubmit(true)} />
              ) : (
                <ZButton label={Labels.update} onClick={() => this.handleSubmit(false)} />
              )}
            </div>
          </div>


        </ZPopoverDialog>

        <ZDialogueBox
          open={this.state.deleteDialog}
          onClose={this.handleCancel}
          title={Labels.deleteUser}
          labelText={Labels.makeActiveMessage}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={() => this.handleDelete(true)}
        />
        <ZDialogueBox
          open={this.state.activeDialog}
          onClose={this.handleCancel}
          title={Labels.makeActive}
          labelText={Labels.deleteUserMessage}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={() => this.handleDelete(false)}
        />
        <ZToasterMsg
          open={this.state.toastOpen}
          message={this.state.toastMsg}
          severity={this.state.toastSeverity}
          onClose={this.handleToastClose}
          duration={1000}
          position={{ vertical: "bottom", horizontal: "right" }}
        />

      </React.Fragment>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.userDetails.user,
  };
};

export default AppNavigation(connect(mapStateToProps)(TemplateGroup));
