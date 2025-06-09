import React from 'react';

const ActionButton = ({ onClick, type = "button", className, children }) => (
  // <button type={type} className={`btn-xs ${className}`} onClick={onClick}>
  <i title={`${children} Row`} className={`m-2 material-symbols-rounded ${className}`} type={type} onClick={onClick} style={{fontSize: '20px'}}>
                 {children}
                </i>
  // </button>
);

export default ActionButton;