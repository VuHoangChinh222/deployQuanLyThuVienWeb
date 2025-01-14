import { createStore, combineReducers } from "redux";
import cartReducer from "./reducers/cartReducer";
const rootReducer = combineReducers({ cart: cartReducer }); //chữ 'cart' đại diện cho cartReducer
const store = createStore(rootReducer);
export default store; //Store chứa các reducer thực hiện các phương thức để làm việc với giỏ hàng: thêm, xóa, sửa số lượng sản phẩm
