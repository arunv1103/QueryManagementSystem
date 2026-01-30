import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ZButton from '../ZButton/zbutton';

const DateRangePickerComponent = ({ 
  value = [null, null], 
  onChange,
  minDate,
  maxDate
  
}) => {
  const [startDate, setStartDate] = useState(value[0] ? dayjs(value[0]).toDate() : null);
  const [endDate, setEndDate] = useState(value[1] ? dayjs(value[1]).toDate() : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    if (value[0]) setStartDate(dayjs(value[0]).toDate());
    if (value[1]) setEndDate(dayjs(value[1]).toDate());
  }, [value]);

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD MMM YYYY');
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return formatDate(startDate);
    }
    return 'Select date range';
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateInHoverRange = (date) => {
    if (!startDate || !hoverDate || endDate) return false;
    const start = startDate < hoverDate ? startDate : hoverDate;
    const end = startDate < hoverDate ? hoverDate : startDate;
    return date >= start && date <= end;
  };

  const handleDateClick = (date) => {
    let newStart = startDate;
    let newEnd = endDate;
    
    if (!startDate || (startDate && endDate)) {
      newStart = date;
      newEnd = null;
    } else if (date < startDate) {
      newEnd = startDate;
      newStart = date;
    } else {
      newEnd = date;
    }
    
    setStartDate(newStart);
    setEndDate(newEnd);
    
    if (onChange) {
      onChange([
        newStart ? dayjs(newStart) : null,
        newEnd ? dayjs(newEnd) : null
      ]);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const renderCalendar = (month) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const isStart = isSameDay(date, startDate);
      const isEnd = isSameDay(date, endDate);
      const isInRange = isDateInRange(date);
      const isInHoverRange = isDateInHoverRange(date);
      const isToday = isSameDay(date, new Date());

      let cellClasses = "p-2 text-center cursor-pointer text-sm transition-colors relative ";
      
      if (isStart || isEnd) {
        cellClasses += "bg-blue-500 text-white font-semibold ";
      } else if (isInRange || isInHoverRange) {
        cellClasses += "bg-blue-100 text-blue-800 ";
      } else {
        cellClasses += "hover:bg-gray-100 ";
      }

      if (isToday && !isStart && !isEnd) {
        cellClasses += "border border-blue-300 ";
      }

      days.push(
        <div
          key={day}
          className={cellClasses}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="date-range-picker-container">
      {/* Input Field */}
      <div
        className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400"
      >
        <span className={`text-sm ${getDisplayText() === 'Select date range' ? 'text-gray-400' : 'text-gray-700'}`}>
          {getDisplayText()}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* Calendar */}
      <div className="mt-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h3 className="font-semibold text-gray-800">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar(currentMonth)}
        </div>
      </div>
    </div>
  );
};

const ZDateRangePicker = ({ 
  open, 
  onClose, 
  title, 
  value, 
  onChange, 
  minDate, 
  maxDate,
  onConfirm,
  onCancel,
  confirmText
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DateRangePickerComponent
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </DialogContent>
      <DialogActions>
        <ZButton onClick={onCancel || onClose} variant="outlined">Cancel</ZButton>
        <ZButton
          onClick={onConfirm}
          variant="contained"
          disabled={!value[0] || !value[1]}
        >
          {confirmText || 'Confirm'}
        </ZButton>
      </DialogActions>
    </Dialog>
  );
};

export default ZDateRangePicker;