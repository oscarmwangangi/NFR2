export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
    const original = parseFloat(originalPrice);
    const discounted = parseFloat(discountedPrice);
    
    if (isNaN(original) || isNaN(discounted) || original <= discounted) return 0;
    
    const discount = original - discounted;
    return Math.round((discount / original) * 100);
  };