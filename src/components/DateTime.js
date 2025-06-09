import React, { useState, useEffect } from "react";

const DateTime = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-light fw-bold">
            {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
        </div>
    );
};

export default DateTime;
