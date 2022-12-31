import React from "react";
import "./List.scss";
import Card from "../Card/Card";
import useFetch from "../../hooks/useFetch";

const List = ({ products}) => {

  return (
    <div className="list">
       {products?.map((item) => <Card item={item} key={item._id} />)}
    </div>
  );
};

export default List;
