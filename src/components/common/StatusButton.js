import React from 'react';

const StatusButton = ({ onClick, type = "button", className, children }) => (
 
  <i title="Change Status" className={`material-symbols-rounded ${className}`} type={type} onClick={onClick} style={{fontSize: '27px'}} >
                 {children}
                </i>

);

export default StatusButton;