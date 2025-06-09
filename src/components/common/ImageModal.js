import React from "react";

const ImageModal = ({ show, imageUrl, onClose }) => {
  if (!show) return null;

//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = imageUrl.split("/").pop() || "image.jpg";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
 const handleDownload = () => {
  window.open(imageUrl, '_blank', 'noopener,noreferrer');
};

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1050,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: 5,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          position: "relative",
        //   minWidth: 320,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Preview"
          style={{ maxWidth: 400, maxHeight: 400, marginBottom: 16, borderRadius: 8 }}
        />
        <div>
          <button className="btn btn-primary btn-sm mr-2" onClick={handleDownload}>
            Download
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;