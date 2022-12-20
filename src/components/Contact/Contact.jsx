import React from "react";
import "./Contact.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import PinterestIcon from "@mui/icons-material/Pinterest";

const Contact = () => {
  return (
    <div className="contact">
      <div className="wrapper">
        <span>Đăng ký nhận mã khuyến mãi cho khách hàng mới</span>
        <div className="mail">
          <input type="text" placeholder="Nhập e-mail của bạn" />
          <button>Đăng ký</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
