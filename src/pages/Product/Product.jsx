import React, { useEffect } from "react";
import { useState } from "react";
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useFetch from "../../hooks/useFetch";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import { numberWithCommas } from "../../utils/FormatPrice";
import { MDBIcon } from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
import { fDate } from "../../utils/formatTime";

const Product = () => {
  const {id} = useParams();
  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(null)
  const [maxQuantity, setMaxQuantity] = useState(0)

  const dispatch = useDispatch();
  const { data } = useFetch("productAPI", "getById", id);
  const {data:rates} = useFetch("ratingAPI", "getByProductId", id);

  useEffect(() => {
    if (data)
      setSelectedImg(data.imgs[0])
  }, [data])

  useEffect(() => {

    const foundConsignment = data?.r_consignments.find(c => c.size === size)
    if (foundConsignment) {
      const tempTotalQuantity = foundConsignment.quantity
      if (tempTotalQuantity < quantity)
        setQuantity(tempTotalQuantity)
      setMaxQuantity(tempTotalQuantity)
    } else {
      setMaxQuantity(0)
      setQuantity(1)
    }

  }, [size])

  function handleAddToCart() {
    if (quantity === 0 || size === null)
      alert('Quý khách vui lòng kích cỡ và số lượng phù hợp')
    else {
      dispatch(addToCart({
        _id: data._id, 
        name: data.name,
        description: data.description,
        price: data.price,
        img: data.imgs[0],
        quantity,
        size
      }))
    }
  }

  return (
    <div className="product">
      {!data && !rates ? (
        "loading"
      ) : (
        <>
          <div className="left">
            <div className="left__images">
              <div className="images">
                {
                  data?.imgs.map((img,index) => (
                    <img
                      key={index}
                      src={
                        process.env.REACT_APP_CLOUDINARY_URL +
                        img
                      }
                      onClick={() => setSelectedImg(img)}
                      alt={img}
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
            <div className="left__des">
              <h2>Thông tin chi tiết: </h2>
              <p>{data?.description}</p>
            </div>
            <div style={{ marginTop: "30px" }} class="left__des tab-content">
                    <div className="tab-pane active" id="tabs-7" role="tabpanel">
                        <div className="product__details__tab__content">
                            <h3 >Mức độ hài lòng {rates?.length > 0 ? (rates?.reduce((total, rate) => total += rate.star, 0)/rates?.length): 5}/5</h3>
                            {
                                rates?.map(rate => (
                                    <div key={rate._id} class="product__details__tab__content__item">
                                        <StarRatings
                                            rating={rate.star}
                                            starRatedColor="#fa8c16"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="25px"
                                            starSpacing="5px"
                                        />
                                        <p><strong>{rate.r_user.name}</strong>: {rate.comment}</p>
                                        <strong>{fDate(rate.createdAt)}</strong>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
          </div>

          <div className="right">
            <h1>{data?.name}</h1>
            <span className="price">{numberWithCommas(data ? data.price : 1)}</span>
            <div>
              <h3>Size</h3>
              {
                data?.r_consignments
                  .map((consignment) => (
                    <button
                      key={consignment._id}
                      className={consignment.size === size ? "right__item active" : "right__item"}
                      onClick={() => { setSize(consignment.size) }}
                    >
                      {consignment.size}
                    </button>
                  ))
              }
            </div>


            <h3>Số lượng</h3>
            <span className={maxQuantity <= 0 ? "outstock" : ""} >{maxQuantity > 0 ? `còn ${maxQuantity} đôi` : "hết hàng"}</span>
            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              {quantity}
              <button onClick={() => setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev))}>+</button>
            </div>
            <button
              className="add"
              onClick={handleAddToCart}
            >
              <AddShoppingCartIcon /> ADD TO CART
            </button>
            <div className="links">
              <Link to="/payment" className="item">
                <MDBIcon fas icon="plane-departure" />Go to Pay
              </Link>
            </div>

            <hr />
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
