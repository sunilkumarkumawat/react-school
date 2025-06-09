import React from 'react';
import '../css/toastr.css'; // create this file for styling

const positions = {
  'top-left': { top: 20, left: 20 },
  'top-right': { top: 20, right: 20 },
  'bottom-left': { bottom: 20, left: 20 },
  'bottom-right': { bottom: 20, right: 20 },
  'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
};

const ToastrContainer = ({ toasts, removeToastr }) => {
  const grouped = toasts.reduce((acc, toast) => {
    acc[toast.position] = acc[toast.position] || [];
    acc[toast.position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([position, list]) => (
        <div key={position} className="toastr-group" style={{ position: 'fixed', zIndex: 9999, ...positions[position] }}>
          {list.map((toast, i) => (
            <div key={toast.id} className="toastr-item" style={{ marginTop: i === 0 ? 0 : 10 }}>
              <span>{toast.message}</span>
              {!toast.duration && (
                <button onClick={() => removeToastr(toast.id)} className="toastr-close">×</button>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastrContainer;
