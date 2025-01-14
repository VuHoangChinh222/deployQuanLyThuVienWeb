export const ADD = (item) => ({
  //dispatch action này thêm sản phẩm vào giỏ hàng
  type: "ADD_TO_CART",
  payload: item,
});

export const TOTAL = () => ({
  type: "TOTAL_CART",
  payload: "",
});

export const REMOVE = (item) => ({
  type: "REMOVE_ITEM_CART",
  payload: item,
});

export const CLEAR = () => ({
  type: "CLEAR_CART",
  payload: "",
});
