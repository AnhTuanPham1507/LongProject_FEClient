import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import List from "../../components/List/List";
import useFetch from "../../hooks/useFetch";
import { numberWithCommas } from "../../utils/FormatPrice";
import "./Products.scss";

const Products = () => {
  const catId = useParams().categoryId;
  const navigate = useNavigate()
  const [subProducts, setSubProducts] = useState([]);

  const [maxPrice, setMaxPrice] = useState(100000000);
  const [sort, setSort] = useState("desc");
  const [selectedTrademarks, setSelectedTrademarks] = useState([])

  const { data: products, loading, error } = useFetch("productAPI", "getByCategoryId", catId);
  const { data: trademarks } = useFetch("trademarkAPI", "getAll");

  const handleCheckTrademark = (isChecked, trademarkId) => {
    if (isChecked) {
      const tempSelectedTrademarks = [...selectedTrademarks, trademarkId]
      setSelectedTrademarks(tempSelectedTrademarks)
    } else {
      const tempSelectedTrademarks = selectedTrademarks.filter(t => t !== trademarkId)
      setSelectedTrademarks(tempSelectedTrademarks)
    }
  }

  useEffect(() => {
    if (error)
      navigate("/error")
  }, [error])

  useEffect(() => {
    if (products)
      setSubProducts(products.sort((a, b) => b.price - a.price))
  }, [products])

  useEffect(() => {
    const myTimeout = setTimeout(() => {
      if (products) {
        let filterProducts = products.filter(p => p.price <= maxPrice)
        if(selectedTrademarks.length > 0)
          filterProducts = filterProducts.filter(p => selectedTrademarks.includes(p.r_trademark._id))
        if (sort === "desc")
          filterProducts.sort((a, b) => b.price - a.price)
        else
          filterProducts.sort((a, b) => a.price - b.price)
        console.log(selectedTrademarks)
        setSubProducts(filterProducts)
      }
    },500)
    return () => {
      clearTimeout(myTimeout)
    }
  }, [maxPrice, sort, selectedTrademarks])

  return (
    loading ?
      "loading..." :
      <div className="products">
        <div className="left">
          <div className="filterItem">
            <h2>Thương hiệu</h2>
            {trademarks?.map((trademark) => (
              <div className="inputItem" key={trademark._id}>
                <input
                  type="checkbox"
                  id={trademark._id}
                  value={trademark._id}
                  onChange={(e) => { handleCheckTrademark(e.target.checked, trademark._id) }}
                />
                <label htmlFor={trademark._id}>{trademark.name}</label>
              </div>
            ))}
          </div>
          <div className="filterItem">
            <h2>Khoảng giá</h2>
            <div className="inputItem">
              <span>0</span>
              <input
                type="range"
                min={1}
                max={10000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <span>{numberWithCommas(maxPrice)}</span>
            </div>
          </div>
          <div className="filterItem">
            <h2>Sắp xếp</h2>
            <div className="inputItem">
              <input
                type="radio"
                id="desc"
                value="desc"
                name="price"
                defaultChecked
                onChange={(e) => {setSort("desc")}}
              />
              <label htmlFor="desc">Giá (Từ cao tới thấp)</label>
            </div>
            <div className="inputItem">
              <input
                type="radio"
                id="asc"
                value="asc"
                name="price"
                onChange={(e) => {setSort("asc")}}
              />
              <label htmlFor="asc">Giá (Từ thấp tới cao)</label>
            </div>
          </div>
        </div>
        <div className="right">
          <img
            className="catImg"
            src="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/w_1423,c_limit/5f205755-7e49-42ef-84c6-c2c6a85fd000/nike-just-do-it.jpg"
            alt=""
          />
          <List products={subProducts} />
        </div>
      </div>
  );
};

export default Products;
