import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import List from "../../components/List/List";
import useFetch from "../../hooks/useFetch";
import "./Products.scss";

const Products = () => {
  const catId = useParams().categoryId;
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState(null);
  const [selectedSubCats, setSelectedSubCats] = useState([]);

  const { data, loading, error } = useFetch("productAPI", "getByCategoryId", catId);
  const { data : trademarks } = useFetch("trademarkAPI", "getAll");

  const handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setSelectedSubCats(
      isChecked
        ? [...selectedSubCats, value]
        : selectedSubCats.filter((product) => product !== value)
    );
  };

  return (
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
                  onChange={handleChange}
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
                min={0}
                max={1000}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <span>{maxPrice}</span>
            </div>
          </div>
          <div className="filterItem">
            <h2>Sắp xếp</h2>
            <div className="inputItem">
              <input
                type="radio"
                id="asc"
                value="asc"
                name="price"
                onChange={(e) => setSort("asc")}
              />
              <label htmlFor="asc">Giá (Từ thấp tới cao)</label>
            </div>
            <div className="inputItem">
              <input
                type="radio"
                id="desc"
                value="desc"
                name="price"
                onChange={(e) => setSort("desc")}
              />
              <label htmlFor="desc">Giá (Từ cao tới thấp)</label>
            </div>
          </div>
        </div>
        <div className="right">
          <img
            className="catImg"
            src="https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/w_1423,c_limit/5f205755-7e49-42ef-84c6-c2c6a85fd000/nike-just-do-it.jpg"
            alt=""
          />
          <List products={data} catId={catId} maxPrice={maxPrice} sort={sort} subCats={selectedSubCats} />
        </div>
      </div>
  );
};

export default Products;
