// brandUtils.js
export const filterBrandsBySubcategory = (brands, subcategoryId) => {
    return brands.filter(
      (brand) => brand.category_id === parseInt(subcategoryId, 10)
    );
  };
  