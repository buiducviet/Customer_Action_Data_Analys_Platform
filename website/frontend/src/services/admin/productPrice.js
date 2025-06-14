import request from "../../utils/httpRequest";

export const getAllProductPrices = async () => {
  try {
    const res = await request.get("/productPrice/");
    return res.data;
  } catch (error) {
    console.log("getAllProductPrices " + error);
  }
};

export const getProductPrice = async (id) => {
  try {
    const res = await request.get(`/productPrice/${id}`);
    return res.data;
  } catch (error) {
    console.log("getProductPrice " + error);
  }
};

export const getListProductPriceByProductId = async (productId) => {
  try {
    const res = await request.get(`/productPrice/product/${productId}`);
    return res.data;
  } catch (error) {
    console.log("getListProductPriceByProductId " + error);
  }
};

export const createProductPrice = async (variantId, price) => {
  try {
    const res = await request.post(`/productPrice/`, { variantId, price });
    return res.data;
  } catch (error) {
    console.log("createProductPrice " + error);
  }
};

export const updateProductPrice = async (priceId, variantId, price) => {
  try {
    const res = await request.put(`/productPrice/${priceId}`, { variantId, price });
    return res.data;
  } catch (error) {
    console.log("updateProductPrice " + error);
  }
};

export const deleteProductPrice = async (id) => {
  try {
    const res = await request.delete(`/productPrice/${id}`);
    return res.data;
  } catch (error) {
    console.log("deleteProductPrice " + error);
  }
};
