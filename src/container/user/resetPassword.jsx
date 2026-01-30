import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Typography, IconButton } from "@mui/material";
import ZTextField from "../../component/ZTextField/ztextfield";
import ZButton from "../../component/ZButton/zbutton";
import ZTypography from "../../component/ZTypography/ztypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { PostApi } from "../../utils/api/networking";
import { Login_Api, SendOtp_Api } from "../../utils/api/apiUrl";
import { emailValidation, isSuccess, validatePassword } from "../../utils/commonFunction/common";
import { encryptPassword } from "../../utils/encryption/cryptoUtil";
import CloseIcon from "@mui/icons-material/Close";

const ResetPasswordDialog = ({ emailState, open, onClose, updatePasswordStatus,readOnly }) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passError, setPassError] = useState({});
  const inputsRef = useRef([]);

  useEffect(() => {
    setError("");
    if (open && step === 1) {
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
    const handleKeyDown = (e) => {
      const index = inputsRef.current.findIndex(
        (input) => document.activeElement === input
      );

      if (e.key === "Backspace") {
        if (index > 0) {
          setTimeout(() => {
            inputsRef.current[index - 1]?.focus();
          }, 50);
        }
      }
      if (/^[0-9]$/.test(e.key)) {
        if (index < inputsRef.current.length - 1) {
          setTimeout(() => {
            inputsRef.current[index + 1]?.focus();
          }, 50);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, step]);

  useEffect(() => {
    setEmail(emailState);
  }, [open]);

  const handleOtpChange = (value, index) => {
    const char = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
  };
  const handleSendOtp = async () => {
    if (!email) return setError(Labels.pleaceEnterYourEmail);
    const payload = { username: email, flag: Labels.flag.generateOtp };
    const validEmail = await PostApi(Login_Api.resetPassword, payload);

    if (!isSuccess(validEmail)) return setError(validEmail.message || Labels.failedTosendOtp);
    const validOtp = parseInt(validEmail.data.table0[0].OTP);
    const data = {
      email, validOtp
    }
    const res = await PostApi(SendOtp_Api, data)
    if (!res.success) return setError(data.error || Labels.failedTosendOtp);
    setStep(1);
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) return setError(Labels.pleaceEnterFourDigitOtp);

    const payload = { flag: Labels.flag.verify, otp: enteredOtp, username: email };
    const verifyOtp = await PostApi(Login_Api.resetPassword, payload);
    if (isSuccess(verifyOtp)) setStep(2);
    else setError(verifyOtp.message);
  };

  const handleResetPassword = async () => {
    const errors = {};
    if (!password) errors.first = Labels.pleaseFillInAllPasswordFields;
    if (!confirmPassword) errors.second = Labels.pleaseFillInAllPasswordFields;
    if (password && confirmPassword && password !== confirmPassword) {
      errors.first = errors.second = Labels.PasswordsDoNotMatch;
    }
    if (Object.keys(errors).length) return setPassError(errors);

    const payload = { flag: Labels.flag.updatePassword, username: email, password: encryptPassword(password) };
    const response = await PostApi(Login_Api.resetPassword, payload);
    if (isSuccess(response)) {
      updatePasswordStatus(response.message);
      setEmail(""); setOtp(Array(6).fill("")); setPassword(""); setConfirmPassword(""); setStep(0);
      onClose();
    }
  };
  const onHandleClose=()=>{
     setStep(0);
     setEmail("");
     setOtp(Array(4).fill(""));
     setPassword("");
     setConfirmPassword("");
     setError("");
     setPassError("");
     onClose();
  }

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box mt={0.5} width={300} sx={{ mb: -2.5, ml: 6 }} >
            <ZTextField label={Labels.emailAddress} value={email} onChange={(e) => { setEmail(e.target.value), setError(emailValidation(e.target.value)) }} fullWidth helperText={error}
             disabled={readOnly} />
          </Box>
        );
      case 1:
        return (
          <>
            <Typography align="center" variant="body2" color="textSecondary">
              We’ve sent a 4-digit OTP to your registered email.
            </Typography>
            <Box display="flex" justifyContent="center" gap={3} mt={2}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputsRef.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.5rem" } }}
                  sx={{ width: 55, "& input": { padding: "10px", borderRadius: "8px" } }}
                />
              ))}
            </Box>
            <div className="flex justify-center mt-1">
                <ZTypography  labelText={error ||" "} color={CommonColors.red} flag={Labels.smallText} />
            </div>
            
          </>
        );
      case 2:
        return (
          <Box mt={2} display="flex" flexDirection="column" width={300} gap={1} ml={6} mb={-2}>
            <ZTextField flag={Labels.pass} label={Labels.newPassword} value={password}
              onChange={(e) => { setPassword(e.target.value); setPassError((p) => ({ ...p, first: validatePassword(e.target.value) })); }}
              fullWidth helperText={passError.first} />
            <ZTextField flag={Labels.pass} label={Labels.confirmPassword} value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPassError((p) => ({ ...p, second: validatePassword(e.target.value) })); }}
              helperText={passError.second} />
          </Box>
        );
      default:
        return null;
    }
  };

  const renderActions = () => (
    <DialogActions >
      <div className="flex justify-between gap-6 w-full  -mt-3 mb-7 px-16.5 ">
        {step === 0 && <ZButton label={Labels.sendOtp} onClick={handleSendOtp} variant={Labels.contained} fullWidth />}
        {step > 0 && <ZButton label={Labels.back} onClick={() => setStep(step - 1)} variant={Labels.contained} fullWidth />}
        {step === 1 && <ZButton label={Labels.verifyOtp} onClick={handleVerifyOtp} variant={Labels.contained} fullWidth />}
        {step === 2 && <ZButton label={Labels.update} onClick={handleResetPassword} variant={Labels.contained} fullWidth />}
      </div>



    </DialogActions>
  );

  return (
    <Dialog open={open} onClose={onHandleClose} maxWidth="xs" fullWidth>
      <IconButton
        onClick={onHandleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 10,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", mt: 1 }}>
        <ZTypography
          labelText={step === 0 ? Labels.enterEmail : step === 1 ? Labels.verifyOtp : Labels.resetPassword}
          color={CommonColors.grey} flag={Labels.header} weight={Labels.bold} font={Labels.bold}
        />
      </DialogTitle>
      <DialogContent sx={{ px: 3, mb: 2 }}>{renderStepContent()}</DialogContent>
      {renderActions()}
    </Dialog>
  );
};

export default ResetPasswordDialog;
