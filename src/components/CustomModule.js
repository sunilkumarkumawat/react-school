import React, { useEffect } from 'react';

const CustomModal = ({
  show,
  title = 'Message',
  message = '',
  type = 'info', // 'info', 'error', 'confirm'
  onClose,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (show) {
      const modalEl = document.getElementById('customModal');
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();

      const hideHandler = () => {
        onClose && onClose();
        modalEl.removeEventListener('hidden.bs.modal', hideHandler);
      };

      modalEl.addEventListener('hidden.bs.modal', hideHandler);
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      id="customModal"
      tabIndex="-1"
      aria-labelledby="customModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="customModalLabel">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <p>{message}</p>
          </div>

          <div className="modal-footer">
            {type === 'confirm' ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                  data-bs-dismiss="modal"
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onConfirm}
                  data-bs-dismiss="modal"
                >
                  Yes
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
