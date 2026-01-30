import React, { Component } from "react";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZDropdown from "../../component/ZDropdown/zdropdown";
import ZCheckbox from "../../component/ZCheckBox/ZCheckBox";
import ZButton from "../../component/ZButton/zbutton";
import { AppNavigation } from "../../navigations/appNavigation";
import { Labels } from "../../utils/constants/labels";
import { GetApi, PostApi } from "../../utils/api/networking";
import "../../App.css";
import ZCard from "../../component/ZCard/zcard";
import { ApiUrl } from "../../utils/api/apiUrl";
import {
  isNotEmpty,
  isValidEmail,
  isValidMobile,
  allowOnlyNumbers,
  allowOnlyAlphabets,
  getfield,
  allowAlphaSpace,
  allowEmailCharsOnly,
  isValidWebsite,
  validNumber,
} from "../../utils/commonFunction/common";
import { saveOrganisationDetails } from "../../redux/action/Organisation/organisation";
import { connect } from "react-redux";
import { IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import { Button } from "@mui/material";
import { labelRoutes } from "../../navigations/labelRoutes";

class Organisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt_organisationName: "",
      txt_website: "",
      txt_emailId: "",
      txt_mobileNo: "",
      ddl_languageId: "",
      ddl_timeZoneId: "",
      languageOptions: [],
      timeZoneOptions: [],
      chooseLogo: "",
      chooseFavicon: "",
      chooseLogoFileName: "",
      chooseFaviconFileName: "",
      txt_logoLink: "",
      logo_name: "",
      favicon_name: "",
      cb_isActive: true,
      cb_isVisible: true,
      errors: {},
      isLoading: false,
      toaster: {
        open: false,
        message: "",
        severity: "",
      },
    };
  }

  validateFields = () => {
    const errors = {};

    const requiredFields = [
      Labels.txt_organisationName,
      Labels.txt_website,
      Labels.txt_emailId,
      Labels.txt_mobileNo,
      Labels.ddl_languageId,
      Labels.ddl_timeZoneId,
    ];

    requiredFields.forEach((field) => {
      const value = this.state[field];
      if (!isNotEmpty(value)) {
        errors[field] = Labels.required;
      } else {
        if (field === Labels.txt_emailId && !isValidEmail(value)) {
          errors[field] = Labels.emailError;
        }
        if (field === Labels.txt_mobileNo && !isValidMobile(value)) {
          errors[field] = validNumber(value);
        }
        if (field === Labels.txt_website && !isValidWebsite(value)) {
          errors[field] = Labels.websiteError;
        }
      }
    });

    this.setState({ errors });
    return Object.keys(errors).length === Labels.num_0;
  };

  handleChange = (e) => {
    let name, value, type, checked;

    if (e?.target) {
      ({ name, value, type, checked } = e.target);
    } else {
      ({ name, value, type = Labels.text, checked = false } = e);
    }
    if (name === Labels.txt_mobileNo) {
      value = allowOnlyNumbers(value);
    }
    const fieldName = name.charAt(0).toLowerCase() + name.slice(1);
    this.setState({
      [fieldName]: type === Labels.checkbox ? checked : value,
      errors: { ...this.state.errors, [fieldName]: "" },
    });
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
    this.setState({
      toaster: {
        ...this.state.toaster,
        open: false,
      },
    });
  };
  handleFileUpload = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          [name]: reader.result.split(",")[1], // base64
          [`${name}FileName`]: file.name, // filename
        });
      };
      reader.readAsDataURL(file);
    }
  };
  s
  handleRemoveFile = (fieldName) => {
    const fileNameKey = `${fieldName}FileName`;
    this.setState({
      [fieldName]: "",
      [fileNameKey]: "",
    });
  };

  AddUpdateDeleteOrganisation = async () => {
    const data = {
      organisationId: this.state.organisationId || Labels.num_0,
      organisationName: this.state.txt_organisationName,
      website: this.state.txt_website,
      emailId: this.state.txt_emailId,
      mobileNo: this.state.txt_mobileNo,
      languageId: parseInt(this.state.ddl_languageId),
      timeZoneId: parseInt(this.state.ddl_timeZoneId),
      chooseLogo: this.state.chooseLogo,
      chooseFavicon: this.state.chooseFavicon,
      logoLink: this.state.txt_logoLink,
      isActive: this.state.cb_isActive == 0 ? false : true,
      isVisible: this.state.cb_isVisible == 0 ? false : true,
      createdBy: 101,
      modifiedBy: 101,
      flag: this.state.organisationId ? Labels.flag.update : Labels.flag.insert,
    };
    console.log(data, "data");
    return PostApi(ApiUrl.AddUpdateDeleteOrganisation, data);
  };

  extractFileName = (path = "") => {
    if (!path) return "";

    if (path.startsWith(Labels.OrganisationLabels.data))
      return Labels.upload_file;
    return path.split("\\").pop().split("/").pop();
  };

  handleSubmit = () => {
    if (!this.validateFields()) return;

    this.setState({ isLoading: true });

    this.AddUpdateDeleteOrganisation()
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.data?.status === Labels.S) {
          const successMessage = this.state.organisationId
            ? Labels.OrganisationLabels.updateOrganisation
            : Labels.OrganisationLabels.createOrganisation;

          this.props.saveOrganisationDetails(this.state);
          this.showToaster(successMessage, Labels.success);
          setTimeout(() => {
            this.props.navigate(labelRoutes.organizationSummary);
          }, Labels.num_500);
        } else {
          this.showToaster(
            res.data?.message || Labels.operationFailed,
            Labels.error
          );
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        this.showToaster(
          Labels.OrganisationLabels.formSubmissionError + error.message,
          Labels.error
        );
      });
  };

  fetchDropdownData = async () => {
    try {
      const response = await GetApi(ApiUrl.GetDropdownOrganisation);
      const result = response.data;


      if (result.status === Labels.flag.select) {
        const languageOptions = result.data.table0.map((lang) => ({
          label: lang.LanguageName,
          value: lang.LanguageId.toString(),
        }));

        const timeZoneOptions = result.data.table1.map((zone) => ({
          label: zone.TimeZoneName,
          value: zone.TimeZoneId.toString(),
        }));

        this.setState({
          languageOptions,
          timeZoneOptions,
        });
      } else {
        this.showToaster(result.message, Labels.error);
      }
    } catch (error) {
      this.showToaster(Labels.OrganisationLabels.dderror, Labels.error);
    }
  };

  componentDidMount() {
    this.loadOrganisationData(this.props.location?.state?.OrganisationId);
    this.fetchDropdownData();
  }

  componentDidUpdate(prevProps) {
    const currentId = this.props.location?.state?.OrganisationId;
    const prevId = prevProps.location?.state?.OrganisationId;

    if (currentId !== prevId) {
      this.loadOrganisationData(currentId);
    }
  }

  loadOrganisationData = (organisationId) => {
    if (organisationId) {
      this.fetchOrganisationDetailsById(organisationId);
    } else {
      this.fetchOrganisationDetails();
    }
  };

  fetchOrganisationDetailsById = async (organisationId) => {
    try {
      const response = await GetApi(
        `${ApiUrl.GetOrganisation}?organisationId=${organisationId}`
      );
      const result = response?.data;
      console.log(result,"dsfsd");
      

      if (
        result.status === Labels.flag.select &&
        result.data?.table0?.length > 0
      ) {
        console.log(result.data.table0, "sdfsvd");

        const org = result.data.table0.find(
          (item) => item.OrganisationId.toString() === organisationId.toString()
        );
        this.setState({
          organisationId: org.OrganisationId,
          txt_organisationName: org.OrganisationName,
          txt_website: org.Website,
          txt_emailId: org.EmailId,
          txt_mobileNo: org.MobileNo,
          ddl_languageId: org.LanguageId,
          ddl_timeZoneId: org.TimeZoneId,
          txt_logoLink: org.LogoLink,
          chooseLogo: org.ChooseLogo,
          chooseFavicon: org.ChooseFavicon,
          chooseLogoFileName: this.extractFileName(org.ChooseLogo),
          chooseFaviconFileName: this.extractFileName(org.ChooseFavicon),
          cb_isActive: org.IsActive ?? true,
          cb_isVisible: org.IsVisible ?? true,
        });
      } else if (!org) {
        console.warn(`No organisation found with ID: ${organisationId}`);
        return;
      }
    } catch (error) {
      console.error(Labels.OrganisationLabels.errorinorgid, error);
      this.showToaster(Labels.OrganisationLabels.errorloading, Labels.error);
    }
  };

  fetchOrganisationDetails = async () => {
    try {
      const response = await GetApi(ApiUrl.GetOrganisation);
      const result = response.data;

      if (
        result.status === Labels.flag.select &&
        result.data?.table0?.length > 0
      ) {
        const org = result.data.table0;
        this.setState({
          txt_organisationName: org.OrganisationName,
          txt_website: org.Website,
          txt_emailId: org.EmailId,
          txt_mobileNo: org.MobileNo,
          ddl_languageId: org.LanguageId,
          ddl_timeZoneId: org.TimeZoneId,
          txt_logoLink: org.LogoLink,
          chooseLogo: this.extractFileName(org.ChooseLogo),
          chooseFavicon: this.extractFileName(org.ChooseFavicon),
          cb_isActive: org.IsActive ?? true,
          cb_isVisible: org.IsVisible ?? true,
        });
      }
    } catch (error) {
      console.error(Labels.OrganisationLabels.errorfetching, error);
    }
  };

  handleClear = () => {
    this.setState({
      organisationId: Labels.num_0,
      txt_organisationName: "",
      txt_website: "",
      txt_emailId: "",
      txt_mobileNo: "",
      ddl_languageId: "",
      ddl_timeZoneId: "",
      chooseLogoFileName: "",
      chooseFaviconFileName: "",
      chooseLogo: "",
      chooseFavicon: "",
      txt_logoLink: "",
      cb_isActive: true,
      cb_isVisible: true,
      errors: {},
      isLoading: false,
      toaster: {
        open: false,
        message: "",
        severity: "",
      },
    });
  };

  truncateFileName = (fileName, maxLength = 15) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;
    return `${fileName.substring(0, maxLength)}...`;
  };

  handleBackClick = () => {
    this.props.navigate(labelRoutes.organizationSummary);
  };

  // renderFileInputWithClear = (name, label, fileName, isDisabled = false) => {
  //   const truncatedName = this.truncateFileName(fileName);

  //   return (
  //     <Box
  //       sx={{ display: Labels.display.flex, flexDirection: "column", gap: 1 }}
  //     >
  //       <Typography variant="subtitle1" gutterBottom>
  //         {label}
  //       </Typography>

  //       <Box
  //         sx={{
  //           display: Labels.display.flex,
  //           alignItems: Labels.center,
  //           gap: 2,
  //         }}
  //       >
  //         <input
  //           type="file"
  //           id={name}
  //           name={name}
  //           onChange={this.handleFileUpload}
  //           style={{ display: "none" }}
  //           accept="image/*"
  //           disabled={isDisabled}
  //         />

  //         <Box
  //           sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
  //         >
  //           <Typography
  //             variant="body2"
  //             color="textSecondary"
  //             sx={{ flexGrow: 1 }}
  //           >
  //             {fileName
  //               ? truncatedName
  //               : Labels.OrganisationLabels.fileUpload.noFileSelected}
  //           </Typography>

  //           {fileName && !isDisabled && (
  //             <IconButton
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 this.handleRemoveFile(name);
  //               }}
  //               size="small"
  //             >
  //               <CloseIcon fontSize="small" />
  //             </IconButton>
  //           )}
  //         </Box>

  //         <Button
  //           variant="outlined"
  //           onClick={() => !isDisabled && document.getElementById(name).click()}
  //           disabled={isDisabled}
  //           sx={{
  //             textTransform: "uppercase",
  //             fontWeight: "bold",
  //             fontSize: "0.75rem",
  //           }}
  //         >
  //           Upload
  //         </Button>
  //       </Box>
  //     </Box>
  //   );
  // };

  render() {
    const isFormDisabled = this.state.cb_isActive === 0 || this.state.isLoading;
    return (
      <ZCard
        title={
          this.state.organisationId
            ? Labels.editorganisation
            : Labels.OrganisationLabels.addOrganisation
        }
        onBackClick={this.handleBackClick}
        className="organisation-card"
      >
        <div className="form-container">
          <div className="form-grid">
            <ZTextField
              name={Labels.txt_organisationName}
              label={Labels.OrganisationLabels.organisationName}
              value={this.state.txt_organisationName}
              onChange={this.handleChange}
              onKeyPress={allowAlphaSpace}
              error={!!this.state.errors.txt_organisationName}
              helperText={this.state.errors.txt_organisationName}
              disabled={isFormDisabled}
              autoFocus
            />
            <ZTextField
              name={Labels.txt_website}
              label={Labels.OrganisationLabels.website}
              value={this.state.txt_website}
              onChange={this.handleChange}
              error={!!this.state.errors.txt_website}
              helperText={this.state.errors.txt_website}
              disabled={isFormDisabled}
            />
            <ZTextField
              name={Labels.txt_emailId}
              label={Labels.OrganisationLabels.emailId}
              value={this.state.txt_emailId}
              onChange={this.handleChange}
              onKeyPress={allowEmailCharsOnly}
              error={!!this.state.errors.txt_emailId}
              helperText={this.state.errors.txt_emailId}
              disabled={isFormDisabled}
            />
            <ZTextField
              name={Labels.txt_mobileNo}
              label={Labels.OrganisationLabels.mobileNo}
              value={this.state.txt_mobileNo}
              onChange={this.handleChange}
              error={!!this.state.errors.txt_mobileNo}
              helperText={this.state.errors.txt_mobileNo}
              disabled={isFormDisabled}
            />
            <ZDropdown
              name={Labels.ddl_languageId}
              label={Labels.OrganisationLabels.language}
              options={this.state.languageOptions}
              value={this.state.ddl_languageId}
              onChange={this.handleChange}
              error={!!this.state.errors.ddl_languageId}
              helperText={this.state.errors.ddl_languageId}
              disabled={isFormDisabled}
            />

            <ZDropdown
              name={Labels.ddl_timeZoneId}
              label={Labels.OrganisationLabels.timeZone}
              options={this.state.timeZoneOptions}
              value={this.state.ddl_timeZoneId}
              onChange={this.handleChange}
              error={!!this.state.errors.ddl_timeZoneId}
              helperText={this.state.errors.ddl_timeZoneId}
              disabled={isFormDisabled}
            />

            <ZTextField
              name={Labels.txt_logoLink}
              label={Labels.OrganisationLabels.logoLink}
              value={this.state.txt_logoLink}
              onChange={this.handleChange}
              disabled={isFormDisabled}
            />

            {/* Logo Upload */}
            <ZTextField
              type="file"
              name="chooseLogo"
              label="Upload Logo"
              onChange={this.handleFileUpload}
              error={!!this.state.errors.chooseLogo}
              helperText={this.state.errors.chooseLogo}
              disabled={isFormDisabled}

              value={
                this.state.chooseLogo
                // ? `data:image/*;base64,${this.state.chooseLogo.substring(
                //     0,
                //     10
                //   )}...`
                // : ""
              }
            // disabled
            />
            <ZTextField
              type="file"
              name="chooseFavicon"
              label="Upload Favicon"
              onChange={this.handleFileUpload}
              error={!!this.state.errors.chooseFavicon}
              helperText={this.state.errors.chooseFavicon}
              value={
                this.state.chooseFavicon
                // ? `data:image/*;base64,${this.state.chooseFavicon.substring(
                //     0,
                //     10
                //   )}...`
                // : ""
              }
              // disabled
              disabled={isFormDisabled}
            />
          </div>
        </div>

        <div className="form-action-row">
          <div className="checkbox-group">
            <ZCheckbox
              name={Labels.cb_isActive}
              checked={this.state.cb_isActive}
              onChange={(val) =>
                this.setState({ cb_isActive: val ? 1 : Labels.num_0 })
              }
              label={Labels.isActive}
            />
            <ZCheckbox
              name={Labels.cb_isVisible}
              checked={this.state.cb_isVisible}
              onChange={(val) =>
                this.setState({ cb_isVisible: val ? 1 : Labels.num_0 })
              }
              label={Labels.OrganisationLabels.isVisible}
              disabled={isFormDisabled}
            />
          </div>

          <div className="button">
            <ZButton
              onClick={this.handleClear}
              variant={Labels.variant.outlined}
            >
              {Labels.OrganisationLabels.clear}
            </ZButton>
            <ZButton onClick={this.handleSubmit} loading={this.state.isLoading}>
              {this.state.organisationId
                ? Labels.OrganisationLabels.update
                : Labels.OrganisationLabels.submit}
            </ZButton>
          </div>
        </div>

        <ZToasterMsg
          open={this.state.toaster.open}
          duration={Labels.num_6000}
          onClose={this.handleToasterClose}
          position={{ vertical: Labels.bottom, horizontal: Labels.right }}
          severity={this.state.toaster.severity}
          message={this.state.toaster.message}
        />
      </ZCard>
    );
  }
}

const mapStateToProps = (state) => ({
  organisationDetails: state.organisationDetails.organisation,
});

const mapDispatchToProps = {
  saveOrganisationDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppNavigation(Organisation));
