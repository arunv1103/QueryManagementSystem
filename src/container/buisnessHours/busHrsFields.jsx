import { Labels } from '../../utils/constants/labels';

const BusHrsFields = (state, setState) => {
    const inputs = [
        {
            id: 1,
            flag: Labels.inputField,
            name: Labels.fields.txt_BusinessHoursName,
            label: `${Labels.businessHoursName}*`,
            value: state[Labels.fields.txt_BusinessHoursName],
            placeholder: Labels.firstName,
            helperText: state.errors?.BusinessHoursName,
            type: Labels.normal,
            maxLength: 50,
            disabled: !state.cb_IsActive,
            autoFocus: true
        },
        {
            id: 2,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_BusinessHourType,
            label: `${Labels.buisnessHoursType}*`,
            value: state[Labels.fields.ddl_BusinessHourType],
            options: (state.businessHours || []).map(item => ({
                label: item.BusinessHoursName,
                value: item.BusinessHours
            })),
            placeholder: Labels.buisnessHoursType,
            helperText: state.errors?.BusinessHourType,
            disabled: !state.cb_IsActive
        },
        {
            id: 3,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_TimeZone,
            label: `${Labels.timeZone}*`,
            value: state[Labels.fields.ddl_TimeZone],
            options: (state.timeZoneValue || []).map(item => ({
                label: item.TimeZoneName,
                value: item.TimeZoneId
            })),
            helperText: state.errors?.TimeZone,
            disabled: !state.cb_IsActive
        },
        {
            id: 4,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_FirstWeekDay,
            label: `${Labels.firstWeekDay}*`,
            value: state[Labels.fields.ddl_FirstWeekDay],
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.FirstWeekDay,
            disabled: !state.cb_IsActive
        },
        {
            id: 5,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_FirstWeekOff,
            label: `${Labels.firstWeekOff}*`,
            value: state[Labels.fields.ddl_FirstWeekOff],
            multiSelect: true,
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.FirstWeekOff,
            disabled: !state.cb_IsActive
        },
        {
            id: 6,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_SecondWeekOff,
            label: `${Labels.secondWeekOff}*`,
            value: state[Labels.fields.ddl_SecondWeekOff],
            multiSelect: true,
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.SecondWeekOff,
            disabled: !state.cb_IsActive
        },
        {
            id: 7,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_ThirdWeekOff,
            label: `${Labels.thirdWeekOff}*`,
            value: state[Labels.fields.ddl_ThirdWeekOff],
            multiSelect: true,
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.ThirdWeekOff,
            disabled: !state.cb_IsActive
        },
        {
            id: 8,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_FourthWeekOff,
            label: `${Labels.fourthWeekOff}*`,
            value: state[Labels.fields.ddl_FourthWeekOff],
            multiSelect: true,
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.FourthWeekOff,
            disabled: !state.cb_IsActive
        },
        {
            id: 9,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_FifthWeekOff,
            label: `${Labels.fifthWeekOff}*`,
            value: state[Labels.fields.ddl_FifthWeekOff],
            multiSelect: true,
            options: (state.daysValue || []).map(item => ({
                label: item.DaysName,
                value: item.Day
            })),
            helperText: state.errors?.FifthWeekOff,
            disabled: !state.cb_IsActive
        },
        {
            id: 10,
            flag: Labels.dropdown,
            name: Labels.fields.ddl_HolidayList,
            label: `${Labels.holidayList}*`,
            value: state[Labels.fields.ddl_HolidayList],
            options: (state.holidayValue || []).map(item => ({
                label: item.HolidayListName,
                value: item.HolidayListId
            })),
            helperText: state.errors?.HolidayList,
            disabled: !state.cb_IsActive
        },
        {
            id: 11,
            flag: Labels.checkbox,
            name: Labels.fields.cb_IsActive,
            label: Labels.isActive,
            value: state.cb_IsActive,
            onChange: (val) => setState((prev) => ({
                ...prev,
                cb_IsActive: val
            }))
        }
    ];

    return { inputs };
};

export default BusHrsFields;
