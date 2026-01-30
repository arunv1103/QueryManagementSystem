import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import { PostApi, GetApi } from "../../utils/api/networking";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { Labels } from "../../utils/constants/labels";
import { TemplateVar_Api, Master_Api} from "../../utils/api/apiUrl";
import { AppNavigation } from "../../navigations/appNavigation";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZButton from "../../component/ZButton/zbutton";
import  ZCheckbox  from "../../component/ZCheckBox/ZCheckBox";
import { CommonColors } from "../../utils/constants/colors";
import { allowAlphaSpace, isNotEmpty } from "../../utils/commonFunction/common";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import "../../component/ZCard/zcard.css"

class TemplateVariableSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateVariables: [],
      formData: {
        varName: "",
        varTypeId: "",
        varValue: "",
        isActive: true,
      },
      errors: {
        varName: "",
        varTypeId: "",
        varValue: "",
      },
      showVariableDialog: false,
       varTypeOptions: [],
      isEditMode: false,
      selectedId: null,
      deleteDialog: false,
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
    this.fetchTemplateVariables();
    this.fetchVarTypes();
  }

  fetchVarTypes = () => {
  GetApi(Master_Api.GetVartypeDropdownValue)
    .then((res) => {
      if (res.status === Labels.flag.select) {
        console.log(res.data.data.table0);
        const options = (res.data.data.table0 || []).filter(
          (item) => item && Object.keys(item).length > 0
        ).map(item => ({
          label: item.VartypeName,  
          value: String(item.VartypeId)    
        }));
        this.setState({ varTypeOptions: options });
      } else {
        this.showToast(res.message || Labels.fetchError, Labels.error);
      }
    })
    .catch(() => {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    })
};


