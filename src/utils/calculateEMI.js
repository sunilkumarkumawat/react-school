import { formatPrice } from "./priceUtils";

export const calculateEMI = (principal, years, rate1) => {
    const monthlyRate = rate1 / (12 * 100); // Monthly interest rate
    const months = years * 12; // Total number of months
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    return formatPrice(emi.toFixed(2));
};
