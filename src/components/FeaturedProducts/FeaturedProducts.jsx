import React from "react";
import Card from "../Card/Card";
import "./FeaturedProducts.scss";

const FeaturedProducts = ({ type,data,content }) => {

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1> Sản phẩm {type}</h1>
        <p>
          {content}
        </p>
      </div>
      <div className="bottom">
        {data?.map((item) => <Card item={item} key={item._id} />)}
      </div>
    </div>
  );
};

export default FeaturedProducts;
