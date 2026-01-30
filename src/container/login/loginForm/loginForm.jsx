import React from "react";
import ZTextField from "../../../component/ZTextField/ztextfield";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ZButton from "../../../component/ZButton/zbutton";
import { Labels } from "../../../utils/constants/labels";
import { useEffect } from "react";
import { allowEmailCharsOnly, toLowerCase } from "../../../utils/commonFunction/common";

const LoginForm = ({ email, password, errors, onChange, onSubmit, loading }) => {

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSubmit(event)
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <form
      className="flex flex-col gap-7  max-w-md mb-3 w-[350px] mx-auto"
      onSubmit={(e) => onSubmit(e)}
      noValidate
    >
      <ZTextField
        name={Labels.mobileOrEmail}
        label={Labels.email}
        value={email}
        onChange={onChange}
        helperText={errors.mobileOrEmail}
        startIcon={<EmailIcon sx={{ color: "#9CA3AF" }} />}
        maxLength={75}
        onKeyPress={allowEmailCharsOnly}
        onKeyUp={toLowerCase}
        autoFocus
      />

      <ZTextField
        name={Labels.password}
        label={Labels.password}
        value={password}
        onChange={onChange}
        helperText={errors.password}
        startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
        maxLength={25}
        flag={Labels.pass}
      />

      <div className="flex justify-center">
        <ZButton
          loading={loading}
          loaderSize={26}
          type="submit"
          label={Labels.continue}
          fullWidth
          size={Labels.large}
        />
      </div>
    </form>
  )
};

export default LoginForm;
