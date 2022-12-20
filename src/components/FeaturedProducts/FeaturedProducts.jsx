import React from "react";
import Card from "../Card/Card";
import "./FeaturedProducts.scss";
import useFetch from "../../hooks/useFetch";

const FeaturedProducts = ({ type }) => {
  const { data, loading, error } = useFetch("productAPI", "getAll");

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1> Sản phẩm {type}</h1>
        <p>
          Từ một cơ sở sản xuất nhỏ khởi nghiệp từ năm 1982 và trở thành HTX
          mang tên Bình Tiên chuyên sản xuất dép Cao su tại Quận 6 với vài chục
          công nhân và hơn hết là một tấm lòng vì sự phát triển kinh tế đất nước
          của những người chủ tâm huyết, Biti’s đã trải qua giai đoạn của nền
          kinh tế bao cấp với nhiều khó khăn. Thế nhưng, hơn 33 năm trôi qua,
          như một “bước chân không mỏi”, Công ty TNHH Sản Xuất Hàng Tiêu Dùng
          Bình Tiên (Biti’s) đã từng bước xây dưng cho mình một chiến lược sản
          xuất và xuất khẩu mang tầm thời đại, tạo ra một thương hiệu Giày dép
          Biti’s gắn liền với nhu cầu, thị hiếu người tiêu dùng. Hiện nay, công
          ty Biti’s trở thành một đơn vị mạnh, thể hiện sự bứt phá trong lãnh
          vực SXKD giày dép; có đủ nhân lực, vật lực, tài lực để phát triển gành
          nghề và đem đến những thành quả cao hơn.
        </p>
      </div>
      <div className="bottom">
        {error
          ? "Something went wrong!"
          : loading
          ? "loading"
          : data?.map((item) => <Card item={item} key={item._id} />)}
      </div>
    </div>
  );
};

export default FeaturedProducts;
