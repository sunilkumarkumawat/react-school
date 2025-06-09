import { formatPrice } from "./priceUtils";

export const showPrice = (price) => 
    price?.length > 1 
        ? `₹${formatPrice(price?.[0])} - ₹${formatPrice(price?.[price?.length - 1])}` 
        : `₹${formatPrice(price?.[0])}`;
