import React, { useEffect, useState } from 'react';
import ZDialogueBox from '../../component/ZDialogueBox/zdialogueBox';
import ZTypography from '../../component/ZTypography/ztypography';
import { Labels } from '../../utils/constants/labels';
import logo from "../../utils/assets/Navbar/logo.png";
import { CommonColors } from '../../utils/constants/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ZTextField from '../../component/ZTextField/ztextfield';
import ZButton from '../../component/ZButton/zbutton';
import HttpsIcon from '@mui/icons-material/Https';
import { useSelector, useDispatch } from 'react-redux';
import { isSuccess, validatePassword } from '../../utils/commonFunction/common';
import { encryptPassword } from '../../utils/encryption/cryptoUtil';
import { Login_Api } from '../../utils/api/apiUrl';
import { PostApi } from '../../utils/api/networking';
import { useNavigate } from 'react-router-dom';
import { labelRoutes } from '../../navigations/labelRoutes';
import { clearUserData } from '../../redux/action/UserDetail/userDetailAction';



const SessionExpired = () => {
    const loginUser = useSelector((state) => state.userDetails.user);
    const [txt_password, setTxt_password] = useState("");
    const [passError, setPassError] = useState("");
    const unAuthorized = localStorage.getItem("unAuthorized") === "true";
    const [dialogOpen, setDialogOpen] = useState(unAuthorized);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setDialogOpen(unAuthorized);
    }, [unAuthorized]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') handleSubmit(event);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [txt_password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validatePassword(txt_password);
        if (!txt_password || validationError) {
            setPassError(validationError || Labels.required);
            return;
        }

        const res = await PostApi(Login_Api.verifyUserDetails, {
            userName: loginUser.Email,
            password: encryptPassword(txt_password),
        });

        if (isSuccess(res)) {
            localStorage.setItem("token", res.data.token);
            localStorage.removeItem("unAuthorized");
            setPassError("") 
            setDialogOpen(false);
            navigate(0);
            setTxt_password("")
        } else {
            setPassError(Labels.wrongPassword);
        }
    };

    const handleNotUser = () => {
        dispatch(clearUserData());
        navigate(labelRoutes.home);
        localStorage.removeItem("token")
        localStorage.removeItem("unAuthorized")
    };

    return (
        <ZDialogueBox viewType="Dialog" open={dialogOpen} IsVisibleCloseIcon={false}>
            <div className="flex flex-col items-center justify-center w-[320px] mx-auto gap-2.5 -mt-2.5">

                <div className="flex items-center space-x-2">
                    <img src={logo} alt={Labels.logo} className="h-[50px] w-[50px] rounded-[10%]" />
                    <ZTypography
                        labelText={Labels.zoiFintech}
                        flag={Labels.header}
                        font={Labels.semiBold}
                        color={CommonColors.grey}
                    />
                </div>

                <div className="text-center space-y-1">
                    <ZTypography labelText={Labels.hi} font={Labels.semiBold} color={CommonColors.grey} flag={Labels.header} />
                    <ZTypography labelText={Labels.yourSessionIsExpired} color={CommonColors.grey} flag={Labels.errorLbl} />
                </div>

                <AccountCircleIcon sx={{ fontSize: 100 }} color="disabled" />

                <div className="w-full">
                    <ZTextField
                        flag={Labels.pass}
                        startIcon={<HttpsIcon />}
                        label={Labels.password}
                        maxLength={50}
                        value={txt_password}
                        onChange={(e) => {
                            setTxt_password(e.target.value);
                            setPassError(validatePassword(e.target.value));
                        }}
                        fullWidth
                        helperText={passError}
                    />
                </div>

                <div className="w-full flex flex-col items-center space-y-2 gap-1.5 mb-2">
                    <ZTypography
                        onClick={handleNotUser}
                        labelText={
                            <>
                                <span className="text-gray-500 text-sm">Not</span>{" "}
                                <span className="text-[#23A9F2] underline cursor-pointer text-sm">{loginUser.UserName}</span>{" "}
                                <span className="text-gray-500 text-sm">?</span>
                            </>
                        }
                    />
                    <ZButton label={Labels.unlock} fullWidth onClick={handleSubmit} />
                </div>

            </div>
        </ZDialogueBox>
    );
};

export default SessionExpired;
