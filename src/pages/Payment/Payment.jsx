import axios from "axios";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer";
import { numberWithCommas } from "../../utils/FormatPrice";
import apiAgent from '../../makeRequest'
import useFetch from "../../hooks/useFetch";
import { usePlacesWidget } from "react-google-autocomplete";
import makeRequest from "../../makeRequest";

function Payment() {
    const cartItems = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();

    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [activeCity, setActiveCity] = useState(null)
    const [activeDistrict, setActiveDistrict] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [address, setAddress] = useState(null)
    const [paymentType, setPaymentType] = useState("in_person")
    const [shippingCharges, setShippingCharges] = useState(0)


    const { ref } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        onPlaceSelected: (place) => { console.log(place) },
        options: { fields: ["place_id"] },
        language: "vi"
    })

    const { data: loadCities, loading, error } = useFetch("provinceAPI", "getAll");

    useEffect(() => {
        if (loadCities) {
            setCities(loadCities)
            setActiveCity(loadCities[0])
        }
    }, [loadCities])

    useEffect(() => {
        if (activeCity) {
            setDistricts(activeCity.districts)
            setActiveDistrict(activeCity.districts[0])
        }
    }, [activeCity])

    useEffect(() => {
        async function calculateShippingCharges() {
            try {
                const resGeoCode = await makeRequest.provinceAPI.getGeoCodeing(`${address}, ${activeDistrict.name}, ${activeCity.name}`)
                const firstGeoCode = resGeoCode.data.features[0].center
                const myLng = parseFloat(process.env.REACT_APP_MY_GEOCODE_LNG)
                const myLat = parseFloat(process.env.REACT_APP_MY_GEOCODE_LAT)
                const resShippingCharges = await makeRequest.provinceAPI.calculateShippingCharges({ myLng, myLat, cusLng: firstGeoCode[0], cusLat: firstGeoCode[1] })
                const tempShippingCharges = Math.round(resShippingCharges.data.routes[0].distance * parseInt(process.env.REACT_APP_CHARGES_PER_MET))
                setShippingCharges(tempShippingCharges)
            } catch (error) {
                alert(error)
            }
        }

        if (address !== "" && activeCity && activeDistrict)
            calculateShippingCharges()
    }, [address, activeDistrict])

    async function handlePaymentSubmit(e) {
        e.preventDefault()
        try {
            const orderData = {
                name,
                email,
                phone,
                paymentType,
                address: `${address}, ${activeDistrict.name}, ${activeCity.name}`,
                totalBill: cartItems.reduce((total, item) => total + item.quantity * item.price, 0) + shippingCharges,
                r_exportOrderDetails: cartItems.map(item => {
                    return {
                        quantity: item.quantity,
                        price: item.price,
                        r_product: item._id,
                        size: item.size
                    }
                })
            }
            const res = await apiAgent.exportOrderAPI.create(orderData)
            window.location.href = res.data.payUrl
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response.data.message)
                return
            }
            console.log(error.toString())
        }
    }

    return (
        <MDBContainer className="py-5 h-100">
            {loading ? (
                "loading"
            ) : (
                <MDBRow className="justify-content-center my-4">
                    <MDBCol md="8">
                        <MDBCard style={{ width: "100%" }}>
                            <MDBCardHeader className="py-3">
                                <MDBTypography tag="h5" className="mb-0">
                                    Có - {cartItems.length} sản phẩm
                                </MDBTypography>
                            </MDBCardHeader>
                            <MDBCardBody >
                                {
                                    cartItems.map(item => (
                                        <>
                                            <MDBRow >
                                                <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                                                    <MDBRipple rippleTag="div" rippleColor="light"
                                                        className="bg-image rounded hover-zoom hover-overlay">
                                                        <img
                                                            src={process.env.REACT_APP_CLOUDINARY_URL + item.img}
                                                            className="w-100" />
                                                        <a href="#!">
                                                            <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)", }}>
                                                            </div>
                                                        </a>
                                                    </MDBRipple>
                                                </MDBCol>

                                                <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                                                    <p>
                                                        <strong>{item.name}</strong>
                                                    </p>
                                                    <p>Size: {item.size}</p>

                                                    <MDBBtn
                                                        className="px-3 me-2"
                                                        onClick={() => {
                                                            dispatch(removeItem({ id: item._id, size: item.size }))
                                                        }}
                                                    >
                                                        <MDBIcon fas icon="trash" />
                                                    </MDBBtn>

                                                </MDBCol>
                                                <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                                                    <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                                                        <MDBBtn
                                                            className="px-3 me-2"
                                                            onClick={() => {
                                                                if (item.quantity == 1)
                                                                    dispatch(removeItem({ id: item._id, size: item.size }))
                                                                else
                                                                    dispatch(addToCart({ _id: item._id, size: item.size, quantity: -1 }))
                                                            }}
                                                        >
                                                            <MDBIcon fas icon="minus" />
                                                        </MDBBtn>

                                                        <MDBInput disabled value={item.quantity} min={1} type="number" label="Quantity" />

                                                        <MDBBtn
                                                            className="px-3 ms-2"
                                                            onClick={() => {
                                                                dispatch(addToCart({ _id: item._id, size: item.size, quantity: 1 }))
                                                            }}
                                                        >
                                                            <MDBIcon fas icon="plus" />
                                                        </MDBBtn>
                                                    </div>

                                                    <p className="text-start text-md-center">
                                                        <strong>{numberWithCommas(item.price)}</strong>
                                                    </p>
                                                </MDBCol>
                                            </MDBRow>

                                            <hr className="my-4" />
                                        </>
                                    ))
                                }
                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>
                    <MDBCol md="4">
                        <MDBCard className="mb-4">
                            <MDBCardHeader>
                                <MDBTypography tag="h5" className="mb-0">
                                    Thông tin đơn hàng
                                </MDBTypography>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBListGroup flush>

                                    <Form onSubmit={(e) => { handlePaymentSubmit(e) }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Tên người nhận</Form.Label>
                                            <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Label>Số diện thoại</Form.Label>
                                            <Form.Control pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b" value={phone} onChange={(e) => setPhone(e.target.value)} type="text" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Label>Địa chỉ email</Form.Label>
                                            <Form.Control pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Phương thức thanh toán</Form.Label>
                                            <Form.Select onChange={(e) => setPaymentType(e.target.value)} aria-label="Default select example">
                                                <option value="in_person">Thanh toán khi nhận hàng</option>
                                                <option value="momo">Thanh toán qua ví điện tử MOMO</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Địa chỉ giao hàng</Form.Label>
                                            <Form.Control value={address} onChange={(e) => { setAddress(e.target.value) }} type="text" />
                                        </Form.Group>

                                        <Form.Group style={{ display: "flex" }} className="mb-3" >
                                            <Form.Select onChange={(e) => {
                                                const foundCity = cities.find(city => city.code === Number(e.target.value))
                                                if (foundCity)
                                                    setActiveCity(foundCity)
                                            }} style={{ marginRight: "5px" }}>
                                                {
                                                    cities.map(city =>
                                                        <option key={city.code} value={city.code}>{city.name}</option>
                                                    )
                                                }
                                            </Form.Select>
                                            <Form.Select onChange={(e) => {
                                                const foundDistrict = districts.find(district => district.code === Number(e.target.value))
                                                if (foundDistrict)
                                                    setActiveDistrict(foundDistrict)
                                            }} style={{ marginRight: "5px" }}>
                                                {
                                                    districts.map(district =>
                                                        <option key={district.code} value={district.code}>{district.name}</option>
                                                    )
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                        <p>-------------------------------------------</p>
                                        <MDBListGroupItem
                                            className="d-flex justify-content-between align-items-center border-0 px-0 mb-3"
                                            style={{ marginBottom: "0" }}
                                        >
                                            <div>
                                                Phí giao hàng
                                            </div>
                                            <span>
                                                {numberWithCommas(shippingCharges)}
                                            </span>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem
                                            className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                Tạm tính
                                            </div>
                                            <span>
                                                {numberWithCommas(cartItems.reduce((total, item) => total + item.quantity * item.price, 0))}
                                            </span>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem
                                            className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Tổng cộng</strong>
                                            </div>
                                            <span>
                                                <strong>{numberWithCommas(cartItems.reduce((total, item) => total + item.quantity * item.price, 0) + shippingCharges)}</strong>
                                            </span>
                                        </MDBListGroupItem>
                                        <MDBBtn type="submit" block size="lg">
                                            Thanh toán
                                        </MDBBtn>
                                    </Form>
                                </MDBListGroup>


                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            )}
        </MDBContainer>
    );
}

export default Payment 