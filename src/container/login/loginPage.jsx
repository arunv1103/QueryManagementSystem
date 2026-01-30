import React, { Component, createRef } from "react";
import { motion } from "framer-motion";
import ZTypography from "../../component/ZTypography/ztypography";
import ZButton from "../../component/ZButton/zbutton";
import { Labels } from "../../utils/constants/labels";
import "./loginPage.css";
import LoginForm from "./loginForm/loginForm";
import SignupForm from "./loginForm/signupForm";
import { CommonColors } from "../../utils/constants/colors";
import {
  allowOnlyAlphabets, allowOnlyNumbers, capsFormat, emailValidation,
  isSuccess, validateEmailOrMobile, validatePassword, validNumber, generateCaptcha
} from "../../utils/commonFunction/common";
import { Login_Api } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { encryptPassword } from "../../utils/encryption/cryptoUtil";
import { labelRoutes } from "../../navigations/labelRoutes";
import { AppNavigation } from "../../navigations/appNavigation";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";
import logo from "../../utils/assets/Navbar/logo.png";
import ResetPasswordDialog from "../user/resetPassword";
import { userDetails, clearUserDetails } from "../../redux/actionType/actionType";
import { connect } from "react-redux";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swap: false,
      txt_MobileOrEmail: "",
      txt_Password: "",
      txt_Name: "",
      txt_ConfirmPassword: "",
      txt_PostYourQuery: "",
      txt_Captcha: "",
      txt_Email: "",
      resetPassword: false,
      file: null,
      email: "",
      fileName: "",
      isLoading: false,
      captchaCode: "",
      errors: {},
      toast: {
        open: false,
        message: "",
        severity: Labels.success,
        duration: Labels.num_3000,
        position: { vertical: Labels.bottom, horizontal: Labels.right },
      },
    };
    this.fileInputRef = createRef();
  }
  componentDidMount() {
    this.refreshCaptcha();
    localStorage.removeItem("token")
    localStorage.removeItem("unAuthorized")
  }


  handleSwap = () => {
    this.setState((prev) => ({
      swap: !prev.swap,
      errors: {},
      txt_MobileOrEmail: "",
      txt_Mobile: "",
      txt_Email: "",
      txt_Password: "",
      txt_Name: "",
      txt_ConfirmPassword: "",
      txt_PostYourQuery: "",
      txt_Captcha: "",
      file: null,
      fileName: "",
      toast: { ...prev.toast, open: false },
    }));
    this.refreshCaptcha();
  };
  refreshCaptcha = () => {
    this.setState({ captchaCode: generateCaptcha(), txt_Captcha: "", errors: {} });
  };
  handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file" && files && files.length > 0) {
      const selectedFile = files[0];
      this.setState({
        file: selectedFile,
        fileName: selectedFile.name,
      });
      return;
    }
    switch (name) {
      case Labels.mobileOrEmail:
        this.setState((prev) => ({ txt_MobileOrEmail: value, errors: { ...prev.errors, mobileOrEmail: validateEmailOrMobile(value) }, }));
        break;
      case Labels.password:
        this.setState((prev) => ({ txt_Password: value, errors: { ...prev.errors, password: validatePassword(value) }, }));
        break;
      case Labels.name:
        this.setState((prev) => ({ txt_Name: allowOnlyAlphabets(value), errors: { ...prev.errors, name: "" }, }));
        break;
      case Labels.confirmPassword:
        this.setState((prev) => ({ txt_ConfirmPassword: value, errors: { ...prev.errors, confirmPassword: validatePassword(value) }, }));
        break;
      case Labels.postYourQuery:
        this.setState((prev) => ({ txt_PostYourQuery: value, errors: { ...prev.errors, postYourQuery: "" }, }));
        break;
      case Labels.enterCaptcha:
        this.setState((prev) => ({ txt_Captcha: capsFormat(value), errors: { ...prev.errors, captcha: "" }, }));
        break;
      case Labels.mobile:
        this.setState((prev) => ({ txt_Mobile: allowOnlyNumbers(value), errors: { ...prev.errors, mobile: validNumber(value) }, }));
        break;
      case Labels.emailName:
        this.setState((prev) => ({ txt_Email: value, errors: { ...prev.errors, email: emailValidation(value) }, }));
        break;
    }
  };

  loginValidation = () => {
    const { txt_MobileOrEmail, txt_Password } = this.state;
    let errors = {};
    if (!txt_MobileOrEmail) errors.mobileOrEmail = Labels.required;
    if (!txt_Password) errors.password = Labels.required;
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };
  signupValidation = () => {
    const { txt_Email, txt_Password, txt_ConfirmPassword, txt_Name,
      txt_PostYourQuery, txt_Captcha, captchaCode, txt_Mobile, errors = {} } = this.state;
    const requiredFields = {
      name: txt_Name,
      email: txt_Email,
      mobile: txt_Mobile,
      password: txt_Password,
      confirmPassword: txt_ConfirmPassword,
      postYourQuery: txt_PostYourQuery,
      captcha: txt_Captcha
    };
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value) errors[field] = Labels.required;
    });
    if (txt_Password && txt_ConfirmPassword && txt_Password !== txt_ConfirmPassword) {
      errors.password = errors.confirmPassword = Labels.passwordMismatch;
    }
    if (txt_Captcha && txt_Captcha !== captchaCode) errors.captcha = Labels.captchaError;
    this.setState({ errors });
    return Object.values(errors).every(error => error === "");
  };

  handleSubmit = async (e, isLogin) => {
    e.preventDefault();
    if (isLogin) {
      if (!this.loginValidation()) return;
      this.setState((prev) => ({ ...prev, isLoading: true }))
      const res = await PostApi(Login_Api.verifyUserDetails, {
        userName: this.state.txt_MobileOrEmail,
        password: encryptPassword(this.state.txt_Password),
      })
      if (isSuccess(res)) {
        this.setState({ isLoading: false });
        this.props.clearUserData();
        this.props.saveUserDetails(res.data.user.table0[0]);
        localStorage.setItem("token", res.data.token);
        this.props.navigate(labelRoutes.userDashboard);
      } else {
        this.setState((prev) => ({ ...prev, isLoading: false }))
        this.showToast(Labels.invalidUserMessage, Labels.res.error);
      }

    } else {
      if (!this.signupValidation()) return;
      this.setState((prev) => ({ ...prev, isLoading: true }))
      const formData = new FormData();
      formData.append("FirstName", this.state.txt_Name);
      formData.append("Password", encryptPassword(this.state.txt_Password));
      formData.append("Flag", Labels.flag.insert);
      formData.append("Query", this.state.txt_PostYourQuery);
      if (this.state.file) {
        formData.append("File", this.state.file);
        formData.append("FileName", this.state.file.name);
      }
      formData.append("Email", this.state.txt_Email);
      formData.append("MobileNo", this.state.txt_Mobile);
      formData.append("Captcha", this.state.txt_Captcha);
      const res = await PostApi(Login_Api.userRegistration, formData);
      if (isSuccess(res)) {
        // setTimeout(() => this.props.navigate(labelRoutes.userDashboard), Labels.num_1500);
        this.setState((prev) => ({ ...prev, isLoading: false }))
        this.props.navigate(labelRoutes.userDashboard);
        this.showToast(Labels.registrationSuccessfull);
        const userDetails = {
          IsAgent: false,
          IsAdmin: false,
          Email: this.state.txt_Email,
          UserName: this.state.txt_Name
        }
        this.props.clearUserData()
        this.props.saveUserDetails(userDetails)
        localStorage.setItem("token", res.data.token)
      } else {
        this.setState((prev) => ({ ...prev, isLoading: false }))
        this.showToast(res.message, Labels.res.error);
      }
    }
  };

  showToast = (message, severity = Labels.success) => {
    this.setState({
      toast: { open: true, message, severity, duration: Labels.num_3000, position: { vertical: Labels.bottom, horizontal: Labels.right } },
    });
    setTimeout(() => {
      this.setState((prev) => ({ toast: { ...prev.toast, open: false } }));
    }, Labels.num_3000);
  };

  handleCloseToast = () => {
    this.setState((prev) => ({ toast: { ...prev.toast, open: false } }));
  };

  render() {
    const { swap, errors, toast } = this.state;
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4 overflow-hidden">

        <div className="relative w-full max-w-6xl md:h-[600px] h-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden flex flex-col md:flex-row border border-gray-200">

          {/* Left Panel - Form */}
          <motion.div
            animate={{ left: window.innerWidth >= 768 ? (swap ? "30%" : "0%") : "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative md:absolute top-0 left-0 z-20 w-full md:w-[70%] h-auto md:h-full bg-white/90 backdrop-blur-md flex flex-col px-6 md:px-12 py-6 md:py-10 transition-all duration-500"
            style={{ willChange: "left" }}
          >
            <div className="flex mb-6 mt-3 mx-auto items-center">
              <img
                src={logo}
                alt={Labels.logo}
                className="mr-3 mt-1.5 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                style={{ height: 55, width: 55 }}
              />
              <ZTypography
                labelText={swap ? Labels.createAccount : Labels.signInToQms}
                color={CommonColors.primaryBlue}
                weight={Labels.bold}
                font={Labels.bold}
                flag={Labels.big}
              />
            </div>

            {swap ? (
              <SignupForm
                name={this.state.txt_Name}
                mobile={this.state.txt_Mobile}
                password={this.state.txt_Password}
                confirmPassword={this.state.txt_ConfirmPassword}
                query={this.state.txt_PostYourQuery}
                captcha={this.state.txt_Captcha}
                captchaCode={this.state.captchaCode}
                file={this.state.file}
                email={this.state.txt_Email}
                fileInputRef={this.fileInputRef}
                loading={this.state.isLoading}
                errors={errors}
                onChange={this.handleChange}
                refreshCaptcha={this.refreshCaptcha}
                onSubmit={(e) => this.handleSubmit(e, false)}
                onFileClick={() => this.fileInputRef.current?.click()}
              />
            ) : (
              <div className="mt-6 mb-6 w-full md:w-4/5 mx-auto">
                <LoginForm
                  email={this.state.txt_MobileOrEmail}
                  password={this.state.txt_Password}
                  errors={errors}
                  loading={this.state.isLoading}
                  onChange={this.handleChange}
                  onSubmit={(e) => this.handleSubmit(e, true)}
                />
                <div className="justify-items-center mt-3">
                  <ZTypography
                    underline
                    labelText={Labels.forgotPassword}
                    color={CommonColors.primaryBlue}
                    flag={Labels.smallText}
                    className="cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300"
                    onClick={() => this.setState({ resetPassword: true })}
                  />
                </div>
              </div>
            )}

            <ZButton
              disableRipple
              label={swap ? Labels.loginNow : Labels.notACustomerPostYourQuerry}
              variant="text"
              className="mt-4 text-blue-600 hover:text-blue-800 hover:underline transition duration-300"
              onClick={this.handleSwap}
            />
          </motion.div>

          {/* Right Panel - Info */}
          <motion.div
            initial={{ left: window.innerWidth >= 768 ? "70%" : "0%" }}
            animate={{ left: window.innerWidth >= 768 ? (swap ? "0%" : "70%") : "0%" }}
            transition={{
              duration: 0.3,
              ease: [0.33, 1, 0.68, 1],
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="relative md:absolute top-0 right-0 w-full md:w-[30%] h-auto md:h-full bg-gradient-to-br from-[#23A9F2] to-[#23A9F2] text-white p-6 md:p-8 flex flex-col justify-between rounded-tr-2xl rounded-br-2xl shadow-lg"
            style={{ willChange: "left" }}
          >
            <div className="p-4 md:p-6">
              <motion.div
                key={swap ? "register-info" : "login-info"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <ZTypography
                  labelText={swap ? Labels.registerInfoTitle : Labels.loginInfoTitle}
                  color={CommonColors.white}
                  weight={Labels.bold}
                  font={Labels.bold}
                  flag={Labels.big}
                />
                <ZTypography
                  labelText={swap ? Labels.registerInfoDesc : Labels.loginInfoDesc}
                  color={CommonColors.white}
                  className="opacity-90 mt-2"
                />
              </motion.div>
            </div>

            <motion.div
              className="text-sm py-4 pl-4 opacity-80 flex items-start border-t border-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
            >
              <img  
                src={logo}
                alt={Labels.logo}
                className="mr-2 rounded-lg hover:scale-105 transition-transform duration-300"
                style={{ height: 45, width: 45 }}
              />
              <footer className="text-white text-sm opacity-80 flex items-center space-x-2 mt-1">
                <span>© {new Date().getFullYear()} <span className="font-semibold">ZoiFintech</span>. All rights reserved.</span>
              </footer>
            </motion.div>
          </motion.div>
        </div>

        <ZToasterMsg
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          duration={toast.duration}
          position={toast.position}
          onClose={this.handleCloseToast}
        />

        <ResetPasswordDialog
          emailState={this.state.txt_MobileOrEmail}
          open={this.state.resetPassword}
          onClose={() => this.setState({ resetPassword: false })}
          updatePasswordStatus={this.showToast}
        />
      </div>
    );
  }


}
const mapStateToProps = (state) => {
  console.log("mapStateToProps -> state:", state);
  return {
    user: state.userDetails.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveUserDetails: (user) => {
      console.log("Dispatching SAVE_USER_DETAILS with:", user);
      dispatch({ type: userDetails, payload: user });
    },
    clearUserData: () => dispatch({ type: clearUserDetails }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation(LoginPage));

