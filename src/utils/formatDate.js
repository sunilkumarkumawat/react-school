export const formatDate = (dateString, formatType = "MMM-YYYY") => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    switch (formatType) {
        case "MMM-YYYY":
            // Example: "Dec-2024"
            return date.toLocaleString("en-US", { month: "short", year: "numeric" }).replace(" ", "-");
        case "MM-DD-YYYY":
            // Example: "12-25-2024"
            return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
        case "DD-MM-YYYY":
            // Example: "25-12-2024"
            return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
        case "YYYY-MM-DD":
            // Example: "2024-12-25"
            return date.toISOString().slice(0, 10);
        default:
            return date.toLocaleString("en-US", { month: "short", year: "numeric" }).replace(" ", "-");
    }
};