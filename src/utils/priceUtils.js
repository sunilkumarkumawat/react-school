export const formatPrice = (price) => {
    if (price >= 10000000) {
      // Format as crore (cr)
      return (price / 10000000).toFixed(1).replace(/\.0$/, '') + 'cr';
    } else if (price >= 100000) {
      // Format as lakh (L)
      return (price / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    } else if (price >= 1000) {
      // Format as thousand (k)
      return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return price;
    }
  };
  