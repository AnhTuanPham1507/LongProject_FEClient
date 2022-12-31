import React, { useEffect, useState } from 'react';
import { Alert, Container, Form, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from '../../utils/FormatPrice';
import ORDERSTATUS from '../../enums/orderStatus';
import useFetch from '../../hooks/useFetch';
import { fDate } from '../../utils/formatTime';
import RatingViewModal from '../../components/Rating/Rating';

function Order() {
    const [ratingOrder, setRatingOrder] = useState(null)
    const { token } = useSelector(state => {
        return {
            token: state.token.value
        }
    })
    const { data: orders, loading, error } = useFetch("exportOrderAPI", "getAll", token);
    const [isShowRatingModal, setIsShowRatingModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(orders){
            if (orders.length > 0) {
                if (!orders[0].isRated) {
                    setIsShowRatingModal(true)
                    setRatingOrder(orders[0])
                }
            }
        }
    }, [orders])

    useEffect(() => {
        if (error)
            navigate("/error")
    }, [error])

    function handleCloseRatingModal() {
        setIsShowRatingModal(false)
    }

    return (
        loading ?
            "loading..." :
            <>
                <Table style={{ marginTop: 30 }} striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Tên người nhận </th>
                            <th>Số diện thoại</th>
                            <th>Email</th>
                            <th>Nơi nhận hàng</th>
                            <th>Chi tiết...</th>
                            <th>Tổng tiền</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái Đơn</th>
                            <th>Trạng thái thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1}</td>
                                    <td>{order.name}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.email}</td>
                                    <td>{order.address}</td>
                                    <td>
                                        <Form.Select>
                                            {
                                                order.r_exportOrderDetails?.map(detail => (
                                                    <option>
                                                        {detail.r_product.name} kích cỡ {detail.size} - {detail.quantity} cái
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </td>
                                    <td>{numberWithCommas(order.totalBill)}</td>
                                    <td>{fDate(order.createdAt)}</td>
                                    <td>
                                        {
                                            <Alert variant={order.status === 'falied' ? "danger" : "success"}>
                                                {ORDERSTATUS[order.status]}
                                            </Alert>
                                        }
                                    </td>
                                    <td>
                                        {
                                            <Alert variant={order.isPaid ? "success" : "danger"}>
                                                {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </Alert>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <RatingViewModal
                    isShow={isShowRatingModal}
                    onClose={handleCloseRatingModal}
                    token={token}
                    ratingOrder={ratingOrder}
                />
            </>
    );
}

export default Order;