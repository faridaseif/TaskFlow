import React from 'react';
import './CustomDatePicker.css';

const CustomDatePicker = ({ value, onChange, placeholder }) => {
    return (
        <div className="custom-datepicker">
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="datepicker-input"
            />
        </div>
    );
};

export default CustomDatePicker;
