import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import { GetApi, PostApi } from "../../utils/api/networking";
import { AppNavigation } from "../../navigations/appNavigation";
import { Labels } from "../../utils/constants/labels";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ApiUrl } from "../../utils/api/apiUrl";
import { maskEmail, maskMobile } from "../../utils/commonFunction/common";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { labelRoutes } from "../../navigations/labelRoutes";
import { he } from "date-fns/locale";

class OrganisationSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisationList: [],
      deleteDialog: false,
      activeDialog: false,
      organisationId: null,
      languageMap: {},
      timeZoneMap: {},
      languageOptions: [],
      timeZoneOptions: [],
      toaster: {
        open: false,
        message: "",
        severity: "",
      },
    };
  }

  fetchDropdownData = async () => {
    try {
      const response = await GetApi(ApiUrl.GetDropdownOrganisation);
      const result = response.data;   

      if (result.status === Labels.flag.select) {
        const languageMap = {};
        result.data.table0.forEach((item) => {
          languageMap[item.LanguageId] = item.LanguageName;
        });

        const timeZoneMap = {};
        result.data.table1.forEach((item) => {
          timeZoneMap[item.TimeZoneId] = item.TimeZoneName;
        });

        this.setState({ languageMap, timeZoneMap });
      } else {
        this.showToaster(
          result.message || "Failed to load dropdown data",
          Labels.error
        );
      }
    } catch (error) {
      console.error("Dropdown API error:", error);
      this.showToaster("Error loading dropdown options", Labels.error);
    }
  };

  showToaster = (message, severity = Labels.success) => {
    this.setState({
      toaster: {
        open: true,
        message,
        severity,
      },
    });
  };

  handleToasterClose = () => {
    this.setState((prevState) => ({
      toaster: {
        ...prevState.toaster,
        open: false,
      },
    }));
  };

  componentDidMount() {
    this.fetchOrganisation();
    this.fetchDropdownData();
  }

  fetchOrganisation = async () => {
    try {
      const response = await GetApi(ApiUrl.GetOrganisation);
      console.log(response, "red");

      if (
        response.data?.status === Labels.flag.select &&
        response.data?.data?.table0?.length
      ) {
        this.setState({ organisationList: response.data.data.table0 });
      } else {
        this.showToaster("Failed to load organisation list", Labels.error);
      }
    } catch (error) {
      this.showToaster("Failed to load organisation list", Labels.error);
    }
  };

  handleEditOrganisation = (row) => {
    setTimeout(() => {
      this.props.navigate(labelRoutes.organization, {
        state: {
          OrganisationId: row.OrganisationId,
        },
      });
    }, 100);
  };

  handleDeleteClick = (row) => {
    if (row.IsActive) {
      this.setState({ deleteDialog: true, organisationId: row.OrganisationId });
    } else {
      this.setState({ activeDialog: true, organisationId: row.OrganisationId });
    }
  };

  handleDelete = (shouldDeactivate) => {
    const flag = shouldDeactivate ? "D" : "A";
    const data = {
      organisationId: this.state.organisationId,
      flag: flag,
    };

    PostApi(ApiUrl.AddUpdateDeleteOrganisation, data).then((res) => {

      if (res.status === Labels.flag.select) {
        this.setState({
          deleteDialog: false,
          activeDialog: false,
          organisationId: null,
        });
        this.showToaster(res.message)
        this.fetchOrganisation();
      }
    });
  };

  handleCancel = () => {
    this.setState({ deleteDialog: false, activeDialog: false });
  };

  render() {
    const columns = [
      {
        headerName: "Organisation Name",
        renderCell: ({ row }) => (
          <span
            title={
              typeof row.OrganisationName === "string"
                ? row.OrganisationName
                : ""
            }
            style={{
              color: row.IsActive ? Labels.zTable.blue : Labels.zTable.gray,
              textDecoration: row.IsActive ? Labels.underline : Labels.none,
              cursor: row.IsActive ? Labels.cursor.pointer : Labels.not_allowed,
              pointerEvents: row.IsActive ? Labels.auto : Labels.none,
            }}
            onClick={() => this.handleEditOrganisation(row)}
          >
            {typeof row.OrganisationName === "object"
              ? JSON.stringify(row.OrganisationName)
              : row.OrganisationName || "-"}
          </span>
        ),
      },
      {
        headerName: " Website",
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
            {row.Website}
          </span>
        ),
      },
      {
        headerName: "Email ID",
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
            {maskEmail(row.EmailId)}
          </span>
        ),
      },


      {
        headerName: "Mobile No",
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
            {maskMobile(row.MobileNo)}
          </span>
        ),
      },
      {
        headerName: "Time Zone",
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
            {this.state.timeZoneMap[row.TimeZoneId] || "-"}</span>
        ),
      },

      {
        headerName: "Language",
        renderCell: ({ row }) => (
          <span style={{ color: row.IsActive ? Labels.zTable.inherit : Labels.zTable.gray }}>
            {typeof this.state.languageMap[row.LanguageId] === "string"
              ? this.state.languageMap[row.LanguageId]
              : "-"}
          </span>
        ),
      },

      {
        headerName: "Active",
        renderCell: ({ row }) => (
          <Tooltip
            title={row.IsActive ? "Click to Deactivate" : "Click to Activate"}
          >
            <IconButton
              onClick={() => this.handleDeleteClick(row)}
              color={row.IsActive ? "success" : "error"}
            >
              {row.IsActive ? (
                <DeleteIcon sx={{ fontSize: 20 }} color="error" />
              ) : (
                <EditIcon sx={{ fontSize: 20 }} color="disabled" />
              )}
            </IconButton>
          </Tooltip>
        ),
      },
    ];

    return (
      <>
        <ZTable
          columns={columns}
          rows={this.state.organisationList}
          onHandleAdd={() => this.props.navigate(labelRoutes.organization)}
          headerLabel={Labels.Organisation_Summary}
          // labelText="Organisation"
          // onHandleAdd={() => this.props.navigate("/organisation")}
          // headerLabel="Organisation Summary"
          showAdd={true}
        />

        <ZDialogueBox
          open={this.state.deleteDialog}
          onClose={this.handleCancel}
          title="Deactivate Organisation"
          labelText="Are you sure you want to deactivate this organisation?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => this.handleDelete(true)}
          icon={<i className="fas fa-trash" />}
          disableBackdropClick={true}
        />

        <ZDialogueBox
          open={this.state.activeDialog}
          onClose={this.handleCancel}
          title="Activate Organisation?"
          labelText="Are you sure you want to activate this organisation?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => this.handleDelete(false)}
          icon={<i className="fas fa-check" />}
          disableBackdropClick={true}
        />
        <ZToasterMsg
          open={this.state.toaster.open}
          duration={5000}
          onClose={this.handleToasterClose}
          position={{ vertical: "bottom", horizontal: "right" }}
          severity={this.state.toaster.severity}
          message={this.state.toaster.message}
        />
      </>
    );
  }
}

export default AppNavigation(OrganisationSummary);
