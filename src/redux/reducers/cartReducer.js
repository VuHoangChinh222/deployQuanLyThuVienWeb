const initCart = {
  carts: [],
  amountItem: 0,
  totalAmount: 0,
};
const initState = JSON.parse(localStorage.getItem("cart")) || initCart;
const saveCartToLocalStorage = (cartData) => {
  localStorage.setItem("cart", JSON.stringify(cartData));
};
const cartReducer = (state = initCart, action) => {
  //Thực hiện viết logic xử lý action
  //Add to cart
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.carts.findIndex(
        (item) => item.id === action.payload.id
      );
      //action.payload.id là id của item muốn thêm vào giỏ hàng
      if (existingItemIndex !== -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng
        const updateCart = state.carts.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.amount }
            : item
        );
        return {
          ...state,
          carts: updateCart,
          amountItem: state.amountItem,
        };
      } else {
        //Sản phẩm chưa có trong giỏ hàng
        return {
          ...state,
          carts: [
            ...state.carts,
            { ...action.payload, quantity: action.payload.amount },
          ],
          amountItem: state.amountItem + 1,
        };
      }
    case "TOTAL_CART":
      let total = 0;
      state.carts.map((item) => {
        total += item.price * 0.1 * item.quantity;
      });
      const newState = {
        ...state,
        totalAmount: total,
      };
      saveCartToLocalStorage(newState);
      return newState;

    case "REMOVE_ITEM_CART":
      return {
        ...state,
        carts: state.carts.filter((item) => item.id !== action.payload.id),
      };

    case "CLEAR_CART":
      return {
        ...state,
        carts: [],
      };
    default:
      return state;
  }
};

export default cartReducer;
