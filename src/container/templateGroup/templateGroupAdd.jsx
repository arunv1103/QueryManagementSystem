
import React, { Component } from 'react'
import { AppNavigation } from '../../navigations/appNavigation';
import ZCard from '../../component/ZCard/zcard';
import ZTextField from '../../component/ZTextField/ztextfield';
import { Labels } from '../../utils/constants/labels';
import { allowOnlyAlphabets, isSuccess } from '../../utils/commonFunction/common';
import ZCheckBox from '../../component/ZCheckBox/ZCheckBox';
import { labelRoutes } from '../../navigations/labelRoutes';
import ZTextEditor from './zTextEditor';
import ZButton from '../../component/ZButton/zbutton';
import { TemplateGroup_Api } from '../../utils/api/apiUrl';
import { PostApi } from '../../utils/api/networking';
import { id } from 'date-fns/locale';
import ZToasterMsg from '../../component/ZToasterMessage/ztoasterMessage';
import templateGroup from './templateGroup';
import { connect } from 'react-redux';


class TemplateGroupAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      update: false,
      templateGroupId: "",
      txt_TemplateName: "",
      templateListId: "",
      txt_TemplateDiscription: "",
      cbl_IsActive: true,
      errors: {},
      toastOpen: false,
      toastMsg: "",
      toastSeverity: Labels.success,
    };
  }
  handleContentChange = (content) => {
    this.setState({ content });
  }
  componentDidMount = () => {
    if (this.props.location?.state) {

      const state = this.props.location?.state;
      const listData = state.listData || {};
      const isUpdate = state.update || false;

      if (typeof listData === 'object') {
        this.setState({
          templateGroupId: state.templateGroupId,
          templateListId: listData.Id,
          txt_TemplateName: listData.TemplateName || "",
          txt_TemplateDiscription: listData.TemplateDescription || "",
          cbl_IsActive: listData.IsActive || true,
          content: listData.HtmlContent || "",
          update: isUpdate
        });
        console.log(listData.templateGroupId, "listData");
      }
      else {
        this.setState({
          templateGroupId: listData

        });
        // console.log(listData, "listData");
      }
    }
  }
  handleSubmit = (isSumbit) => {
    const url = TemplateGroup_Api.templateListCRUD;
    const flagValue = isSumbit ? Labels.flag.insert : Labels.flag.update;
    const validate = this.validate();
    if (!validate) return;
    const data = {
      templateGroupId: this.state.templateGroupId,
      ...(flagValue===Labels.flag.update&& {id: this.state.templateListId}),
      templateName: this.state.txt_TemplateName,
      templateDescription: this.state.txt_TemplateDiscription,
      htmlContent: this.state.content,
      isActive: this.state.cbl_IsActive,
      flag: flagValue,
      ...(isSumbit
         ?{createdBy:this.props.user.UserId}
         :{modifiedBy:this.props.user.UserId}
      )
    }

    PostApi(url, data).then((res) => {
      console.log(res,"r");
      if (isSuccess(res)) {
        this.props.navigate(labelRoutes.templateGroup, { state: res.message });
      } else {
        this.setState({
          toastOpen: true,
          toastMsg: res.message,
          toastSeverity: Labels.error,
        })
      }
    })
  }
  validate = () => {
    const errors = {};
    if (!this.state.txt_TemplateName.trim()) {
      errors.txt_TemplateName = Labels.required;
    }
    else {
      errors.txt_TemplateName = "";
    }
    if (!this.state.txt_TemplateDiscription) {
      errors.txt_TemplateDiscription = Labels.required;
    }
    else {
      errors.txt_TemplateDiscription = "";
    }

    this.setState({ errors });
    return Object.values(errors).every((val) => val.trim() == "");
  }
  handleReset = () => {
    this.setState({
      content: "",
      templateGroupId: "",
      txt_TemplateName: "",
      txt_TemplateDiscription: "",
      cbl_IsActive: true,
    })
  }
  render() {
    return (
      <React.Fragment>
        <ZCard
          onBackClick={() => this.props.navigate(labelRoutes.templateGroup)}
          title={Labels.templates}
        >
          <div className="template-form-container">
            <div className="form-row">
              <div className="form-field">
                <ZTextField
                  name={Labels.txt_TemplateName}
                  label={Labels.templateName}
                  value={this.state.txt_TemplateName}
                  onChange={(e) =>
                    this.setState({
                      txt_TemplateName: e.target.value,
                      errors: { ...this.state.errors, txt_TemplateName: '' },
                    })
                  }
                  helperText={this.state.errors.txt_TemplateName}
                  disabled={!this.state.cbl_IsActive}
                  maxLength={50}
                  autoFocus
                />

              </div>

              <div className="form-field">
                <ZTextField
                  name={Labels.txt_TemplateDiscription}
                  label={Labels.templateDiscription}
                  value={this.state.txt_TemplateDiscription}
                  onChange={(e) =>
                    this.setState({
                      txt_TemplateDiscription: e.target.value,
                      errors: { ...this.state.errors, txt_TemplateDiscription: '' },
                    })
                  }
                  helperText={this.state.errors.txt_TemplateDiscription}
                  disabled={!this.state.cbl_IsActive}
                  multiline
                  rows={2}
                  maxLength={200}
                />
              </div>

              <div className="form-checkbox">
                <ZCheckBox
                  name={Labels.isActive}
                  checked={this.state.cbl_IsActive}
                  onChange={(val) => this.setState({ cbl_IsActive: val })}
                  label={Labels.isActive}
                />
              </div>
            </div>

            <div className="form-editor">
              <ZTextEditor
                content={this.state.content}
                onChange={(value) => this.handleContentChange(value)}
              />
            </div>

            <div className="form-actions">

              {!this.state.update ? (
                <>
                  <ZButton
                    label={Labels.clear}
                    variant={Labels.outlined}
                    onClick={this.handleReset}
                  />
                  <ZButton label={Labels.submit} onClick={() => this.handleSubmit(true)} />

                </>
              ) : (
                <ZButton label={Labels.update} onClick={() => this.handleSubmit(false)} />
              )}
            </div>
          </div>
        </ZCard>
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
export default AppNavigation(connect(mapStateToProps)(TemplateGroupAdd));