fetchTemplateVariables = () => {
  GetApi(TemplateVar_Api.GetTemplateVariables, {})
    .then((res) => {
      if (res.status === Labels.flag.select) {
        const validRows = (res.data.data.table0 || []).filter(
          (item) => item && Object.keys(item).length > 0
        );
        const templateVariables = validRows.map((item) => {
        
          let varTypeName = "-";
          if (isNotEmpty(item.VartypeName)) {
            if (typeof item.VartypeName === "object") {
              varTypeName = Object.keys(item.VartypeName).length > 0 
                ? JSON.stringify(item.VartypeName) 
                : "-";
            } else {
              varTypeName = item.VartypeName;
            }
          }

        
          let varValue = "-";
          if (isNotEmpty(item.VarValue)) {
            varValue = typeof item.VarValue === "object" 
              ? (Object.keys(item.VarValue).length === 0 ? "-" : JSON.stringify(item.VarValue))
              : item.VarValue;
          }

         
          let createdBy = "-";
          if (isNotEmpty(item.CreatedBy)) {
            createdBy = typeof item.CreatedBy === "object"
              ? (Object.keys(item.CreatedBy).length === 0 ? "-" : JSON.stringify(item.CreatedBy))
              : String(item.CreatedBy);
          }

          return {
            id: item.TMPLVarNameId || 0,
            varName: item.TMPLVarName || "-",
            varTypeName: item.VarTypeName, // This is what displays in your table
            varValue: varValue,
            vartypeID:item.VartypeId,
            lastUpdated: item.LastUpdated || "-",
            createdBy: createdBy,
            isActive: item.IsActive || false,
          };
        });

        this.setState({ templateVariables });
      } else {
        this.setState({ templateVariables: [] });
        this.showToast(res.message || Labels.fetchError, Labels.error);
      }
    })
    .catch(() => {
      this.setState({ templateVariables: [] });
      this.showToast(Labels.catchErrorMsg, Labels.error);
    });
};

  showToast = (message, severity = Labels.success, duration = 3000) => {
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

  handleAddVariable = () => {
    this.setState({
      showVariableDialog: true,
      isEditMode: false,
      formData: {
        varName: "",
        varType: "",
        varValue: "",
        isActive: true,
      },
      errors: {
        varName: "",
        varType: "",
        varValue: "",
      },
    });
  };

  handleEdit = (row) => {
    console.log("Editing row:", row);
console.log("Current formData:", this.state.formData);
    this.setState({
      showVariableDialog: true,
      isEditMode: true,
      selectedId: row.id,
      formData: {
        varName: row.varName,
        varTypeId: row.vartypeID, 
        varTypeName: row.varTypeName,
        varValue: row.varValue,
        isActive: row.isActive,
      },
      
      errors: {
        varName: "",
        varType: "",
        varValue: "",
      },
    });
  };

  handleDeleteClick = (row) => {
    this.setState({ 
      deleteDialog: true, 
      selectedId: row.id,
      formData: {
        ...this.state.formData,
        isActive: row.isActive 
      }
    });
  };

  handleDelete = () => {
  const { selectedId } = this.state;
  const { isActive } = this.state.formData;
  const flag = isActive ? Labels.flag.delete : Labels.flag.active;

  const payload = {
    flag: flag,  
    tmplVarNameId: selectedId,
    modifiedBy: 1,  
    isActive: !isActive 
  };
  PostApi(TemplateVar_Api.AddUpdateDeleteTemplateVariable, payload)
    .then((res) => {
      if (res.data.table0[0].Status === Labels.flag.select) {  
        this.setState({ 
          deleteDialog: false, 
          selectedId: null,
          formData: {
            ...this.state.formData,
            isActive: !isActive 
          }
        });
        this.showToast(res.data.table0[0].Message,Labels.success);
        this.fetchTemplateVariables();
      } else {
        this.showToast(res.data.table0[0].Message, Labels.error);
      }
    })
    .catch(() => {
      this.showToast(Labels.catchErrorMsg, Labels.error);
    });
};

  handleCancel = () => {
    this.setState({ 
      deleteDialog: false, 
      selectedId: null,
      formData: {
        ...this.state.formData,
        isActive: true 
      }
    });
  };

  closeVariableDialog = () => {
    this.setState({ 
      showVariableDialog: false,
      formData: {
        varName: "",
        varTypeId: "",
        varValue: "",
        isActive: true,
      },
      errors: {
        varName: "",
        varTypeId: "",
        varValue: "",
      },
      selectedId: null,
      isEditMode: false,
    });
  };


validateForm = () => {
  const { varName, varTypeId, varValue } = this.state.formData;
  const errors = {};

  if (!varName.trim()) {
    errors.varName = Labels.required;
  }
 
  if (!varTypeId) {
    errors.varTypeId = Labels.required;
  }
  
  if (!varValue.trim()) {
    errors.varValue = Labels.required;
  }

  this.setState({ errors });
  return Object.keys(errors).length === 0;
};

handleFieldChange = (e) => {
  const { name, value, type, checked } = e.target;
  const updatedValue = type === Labels.checkbox ? checked : value;
  
  let error = "";
  if (!updatedValue) {
    error = Labels.required;
  }

  this.setState(prev => ({
    formData: {
      ...prev.formData,
      [name]: updatedValue
    },
    errors: {
      ...prev.errors,
      [name]: error
    }
  }));
};

  handleSubmitVariable = () => {
    if (!this.validateForm()) return;

    const { isEditMode, selectedId, formData } = this.state;
    const flag = isEditMode ? Labels.flag.update : Labels.flag.insert;
    const payload = {
        tmplVarNameId: isEditMode ? selectedId : 0,
        tmplVarName: formData.varName,
        vartypeId: formData.varTypeId, 
        varValue: formData.varValue,
        isActive: formData.isActive,
        modifiedBy:1,
        createdBy:"",        
        flag: flag,
    };
    console.log(payload,"dsfsdf");
    

    PostApi(TemplateVar_Api.AddUpdateDeleteTemplateVariable, payload)
      .then((res) => {
        if (res.data.table0[0].Status === Labels.res.status) {
          this.showToast(res.data.table0[0].Message);
          this.closeVariableDialog();
          this.fetchTemplateVariables();
        } else {
          this.showToast(res.data.table0[0].Message, Labels.error);
        }
      })
      .catch(() => {
        this.showToast(Labels.catchErrorMsg, Labels.error);
      });
  };

  render() {
    const columns = [
      {
        field: Labels.varnameField,
        headerName: Labels.varnameHeader,
        renderCell: ({ row }) => (
          <Tooltip title={Labels.edit}>
            <span
              style={{
                color: row.isActive ? Labels.zTable.blue : Labels.zTable.gray,
                textDecoration: row.isActive ? Labels.underline : Labels.none,
                cursor: row.isActive ? Labels.cursor.pointer : Labels.not_allowed,
                pointerEvents: row.isActive ? Labels.auto : Labels.none,
              }}
              onClick={() => row.isActive && this.handleEdit(row)}
            >
              {row.varName}
            </span>
          </Tooltip>
        ),
      },
      { 
        field: Labels.vartypeField, 
        headerName: Labels.vartypeHeader,
         renderCell: ({ row }) => (
      <span style={{ color: row.isActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
        {row.varTypeName}
      </span>
    ),
      },
      { 
        field: Labels.varvalueField, 
        headerName: Labels.varvalueHeader,
         renderCell: ({ row }) => (
      <span style={{ color: row.isActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
        {row.varValue}
      </span>
         ),
      },
      { 
        field: Labels.lastupdateField, 
        headerName: Labels.lastupdateHeader,
         renderCell: ({ row }) => {
      const formattedDate = row.lastUpdated
        ? dayjs(row.lastUpdated).format("DD MMM YY [at] HH:mm")
        : "";
      return (
        <span style={{ color: row.isActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
          {formattedDate}
        </span>
      );
    },
      },
      { 
        field: Labels.createdByField, 
        headerName: Labels.createdByHeader,
         renderCell: ({ row }) => (
      <span style={{ color: row.isActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
        {row.createdBy}
      </span>),
      },
      {
        field: Labels.isActive,
        headerName: Labels.actions,
        renderCell: ({ row }) => (
          <Tooltip title={row.isActive ? Labels.deActivate : Labels.activate}>
            <IconButton onClick={() => this.handleDeleteClick(row)}>
              {row.isActive ? (
                <DeleteIcon sx={{ fontSize: 20}}  color={Labels.error}/>
              ) : (
                <EditIcon sx={{ fontSize: 20 }} color={Labels.disabled} />
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
          rows={this.state.templateVariables}
          onHandleAdd={this.handleAddVariable}
          headerLabel={Labels.templateVariable}
          showAdd={true}
        />

        {/* Add/Edit Variable Dialog */}
        <Dialog
          open={this.state.showVariableDialog}
          onClose={this.closeVariableDialog}
          maxWidth="xs"
        >
          {/* Header with Title and Close Icon */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <DialogTitle sx={{ fontSize: Labels.medium ,mt:2}}>
              <p className="zcard-title"> {this.state.isEditMode ? Labels.editTemplateVariable : Labels.addTemplateVarible}</p>
            </DialogTitle>
            <IconButton onClick={this.closeVariableDialog} sx={{mr:1.5,mt:1.5}}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Dialog Content */}
          <DialogContent sx={{ paddingTop: 1.5 }}>
            {/* Var Name Field */}
            <div className="flex flex-col gap-5 w-90">
            <ZTextField
              label={`${Labels.varnameHeader}*`}
              name={Labels.varnameField}
              value={this.state.formData.varName}
              onChange={this.handleFieldChange}
              onKeyPress={allowAlphaSpace}
              error={!!this.state.errors.varName}
              disabled={!this.state.formData.isActive}
              helperText={this.state.errors.varName}
              maxLength={40}
            />

            {/* Var Type Dropdown */}
            <ZDropdown
            name={Labels.vartypeField}
            label={`${Labels.vartypeHeader}*`}
            options={this.state.varTypeOptions}
            value={this.state.formData.varTypeId}
            onChange={this.handleFieldChange}
            error={!!this.state.errors.varTypeId}
            helperText={this.state.errors.varTypeId}
            disabled={!this.state.formData.isActive}
            loading={this.state.isLoading}
            />

            {/* Var Value TextArea */}
            <ZTextField
              label={`${Labels.varvalueHeader}*`}
              name={Labels.varvalueField}
              value={this.state.formData.varValue}
              onChange={this.handleFieldChange}
              multiline
              error={!!this.state.errors.varValue}
              helperText={this.state.errors.varValue}
              disabled={!this.state.formData.isActive}
              maxLength={140}
            />

            {/* Is Active Checkbox */}
            <ZCheckbox
              label={Labels.isActive}
              checked={this.state.formData.isActive}
              onChange={(val) => this.setState(prev => ({
                formData: {
                  ...prev.formData,
                  isActive: val,
                }
              }))}
            />
            </div>
          </DialogContent>
          {/* Dialog Actions */}
          <DialogActions sx={{ paddingBottom: 4, paddingRight: 3,mt:-6 }}>
            <ZButton
              variant={Labels.variant.contained}
              onClick={this.handleSubmitVariable}
            >
              {this.state.isEditMode ? Labels.update : Labels.submit}
            </ZButton>
          </DialogActions>
        </Dialog>
        <ZDialogueBox
          open={this.state.deleteDialog}
          onClose={this.handleCancel}
          title={this.state.formData.isActive ? Labels.deactivateVariable : Labels.activateVariable}
          labelText={this.state.formData.isActive ? Labels.deactivateConfirmVariable : Labels.activateConfirmVariable}
          confirmText={Labels.yes}
          cancelText={Labels.no}
          onConfirm={this.handleDelete}
        />

        <ZToasterMsg
          open={this.state.toast.open}
          message={this.state.toast.message}
          duration={this.state.toast.duration}
          position={this.state.toast.position}
          onClose={() => this.setState({ toast: { ...this.state.toast, open: false } })}
        />
      </React.Fragment>
    );
  }
}

export default AppNavigation(TemplateVariableSummary);
