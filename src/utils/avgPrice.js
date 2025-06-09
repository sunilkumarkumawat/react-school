import { formatPrice } from "./priceUtils";

export const avgPrice = (prices=[], buildups=[]) => {
    const totalPrice = prices.reduce((sum, price) => sum + price, 0);
    const totalBuildup = buildups.reduce((sum, buildup) => sum + buildup, 0);

    const averagePrice = totalBuildup > 0 ? totalPrice / totalBuildup : 0; // Prevent division by zero

    return ` ${formatPrice(averagePrice.toFixed(2))} /Sq.Ft.`;
};
