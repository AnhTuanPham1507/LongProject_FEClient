import React from "react";
import notificationContent from "../../enums/notificationContent";
import { fDate, fToNow } from "../../utils/formatTime";
import "./Notification.css";

const Notification = (props) => {
  const {n} = props

  return (
      <div className="update">
        <img src={`${process.env.REACT_APP_CLOUDINARY_URL}${n.r_order.r_exportOrderDetails[0].r_product.imgs[0]}`} alt="profile" />
        <div className="noti">
          <div style={{ marginBottom: '0.5rem' }}>
            <span>Hệ Thống</span>
            <div style={{width: 300, overflowWrap: "break-word"}}>Đơn hàng gồm{n.r_order.r_exportOrderDetails.reduce((str,i) => `${str}${i.r_product.name} kích thước ${i.size} ${i.quantity} đôi `,"")} đặt ngày {fDate(n.r_order.createdAt)} {notificationContent[n.r_order.status]}</div>
          </div>
          <span>{fToNow(n.createdAt)}</span>
        </div>
      </div>
  );
};

export default Notification;
