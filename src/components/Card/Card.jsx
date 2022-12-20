import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../../utils/FormatPrice";

const Card = ({ item }) => {
  return (

    <Link className="link" to={`/product/${item._id}`}>
      <div className="card">
        <div className="image">
          {<span>New Season</span>}
          <img
            src={
              process.env.REACT_APP_CLOUDINARY_URL + item.imgs[0]
            }
            alt="mainImg"
            className="mainImg"
          />
          <img
            src={
              process.env.REACT_APP_CLOUDINARY_URL + item.imgs[1]
            }
            alt="secondImg"
            className="secondImg"
          />
        </div>
        <h2>{item.name}</h2>
        <div className="prices">
          <h3>${item.price && numberWithCommas(item.price + 20)}</h3>
          <h3>${item.price && numberWithCommas(item.price)}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Card;
