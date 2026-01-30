
import React, { Component, Fragment } from 'react'
import { AppNavigation } from "../../navigations/appNavigation";
import { Labels } from '../../utils/constants/labels';
import BusHrsFields from './busHrsFields';
import ZTextField from '../../component/ZTextField/ztextfield';
import ZDropdown from '../../component/ZDropdown/zdropdown';
import ZCheckBox from '../../component/ZCheckbox/zcheckbox';
import ZCard from '../../component/ZCard/zcard';
import { ApiUrl, UsersForm_Api } from '../../utils/api/apiUrl';
import { GetApi, PostApi } from '../../utils/api/networking';
import ZTypography from '../../component/ZTypography/ztypography';
import "../buisnessHours/busHrs.css";
import { labelRoutes } from '../../navigations/labelRoutes';
import ZButton from '../../component/ZButton/zbutton';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { IconButton, Tooltip } from '@mui/material';
import { allowOnlyAlphabets, getErrorKey, isSuccess } from '../../utils/commonFunction/common';
import ZToasterMsg from '../../component/ZToasterMessage/ztoasterMessage';
import { connect } from 'react-redux';


class BusHrsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txt_BusinessHoursName: "",
            ddl_BusinessHourType: "",
            ddl_TimeZone: "",
            ddl_FirstWeekDay: "",
            ddl_FirstWeekOff: [],
            ddl_SecondWeekOff: [],
            ddl_ThirdWeekOff: [],
            ddl_FourthWeekOff: [],
            ddl_FifthWeekOff: [],
            ddl_HolidayList: "",
            cb_IsActive: true,
            timeZoneValue: [],
            hoursError: "",
            busFormUnicId: "",
            daysValue: [],
            businessHours: [],
            holidayValue: [],
            errors: {},
            btn_submit: Labels.submit,
            selectedDaysData: [],
            toast: {
                open: false,
                message: "",
                severity: Labels.success,
                duration: Labels.num_3000,
                position: { vertical: Labels.bottom, horizontal: Labels.center },
            }
        };
    }
    handleChange = (e) => {
        const { name } = e.target;
        const errorKey = getErrorKey(name);
        let value = e.target.value;
        if (name === Labels.fields.txt_BusinessHoursName) {
            value = allowOnlyAlphabets(value)
        }
        const verifiedValue = value

        this.setState((prev) => ({
            ...prev,
            [name]: verifiedValue,
            errors: {
                ...prev.errors,
                [errorKey]: "",
            },
        }));

    }
    componentDidMount = async () => {
        const state = this.props?.location?.state || {};
        const businessHour = state?.businessHour || {};
        const update = state?.update || false;
        const rawBusinessField = state?.businessField || {};

        const businessField = this.normalizeBusinessField(rawBusinessField);
        const normalizedHours = this.getNormalizedHours(businessHour)

        this.setState({
            busFormUnicId: businessField.busFormUnicId,
            selectedDaysData: state?.object === undefined ? normalizedHours : businessHour,
            txt_BusinessHoursName: businessField.BusinessHoursName,
            ddl_BusinessHourType: businessField.BusinessHourType,
            ddl_TimeZone: businessField.TimeZoneId,
            ddl_FirstWeekDay: businessField.FirstWeekDay,
            ddl_FirstWeekOff: businessField.FirstWeekOff?.trim() ? businessField.FirstWeekOff.split(",").map(Number) : [],
            ddl_SecondWeekOff: businessField.SecondWeekOff?.trim() ? businessField.SecondWeekOff.split(",").map(Number) : [],
            ddl_ThirdWeekOff: businessField.ThirdWeekOff?.trim() ? businessField.ThirdWeekOff.split(",").map(Number) : [],
            ddl_FourthWeekOff: businessField.FourthWeekOff?.trim() ? businessField.FourthWeekOff.split(",").map(Number) : [],
            ddl_FifthWeekOff: businessField.FifthWeekOff?.trim() ? businessField.FifthWeekOff.split(",").map(Number) : [],
            ddl_HolidayList: businessField.HolidayList,
            cb_IsActive: businessField.IsActive ?? true,
        });

        await this.fetchDropdowns();
        window.history.replaceState({}, document.title);
        if (update) {
            this.setState({
                btn_submit: Labels.update,
                ...(rawBusinessField.BusinessHoursId ? { busFormUnicId: rawBusinessField.BusinessHoursId } : {})
            });
        }
    };
    getNormalizedHours = (businessHour) => {

        const validDays = Object.values(Labels.days).map(day => day.toLowerCase());

        return Object.entries(businessHour)
            .filter(([day]) => validDays.includes(day.toLowerCase()))
            .map(([day, value]) => {
                const [startTime, endTime] = value === Labels.closed || !value ? ["", ""] : value.split(" to ");

                return {
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    startTime,
                    endTime,
                };
            });
    };

    validateFields = () => {
        const requiredFields = [
            Labels.fields.txt_BusinessHoursName,
            Labels.fields.ddl_BusinessHourType,
            Labels.fields.ddl_TimeZone,
            Labels.fields.ddl_FirstWeekDay,
            Labels.fields.ddl_FirstWeekOff,
            Labels.fields.ddl_SecondWeekOff,
            Labels.fields.ddl_ThirdWeekOff,
            Labels.fields.ddl_FourthWeekOff,
            Labels.fields.ddl_FifthWeekOff,
            Labels.fields.ddl_HolidayList,
        ];
        const errors = {};
        requiredFields.forEach((field) => {
            const value = this.state[field];
            const errorKey = getErrorKey(field)

            if (!value || value.toString().trim() === "") {
                errors[errorKey] = Labels.required;
            }
        });
        if (this.state.selectedDaysData.length < 1) {
            this.setState((prev) => ({
                ...prev, hoursError: Labels.required
            }))
            errors.hoursError = Labels.required;
        }
        else {
            this.setState((prev) => ({
                ...prev, hoursError: ""
            }))
        }
        this.setState({ errors });
        return Object.keys(errors).length === Labels.num_0;
    };
    normalizeBusinessField = (raw) => {
        return Object.fromEntries(
            Object.entries(raw).map(([key, value]) => [
                key.charAt(0).toUpperCase() + key.slice(1),
                value,
            ])
        );
    };

    fetchDropdowns = async () => {
        try {
            const res = await GetApi(UsersForm_Api.getMasters);
            const { table3, table6, table7, table8 } = res.data.data;
            this.setState({
                timeZoneValue: table3,
                daysValue: table6,
                businessHours: table7,
                holidayValue: table8
            });
        } catch (error) {
            console.log("Dropdown fetch failed:", error);
        }
    };
    handleReset = () => {
        this.setState({
            txt_BusinessHoursName: "",
            ddl_BusinessHourType: "",
            ddl_TimeZone: "",
            ddl_FirstWeekDay: "",
            ddl_FirstWeekOff: [],
            ddl_SecondWeekOff: [],
            ddl_ThirdWeekOff: [],
            ddl_FourthWeekOff: [],
            ddl_FifthWeekOff: [],
            ddl_HolidayList: "",
            cb_IsActive: true,
        });
    }

    handleSubmit = async (update) => {
        const validate = this.validateFields();
        const flagValue = update ? Labels.flag.update : Labels.flag.insert
        if (!validate) return
        const {
            ddl_FirstWeekOff,
            ddl_SecondWeekOff,
            ddl_ThirdWeekOff,
            ddl_FourthWeekOff,
            ddl_FifthWeekOff,
        } = this.state;

        const selectedHours = {};
        this.state.selectedDaysData.forEach(({ day, startTime, endTime }) => {
            const key = day.toLowerCase();
            if (startTime && endTime) {
                selectedHours[key] = `${startTime} to ${endTime}`;
            } else {
                selectedHours[key] = Labels.closed;
            }
        });

        const payload = {
            businessHoursId: this.state.busFormUnicId ,
            businessHoursName: this.state.txt_BusinessHoursName,
            businessHourType: this.state.ddl_BusinessHourType,
            timeZoneId: this.state.ddl_TimeZone,
            firstWeekDay: this.state.ddl_FirstWeekDay,
            holidayList: this.state.ddl_HolidayList.toString(),
            firstWeekOff: Array.isArray(ddl_FirstWeekOff) ? ddl_FirstWeekOff.join(",") : "",
            secondWeekOff: Array.isArray(ddl_SecondWeekOff) ? ddl_SecondWeekOff.join(",") : "",
            thirdWeekOff: Array.isArray(ddl_ThirdWeekOff) ? ddl_ThirdWeekOff.join(",") : "",
            fourthWeekOff: Array.isArray(ddl_FourthWeekOff) ? ddl_FourthWeekOff.join(",") : "",
            fifthWeekOff: Array.isArray(ddl_FifthWeekOff) ? ddl_FifthWeekOff.join(",") : "",
            isActive: this.state.cb_IsActive,
            flag: flagValue,
            ...(update
                ? { modifiedBy: this.props.user?.UserId }
                : { createdBy: this.props.user?.UserId }),
            ...selectedHours
        }
        console.log(payload,"payload");
        

        const url = ApiUrl.buisnessForm.buisnessForm_Crud
        const response = await PostApi(url, payload)
        if (isSuccess(response)) {
            this.setState({
                toast: {
                    open: true,
                    message: response.message,
                    severity: Labels.success,
                    duration: Labels.num_1000,
                    position: { vertical: Labels.bottom, horizontal: Labels.right },
                }
            })
            setTimeout(() => {
                this.props.navigate(labelRoutes.busHrsSummary);
            }, Labels.num_1000);
        }
        else {
            this.setState({
                toast: {
                    open: true,
                    message: response.message,
                    severity: Labels.error,
                    duration: Labels.num_1000,
                    position: { vertical: Labels.bottom, horizontal: Labels.right },
                }
            })
        }
    }
    addBusHrs = () => {
        const {
            ddl_FirstWeekOff,
            ddl_SecondWeekOff,
            ddl_ThirdWeekOff,
            ddl_FourthWeekOff,
            ddl_FifthWeekOff,
            selectedDaysData
        } = this.state;

        const inputValue = {
            busFormUnicId: this.state.busFormUnicId,
            businessHoursName: this.state.txt_BusinessHoursName || "",
            businessHourType: this.state.ddl_BusinessHourType || "",
            timeZoneId: this.state.ddl_TimeZone || "",
            firstWeekDay: this.state.ddl_FirstWeekDay || "",
            holidayList: this.state.ddl_HolidayList || "",
            firstWeekOff: Array.isArray(ddl_FirstWeekOff) ? ddl_FirstWeekOff.join(",") : "" || [],
            secondWeekOff: Array.isArray(ddl_SecondWeekOff) ? ddl_SecondWeekOff.join(",") : "" || [],
            thirdWeekOff: Array.isArray(ddl_ThirdWeekOff) ? ddl_ThirdWeekOff.join(",") : "" || [],
            fourthWeekOff: Array.isArray(ddl_FourthWeekOff) ? ddl_FourthWeekOff.join(",") : "" || [],
            fifthWeekOff: Array.isArray(ddl_FifthWeekOff) ? ddl_FifthWeekOff.join(",") : "" || [],
            isActive: this.state.cb_IsActive,
        }

        const update = this.state.btn_submit === Labels.update
        this.props.navigate(labelRoutes.busHrsBox, {
            state: {
                ...(selectedDaysData?.length !== 0 ? { businessHour: selectedDaysData } : {}),
                businessField: inputValue
                , update: update
            }
        })
    }
    render() {
        const { inputs } = BusHrsFields(this.state, (val) => this.setState(val))
        return (
            <Fragment>
                <ZCard title={Labels.businessHours} onBackClick={() => {
                    this.props.navigate(labelRoutes.busHrsSummary)
                }}>
                    <div className="form-container">
                        <div className="form-grid">
                            {inputs.map((data, index) => {
                                if (data.flag === Labels.inputField) {
                                    return (
                                        <div key={index} className="form-field">
                                            <ZTextField
                                                name={data.name}
                                                label={data.label}
                                                value={data.value}
                                                onChange={(e) => this.handleChange(e, data.validation)}
                                                placeholder={data.placeholder}
                                                helperText={data.helperText}
                                                maxLength={data.maxLength}
                                                disabled={data.disabled}
                                                autoFocus={data.autoFocus??false}
                                            />
                                        </div>
                                    );
                                } else if (data.flag === Labels.dropdown) {
                                    return (
                                        <div key={index} className="form-field">
                                            <ZDropdown
                                                label={data.label}
                                                name={data.name}
                                                options={data.options}
                                                value={data.value}
                                                onChange={(e) => this.handleChange(e, data.validation)}
                                                helperText={data.helperText}
                                                disabled={data.disabled}
                                                multiple={data.multiSelect}
                                            />
                                        </div>
                                    );
                                }
                                else if (data.flag === Labels.checkbox) {
                                    return (
                                        <div key={index} className="form-field">
                                            <ZCheckBox
                                                label={data.label}
                                                name={data.name}
                                                checked={data.value}
                                                onChange={data.onChange}
                                            />
                                        </div>
                                    )
                                }
                                return null;
                            })}
                        </div>
                        <div>
                            {this.state.selectedDaysData.length < 1 ? (
                                <>
                                    <p className="bus-hrs-link"
                                        onClick={this.addBusHrs}
                                    >
                                        Click here to add business hours  </p>
                                    <span className="hours-error"> {this.state.hoursError}</span>
                                </>
                            ) : (<>
                                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                    <ZTypography
                                        labelText={"BusinessHour"}
                                        font={Labels.mainHeader}
                                        weight={Labels.bold}
                                        fontFamily={Labels.semiBold}
                                    />
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={this.addBusHrs}
                                            size="small"
                                            sx={{
                                                color: "#6B7280",
                                                borderRadius: "8px",
                                                minHeight: "32px",
                                                "&:hover": {
                                                    color: "black",
                                                    borderColor: "black",
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                        >
                                            <EditSquareIcon sx={{ fontSize: "1.1rem" }} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div className="seven-row-container">
                                    {this.state.selectedDaysData.length > 0 ? <>
                                        {this.state.selectedDaysData?.map((data, index) => (
                                            <div className="seven-box" key={index}>
                                                <h3>{data.day}</h3>
                                                {data.startTime !== "" ?
                                                    <p>
                                                        {data.startTime} to {data.endTime}
                                                    </p> : <p>
                                                        {Labels.closed}
                                                    </p>
                                                }

                                            </div>
                                        ))}</> : <></>}
                                </div>
                            </>
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {this.state.btn_submit === Labels.submit ?
                                <><ZButton sx={{ mr: 2 }} label={Labels.clear} variant={Labels.outlined} onClick={this.handleReset} />
                                    <ZButton label={this.state.btn_submit} onClick={() => this.handleSubmit(false)} /></> :

                                <><ZButton label={this.state.btn_submit} onClick={() => this.handleSubmit(true)} /></>}

                        </div>
                    </div>
                </ZCard>
                <ZToasterMsg
                    open={this.state.toast.open}
                    message={this.state.toast.message}
                    severity={this.state.toast.severity}
                    duration={this.state.toast.duration}
                    position={this.state.toast.position}
                // onClose={this.handleCloseToast}
                />
            </Fragment >)
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.userDetails.user,
    };
};

export default AppNavigation(connect(mapStateToProps)(BusHrsForm))
