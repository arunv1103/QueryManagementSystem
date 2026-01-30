import React, { useState, useEffect } from "react";
import "./busHrs.css";
import { labelRoutes } from "../../navigations/labelRoutes";
import { AppNavigation } from "../../navigations/appNavigation";
import ZButton from "../../component/ZButton/zbutton";
import { Labels } from "../../utils/constants/labels";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const days = [
    Labels.days.monday,
    Labels.days.tuesday,
    Labels.days.wednesday,
    Labels.days.thursday,
    Labels.days.friday,
    Labels.days.saturday,
    Labels.days.sunday,
];
const hours = Array.from({ length: 17 }, (_, i) => 5 + i); // 5 AM to 9 PM

function formatAMPM(hour) {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hr = hour % 12 === 0 ? 12 : hour % 12;
    return `${hr}:00 ${ampm}`;
}
const BusHrsBox = (props) => {
    const [fieldData, setFieldData] = useState([])
    const [update, setUpdate] = useState(false)
    const [selectedTimes, setSelectedTimes] = useState(
        days.reduce((acc, day) => {
            acc[day] = { startTime: null, endTime: null };
            return acc;
        }, {})
    );
    useEffect(() => {
        if (props.location?.state) {
            const state = props.location?.state
            const buisnessHours = state?.businessHour || {}
            const buisnessField = state?.businessField
            const update = state?.update
            setUpdate(update)
            setFieldData(buisnessField)
                if (Object.keys(buisnessHours).length !== 0) {
                    const parsed = buisnessHours?.reduce((acc, entry) => {
                        const parseHour = (str) => {
                            if (!str || str === "0:00 AM" || str === "0:00 PM") return null;
                            const [time, ampm] = str.split(" ");
                            let [hr] = time.split(":").map(Number);
                            if (ampm === "PM" && hr !== 12) hr += 12;
                            if (ampm === "AM" && hr === 12) hr = 0;
                            return hr;
                        };

                        acc[entry.day] = {
                            startTime: parseHour(entry.startTime),
                            endTime: parseHour(entry.endTime),
                        };
                        return acc;
                    }, {});
                    console.log(parsed, "parsed");

                    setSelectedTimes(parsed);
            } else {
                setSelectedTimes(
                    days.reduce((acc, day) => {
                        acc[day] = { startTime: null, endTime: null };
                        return acc;
                    }, {})
                );
            }
        }
    }, [props.location?.state]);

    const handleTimeClick = (day, hour) => {
        const { startTime, endTime } = selectedTimes[day];

        
        if (startTime === null && endTime === null) {
            setSelectedTimes({
                ...selectedTimes,
                [day]: { startTime: hour, endTime: null },
            });
            return;
        }
        if (startTime !== null && endTime === null) {
            if (hour === startTime) {
            
                setSelectedTimes({
                    ...selectedTimes,
                    [day]: { startTime: null, endTime: null },
                });
            } else {
                const newStart = Math.min(startTime, hour);
                const newEnd = Math.max(startTime, hour);
                setSelectedTimes({
                    ...selectedTimes,
                    [day]: { startTime: newStart, endTime: newEnd },
                });
            }
            return;
        }
        setSelectedTimes({
            ...selectedTimes,
            [day]: { startTime: hour, endTime: null },
        });
    };
    const isCellInRange = (day, hour) => {
        const { startTime, endTime } = selectedTimes[day];
        if (startTime === null) return false;
        if (endTime === null) return hour === startTime;
        return hour >= startTime && hour <= endTime;
    };
    const handleReset = () => {
        setSelectedTimes(
            days.reduce((acc, day) => {
                acc[day] = { startTime: null, endTime: null };
                return acc;
            }, {})
        );
    };
    const handleSubmit = () => {
        const formattedData = Object.entries(selectedTimes).map(([dayName, timeObj]) => ({
            day: dayName,
            startTime: timeObj.startTime != null ? formatAMPM(timeObj.startTime) : "",
            endTime: timeObj.endTime != null ? formatAMPM(timeObj.endTime) : "",
        }));
        props.navigate(labelRoutes.busHrsForm, {
            state: {
                businessHour: formattedData,
                businessField: fieldData,
                object: true,
                update: update
            }
        },)
    };


    
    return (

        <>
            <div className="bh-box-wrapper">
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <IconButton size="small" onClick={handleSubmit}>
                        <ArrowBackIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                </div>

                <div className="bh-grid">
                    <div className="bh-time-column">
                        <div className="bh-day-header">GMT</div>
                        {hours.map((h) => (
                            <div key={h} className="bh-time-cell">
                                {formatAMPM(h)}
                            </div>
                        ))}
                    </div>

                    {days.map((day) => (
                        <div className="bh-day-column" key={day}>
                            <div className="bh-day-header">{day}</div>
                            {hours.map((h) => (
                                <div
                                    key={h}
                                    className={`bh-cell ${isCellInRange(day, h) ? "active" : ""}`}
                                    onClick={() => handleTimeClick(day, h)}
                                />
                            ))}
                            {selectedTimes[day].startTime !== null && selectedTimes[day].endTime !== null && (
                                <div
                                    className="bh-block-label"
                                    style={{
                                        // Fixed calculation using array index position with updated header height
                                        top: `calc(28px + ${hours.indexOf(selectedTimes[day].startTime)} * var(--bh-row-height))`,
                                        height: `calc(${hours.indexOf(selectedTimes[day].endTime) - hours.indexOf(selectedTimes[day].startTime) + 1} * var(--bh-row-height))`,
                                    }}
                                >
                                    {`${formatAMPM(selectedTimes[day].startTime)} - ${formatAMPM(selectedTimes[day].endTime)} GMT`}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bh-buttons">
                    <ZButton
                        label={Labels.reset}
                        variant={Labels.outlined}
                        color={Labels.success}
                        onClick={handleReset}
                    />
                    <ZButton
                        label={Labels.next}
                        onClick={handleSubmit}
                        color={Labels.success}
                    />
                </div>
            </div>
        </>

    );
};

export default AppNavigation(BusHrsBox);