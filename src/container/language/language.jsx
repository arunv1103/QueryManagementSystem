import React, { Component } from "react";
import {
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../templateGroup/templateGroup.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ZTable from "../../component/ZTable/ztable";
import ZButton from "../../component/ZButton/zbutton";
import ZTypography from "../../component/ZTypography/ztypography";
import { CommonColors } from "../../utils/constants/colors";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZCheckbox from "../../component/ZCheckBox/ZCheckBox";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { PostApi } from "../../utils/api/networking";
import { Labels } from "../../utils/constants/labels";
import { allowAlphaSpace } from "../../utils/commonFunction/common";
import { Language_Api } from "../../utils/api/apiUrl";
import ZPopoverDialog from "../../component/ZDialogueBox/zdialog";
class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Form
      txt_languageName: "",
      cbl_isActive: true,
      errors: {},
      // Data
      languages: [],
      selectedLanguageId: null,
      isEditMode: false,
      // Dialogs
      showLanguageDialog: false,
      showConfirmDialog: false,
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
  }
  componentDidMount() {
    this.fetchLanguages();
  }
  showToast = (message, severity = Labels.success) => {
    this.setState({
      toast: {
        ...this.state.toast,
        open: true,
        message,
        severity,
      },
    });
  };
  handleCloseToast = () => {
    this.setState({ toast: { ...this.state.toast, open: false } });
  };
  fetchLanguages = async () => {
    try {
      const response = await PostApi(Language_Api.AddUpdateLanguage, {
        flag: Labels.flag.select,
      });
      const data = response.data.table0 || [];
      this.setState({
        languages: data.map((lang) => ({
          LanguageId: lang.LanguageId,
          LanguageName: lang.LanguageName,
          IsActive: lang.IsActive,
        })),
      });
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  //validation
  validate = () => {
    const errors = {};
    if (!this.state.txt_languageName.trim()) {
      errors.txt_languageName = Labels.required;
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };
  openLanguageDialog = (isEdit = false, lang = null) => {
    this.setState({
      showLanguageDialog: true,
      isEditMode: isEdit,
      txt_languageName: lang?.LanguageName || "",
      cbl_isActive: lang?.IsActive ?? true,
      selectedLanguageId: lang?.LanguageId || null,
      errors: {},
    });
  };
  closeLanguageDialog = () => {
    this.setState({
      showLanguageDialog: false,
      txt_languageName: "",
      cbl_isActive: true,
      selectedLanguageId: null,
      isEditMode: false,
      errors: {},
    });
  };
  handleSubmitLanguage = async () => {
    if (!this.validate()) return;
    const { txt_languageName, cbl_isActive,selectedLanguageId } =
      this.state;
    const payload = {
      LanguageId: this.state.isEditMode ? selectedLanguageId : 0,
      LanguageName: txt_languageName.trim(),
      IsActive: cbl_isActive,
      flag: this.state.isEditMode ? Labels.flag.update : Labels.flag.insert,
    };
    try {
      const response = await PostApi(Language_Api.AddUpdateLanguage, payload);
      if (response.data.table0[0].Status === Labels.flag.select) {
        this.showToast(response.data.table0[0].Message);
        this.fetchLanguages();
        this.closeLanguageDialog();
      } else {
        this.showToast(response.data.table0[0].Message, Labels.error);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  handleToggleStatus = (lang) => {
    const isActive = lang.IsActive;
    this.setState({
      showConfirmDialog: true,
      confirmTitle: isActive
        ? Labels.deactivateLanguage
        : Labels.activateLanguage,
      confirmMessage: isActive
        ? Labels.confirmDeactivateLanguage
        : Labels.confirmActivateLanguage,
      confirmCallback: () => this.confirmToggleStatus(lang),
    });
  };
  confirmToggleStatus = async (lang) => {
    try {
      const payload = {
        LanguageId: lang.LanguageId,
        flag: lang.IsActive ? Labels.flag.delete : Labels.flag.active,
        ModifiedBy: 1,
      };
      const response = await PostApi(Language_Api.AddUpdateLanguage, payload);
      if (response.data.table0[0].Status === Labels.flag.select) {
        this.showToast(response.data.table0[0].Message);
        this.fetchLanguages();
        this.setState({ showConfirmDialog: false });
      } else {
        this.showToast(response.data.table0[0].Message, Labels.error);
      }
    } catch (error) {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    }
  };
  render() {
    const {
      isEditMode,
      languages,
      toast,
      showConfirmDialog,
      confirmTitle,
      confirmMessage,
    } = this.state;
    return (
      <Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <ZTable
            rows={languages}
            columns={[
              {
                field: Labels.languageNameField,
                headerName: Labels.language,
                renderCell: ({ row }) => (
                  <Tooltip title={Labels.edit}>
                    <Box
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
                        pointerEvents: row.IsActive ? Labels.auto : Labels.none,
                      }}
                      onClick={() =>
                        row.IsActive && this.openLanguageDialog(true, row)
                      }
                    >
                      {row.LanguageName}
                    </Box>
                  </Tooltip>
                ),
              },
              {
                field: Labels.isActiveField,
                headerName: Labels.active,
                renderCell: ({ row }) => (
                  <Tooltip
                    title={row.IsActive ? Labels.deActivate : Labels.activate}
                  >
                    <IconButton onClick={() => this.handleToggleStatus(row)}>
                      {row.IsActive ? (
                        <DeleteIcon sx={{ fontSize: 20 }} color="error" />
                      ) : (
                        <EditIcon sx={{ fontSize: 20 }} color="disabled" />
                      )}
                    </IconButton>
                  </Tooltip>
                ),
              },
            ]}
            showAdd
            onHandleAdd={() => this.openLanguageDialog()}
            headerLabel={Labels.languageSummary}
            tableWidth={Labels.fourHundredPixel}
          />
        </Box>
        {/* Language Dialog */}
        <ZPopoverDialog
          position={this.state.position || { top: 100, left: 200 }}
          open={this.state.showLanguageDialog}
          onClose={this.closeLanguageDialog}
          fullWidth
          maxWidth="xs"
        >
          <div className="grp-config-wrapper">
            <div className="grp-config-header">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ZTypography
                  flag={Labels.header}
                  color={CommonColors.black}
                  labelText={
                    isEditMode ? Labels.editLanguage : Labels.addLanguage
                  }
                />
                <IconButton onClick={this.closeLanguageDialog}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </div>
            <div className="grp-config-field">
              <ZTextField
                label={Labels.languageName}
                value={this.state.txt_languageName}
                onChange={(e) => {
                  const value = e.target.value;
                  this.setState((prevState) => ({
                    txt_languageName: value,
                    errors: {
                      ...prevState.errors,
                      txt_languageName:
                        value.trim() === "" ? Labels.required : "",
                    },
                  }));
                }}
                disabled={!this.state.cbl_isActive}
                onKeyPress={allowAlphaSpace}
                maxLength={20}
                error={this.state.errors.txt_languageName}
                helperText={this.state.errors.txt_languageName}
              />
            </div>
            <div className="grp-config-toggle">
              <ZCheckbox
                label={Labels.isActive}
                checked={this.state.cbl_isActive}
                onChange={(val) => this.setState({ cbl_isActive: val })}
              />
            </div>
            <div className="grp-config-action">
              <ZButton
                variant="contained"
                onClick={
                  this.handleSubmitLanguage
                }
              >
                {isEditMode ? Labels.update : Labels.submit}
              </ZButton>
            </div>
          </div>
        </ZPopoverDialog>
        {/* Confirm Dialog */}
        <ZDialogueBox
          open={showConfirmDialog}
          title={confirmTitle}
          labelText={confirmMessage}
          onClose={() => this.setState({ showConfirmDialog: false })}
          onConfirm={() => {
            if (this.state.confirmCallback) this.state.confirmCallback();
          }}
        />
        {/* Toast */}
        <ZToasterMsg
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          duration={toast.duration}
          position={toast.position}
          onClose={this.handleCloseToast}
        />
      </Box>
    );
  }
}
export default Language;