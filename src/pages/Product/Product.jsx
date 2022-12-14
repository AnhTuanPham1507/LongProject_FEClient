import React, { useEffect } from "react";
import { useState } from "react";
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import useFetch from "../../hooks/useFetch";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import { numberWithCommas } from "../../utils/FormatPrice";
import { MDBIcon } from "mdb-react-ui-kit";

const Product = () => {
  const id = useParams().id;
  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const { data, loading, error } = useFetch(`productAPI`, "getById", id);

  useEffect(() => {
    if (data)
      setSelectedImg(data.r_productDetails[0].img)
  }, [data])

  return (
    <div className="product">
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="left">
            <div className="images">
              {
                data?.r_productDetails?.map(detail => (
                  <img
                    key={detail._id}
                    src={
                      process.env.REACT_APP_CLOUDINARY_URL +
                      detail?.img
                    }
                    onClick={() => setSelectedImg(detail?.img)}
                    alt="img"
                  />
                ))
              }
            </div>
            <div className="mainImg">
              <img
                src={
                  process.env.REACT_APP_CLOUDINARY_URL +
                  selectedImg
                }
                alt="mainImg"
              />
            </div>
          </div>
          <div className="right">
            <h1>{data?.name}</h1>
            <span className="price">{numberWithCommas(data ? data.price : 1)}</span>
            <p>{data?.description}</p>
            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              {quantity}
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>
            <button
              className="add"
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: data._id,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    img: selectedImg,
                    quantity,
                  })
                )
              }
            >
              <AddShoppingCartIcon /> ADD TO CART
            </button>
            <div className="links">
              <Link to="/payment" className="item">
              <MDBIcon fas icon="plane-departure" />Go to Pay
              </Link>
            </div>
            <div className="info">
              <span>Caregory: {data?.r_category?.name}</span>
              <span>Trademark: {data?.r_trademark?.name}</span>
            </div>
            <hr />
            <div className="info">
              <span>DESCRIPTION</span>
              <hr />
              <span>{data?.description}</span>
              <hr />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
