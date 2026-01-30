import React from "react";
import ZTextField from "../../../component/ZTextField/ztextfield";
import ZButton from "../../../component/ZButton/zbutton";
import { Labels } from "../../../utils/constants/labels";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect } from "react";
import {  allowEmailCharsOnly, toLowerCase } from "../../../utils/commonFunction/common";

const SignupForm = ({
  name,
  emailOrMobile,
  password,
  confirmPassword,
  file,
  email,
  query,
  loading,
  onChange,
  refreshCaptcha,
  onSubmit,
  captcha,
  mobile,
  captchaCode,
  errors = {},
  fileInputRef,
  onFileClick,
}) => {
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
      onSubmit={(e) => onSubmit(e)}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg space-y-6"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <ZTextField
            name={Labels.name}
            label={`${Labels.name}${Labels.mandatoryStar}`}
            value={name}
            onChange={onChange}
            helperText={errors.name}
            maxLength={75}
            autoFocus
          />
          <ZTextField
            flag={Labels.pass}
            eyeIcon={19}
            name={Labels.password}
            label={`${Labels.password}${Labels.mandatoryStar}`}
            value={password}
            onChange={onChange}
            helperText={errors.password}
            maxLength={25}
          />
          <ZTextField
            type="file"
            name={Labels.chooseLogo}
            onChange={onChange}
            inputRef={fileInputRef}
            onClick={onFileClick}
          />

        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <ZTextField
            name={Labels.mobile}
            label={`${Labels.mobile}${Labels.mandatoryStar}`}
            value={mobile}
            onChange={onChange}
            helperText={errors.mobile}
            maxLength={10}
          />
          <ZTextField
            flag={Labels.pass}
            eyeIcon={19}
            name={Labels.confirmPassword}
            label={`${Labels.confirmPassword}${Labels.mandatoryStar}`}
            value={confirmPassword}
            onChange={onChange}
            helperText={errors.confirmPassword}
            maxLength={50}
          />
          <ZTextField
            name={Labels.enterCaptcha}
            label={`${Labels.enterCaptcha}${Labels.mandatoryStar}`}
            value={captcha}
            maxLength={6}
            onChange={onChange}
            helperText={errors.captcha}
          />


        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">

          <ZTextField
            name={Labels.emailName}
            label={`${Labels.emailName}${Labels.mandatoryStar}`}
            value={email}
            onChange={onChange}
            helperText={errors.email}
            maxLength={75}
            onKeyPress={allowEmailCharsOnly}
            onKeyUp={toLowerCase}
          />
          <ZTextField
            name={Labels.postYourQuery}
            label={`${Labels.postYourQuery}${Labels.mandatoryStar}`}
            value={query}
            onChange={onChange}
            helperText={errors.postYourQuery}
            multiline
            rows={2}
            maxLength={200}
          />
          {/* Captcha display and refresh */}
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-3">
              <div
                className="bg-gray-100 text-sm font-semibold tracking-widest px-3 py-2 rounded-lg text-gray-700 select-none -translate-y-4"
                style={{
                  letterSpacing: "0.2em",
                  backgroundImage: "linear-gradient(45deg, #f9f9f9 25%, transparent 25%), linear-gradient(-45deg, #f9f9f9 25%, transparent 25%)",
                  backgroundSize: "20px 20px",
                }}

                aria-label="Captcha Code"
              >
                {captchaCode}
              </div>
              <RefreshIcon sx={{ color: "#23A9F2", cursor: "pointer", mt: -4 }} onClick={refreshCaptcha} />

            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/1">
          <ZButton label={Labels.goAhead} type="submit"   loading={loading} loaderSize={26}fullWidth />
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
