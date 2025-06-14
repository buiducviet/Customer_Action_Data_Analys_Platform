import request from "../../utils/httpRequest";

export const getCartItemList = async (email) => {
  try {
    const res = await request.get(`/cart/${email}`, {
      params: {},
    });
    return res.data;
  } catch (error) {
    console.log("getCartItemList " + error);
  }
};

export const createCartItem = async (email, productId, variantId, quantity) => {
  try {
    const res = await request.post(`/cart/${email}`, { productId, variantId, quantity });
    return res.data;
  } catch (error) {
    console.log("getCartItemList " + error);
  }
};

export const deleteCartItem = async (email, productId, variantId) => {
  try {
    const res = await request.delete(`/cart/${email}`, {
      data: { productId, variantId }
    });
    return res.data;
  } catch (error) {
    console.log("deleteCartItem " + error);
  }
};
export const updateCartItem = async (quantity, email, productId, variantId) => {
  try {
    const res = await request.put(`/cart/${email}?productId=${productId}&variantId=${variantId}`, {
      quantity,
    });
    return res.data;
  } catch (error) {
    console.log("deleteCartItem " + error);
  }
};
