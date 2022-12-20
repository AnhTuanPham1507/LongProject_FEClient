import React from "react";
import "./Cart.scss";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector } from "react-redux";
import { removeItem, resetCart } from "../../redux/cartReducer";
import { useDispatch } from "react-redux";
import { numberWithCommas } from "../../utils/FormatPrice";
import { Link } from "react-router-dom";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  };


  return (
    <div className="cart">
      <h1>Giỏ hàng</h1>
      {products?.map((item) => (
        <div className="item" key={item._id}>
          <img src={process.env.REACT_APP_CLOUDINARY_URL + item.img} alt="" />
          <div className="details">
            <h1>{item.name}</h1>
            <p>{item.description?.substring(0, 100)}</p>
            <p>Số lượng: {item.quantity} sản phẩm</p>
            <div className="price">
              {numberWithCommas(item.quantity*item.price)}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            onClick={() => {
              dispatch(removeItem({id: item._id, size: item.size}))
            }}
          />
        </div>
      ))}
      <div className="total">
        <span>Tổng tiền</span>
        <span>{numberWithCommas(totalPrice())}</span>
      </div>
      <Link to="/payment">Thanh toán giỏ hàng</Link>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Xóa giỏ hàng
      </span>
    </div>
  );
};

export default Cart;
