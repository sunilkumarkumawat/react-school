export const downloadPDF = async (pdfUrl, fileName = "download.pdf") => {
    try {
        const response = await fetch(pdfUrl, { mode: "cors" }); // Fetch the file
        const blob = await response.blob(); // Convert response to Blob
        const url = window.URL.createObjectURL(blob); // Create a URL for download

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // Set the filename
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading PDF:", error);
    }
};
