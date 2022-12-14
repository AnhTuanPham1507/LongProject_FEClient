import axios from "axios";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTooltip,
    MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer";
import { numberWithCommas } from "../../utils/FormatPrice";
import apiAgent from '../../makeRequest'
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

function Payment() {
    const cartItems = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [citites, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [activeCity, setActiveCity] = useState(null)
    const [activeDistrict, setActiveDistrict] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [address, setAddress] = useState(null)
    const [paymentType, setPaymentType] = useState("in_person")

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

    async function handlePaymentSubmit(e) {
        e.preventDefault()
        try {
            const orderData = {
                name,
                email,
                phone,
                paymentType,
                totalBill: cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
                address: `${address} ${activeDistrict.name} ${activeCity.name}`,
                r_exportOrderDetails: cartItems.map(item => {
                    return {
                        quantity: item.quantity,
                        price: item.price,
                        r_productDetail: "6385bfdd4eef523cf3867a37"
                    }
                })
            }
            console.log(orderData)
            const res = await apiAgent.exportOrderAPI.create(orderData)
            window.location.href = res.data.data.payUrl
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
                                    Cart - {cartItems.length} items
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
                                                    <p>Color: blue</p>
                                                    <p>Size: M</p>

                                                    <MDBTooltip
                                                        wrapperProps={{ size: "sm" }}
                                                        wrapperClass="me-1 mb-2"
                                                        title="Remove item"
                                                        onClick={() => dispatch(removeItem(item._id))}
                                                    >
                                                        <MDBIcon fas icon="trash" />
                                                    </MDBTooltip>

                                                </MDBCol>
                                                <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                                                    <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                                                        <MDBBtn
                                                            className="px-3 me-2"
                                                            onClick={() => {
                                                                if (item.quantity == 1)
                                                                    dispatch(removeItem(item))
                                                                else
                                                                    dispatch(addToCart({ _id: item._id, quantity: -1 }))
                                                            }}
                                                        >
                                                            <MDBIcon fas icon="minus" />
                                                        </MDBBtn>

                                                        <MDBInput disabled value={item.quantity} min={1} type="number" label="Quantity" />

                                                        <MDBBtn
                                                            className="px-3 ms-2"
                                                            onClick={() => {
                                                                dispatch(addToCart({ _id: item._id, quantity: 1 }))
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
                                    Order Informations
                                </MDBTypography>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBListGroup flush>

                                    <Form onSubmit={(e) => { handlePaymentSubmit(e) }}>
                                        <Form.Group className="mb-3" >
                                            <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Control pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b" value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Enter Phone" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Control pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Enter Address" />
                                        </Form.Group>

                                        <Form.Group style={{ display: "flex" }} className="mb-3" >
                                            <Form.Select onChange={(e) => setActiveCity(citites.find(city => city.code == e.target.value))} style={{ marginRight: "3px" }} aria-label="Default select example">
                                                {
                                                    citites.map(city => (
                                                        <option key={city.code} value={city.code}>{city.name}</option>
                                                    ))
                                                }
                                            </Form.Select>
                                            <Form.Select value={activeDistrict} onChange={(e) => setActiveDistrict(districts.find(district => district.code === e.target.value))} style={{ marginRight: "3px" }} aria-label="Default select example">
                                                {
                                                    districts.map(district => (
                                                        <option key={district.code} value={district.code}>{district.name}</option>
                                                    ))
                                                }
                                            </Form.Select>

                                        </Form.Group>

                                        <Form.Group className="mb-3" >
                                            <Form.Select onChange={(e) => setPaymentType(e.target.value)} aria-label="Default select example">
                                                <option value="in_person">In Person</option>
                                                <option value="momo">MoMo</option>
                                            </Form.Select>

                                        </Form.Group>
                                        <MDBListGroupItem
                                            className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Total</strong>
                                            </div>
                                            <span>
                                                <strong>{numberWithCommas(cartItems.reduce((total, item) => total + item.quantity * item.price, 0))}</strong>
                                            </span>
                                        </MDBListGroupItem>
                                        <MDBBtn type="submit" block size="lg">
                                            Go to checkout
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