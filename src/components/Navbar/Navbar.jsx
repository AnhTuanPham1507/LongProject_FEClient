import React, { useEffect, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import Cart from "../Cart/Cart";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { clear } from "../../redux/tokenReducer";
import "./Navbar.scss"
import { ListGroup } from "react-bootstrap";
import makeRequest from "../../makeRequest";
import axios from "axios";
import Notification from "../Notification/Notification";

const Navbar = () => {
  const { products, token } = useSelector((state) => {
    return {
      products: state.cart.products,
      token: state.token.value
    }
  });
  const [showBasic, setShowBasic] = useState(false)
  const [isShowSearchbar, setIsShowSearchbar] = useState(false)
  const [suggestedProcucts, setSuggestedProducts] = useState([])
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch()
  const { data, loading, error } = useFetch("categoryAPI", "getAll")
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(clear())
    if (window.confirm("đang xuất thành công, bạn có muốn chuyển đến trang đăng nhập?"))
      navigate("/login")
  }

  function closeSearchbar() {
    setSearchTerm("")
    setIsShowSearchbar(false)
  }

  async function handleSearchSubmit(e) {
    e.preventDefault()
    navigate(`/products?searchTerm=${searchTerm}`)
    closeSearchbar()
  }

  const handleMarkRead = async (notification) => {
    try {
      await makeRequest.notificationAPI.updateIsRead(notification._id);
    } catch (error) {
      if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message));
      else alert((error.toString()));
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const temp = notifications.filter(n => !n.isRead)
      if (temp.length > 0) {
        await Promise.all(temp.map(n => handleMarkRead(n)))
        const tempNotifications = [...notifications.map(n => {
          return {
            ...n,
            isRead: true
          }
        })]
        setNotifications(tempNotifications)
      }
    } catch (error) {
      if (axios.isAxiosError(error))
        alert((error.response ? error.response.data.message : error.message));
      else alert((error.toString()));
    }
  };

  useEffect(() => {
    async function search() {
      if (searchTerm !== "") {
        try {
          const res = await makeRequest.productAPI.filter(`name=${searchTerm}`)
          setSuggestedProducts(res.data.docs)
        } catch (error) {
          if (axios.isAxiosError(error))
            alert(error.response ? error.response.data.message : error.message)
          else
            alert(error.toString())
        }
      } else {
        setSuggestedProducts([])
      }
    }
    const myTimeout = setTimeout(search, 200)
    return () => {
      clearTimeout(myTimeout)
    }
  }, [searchTerm])

  useEffect(() => {
    async function getNotifications() {
      try {
        const res = await makeRequest.notificationAPI.getAll(token);
        console.log(res.data)
        setNotifications(res.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          alert((error.response ? error.response.data.message : error.message));
        else alert((error.toString()));
      }
    }
    getNotifications();
  }, [])

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand >
          <Link to="/">
            <img
              src='https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.webp'
              height='30'
              alt=''
              loading='lazy'
            />
          </Link>
        </MDBNavbarBrand>
        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Thể loại giày
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {
                    data?.map(cate =>
                      <MDBDropdownItem key={cate._id}>
                        <Link to={`products/?cateId=${cate._id}`}>
                          {cate.name}
                        </Link>
                      </MDBDropdownItem>
                    )
                  }
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <form onSubmit={handleSearchSubmit}>
            <input className={isShowSearchbar ? "search-input__active" : "search-input"} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type="text" placeholder="Tìm kiếm" />
            <ListGroup style={{ zIndex: 9999 }} as="ul" variant="flush" className="suggest-list">
              {
                suggestedProcucts.map(p => (
                  <Link onClick={closeSearchbar} to={`/product/${p._id}`}>
                    <ListGroup.Item key={p._id} as="li">{p.name}</ListGroup.Item>
                  </Link>
                ))
              }
            </ListGroup>
          </form>

          <MDBIcon
            onClick={() => {
              setSearchTerm("")
              setIsShowSearchbar(!isShowSearchbar)
            }}
            style={{ marginRight: 20 }} role='button' fas icon="search"
          />

          <MDBDropdown style={{ marginRight: 20 }}>
            <MDBDropdownToggle style={{ color: "black" }} tag='a' role='button'>
              <MDBIcon fas icon="shopping-cart" />
              <span>{products.length > 0 && products.length}</span>
            </MDBDropdownToggle>

            <MDBDropdownMenu>
              <Cart />
            </MDBDropdownMenu>
          </MDBDropdown>

          <MDBDropdown style={{ marginRight: 20 }}>
            <MDBDropdownToggle style={{ color: "black" }} tag='a' role='button'>
              <MDBIcon fas icon="user" />
            </MDBDropdownToggle>

            <MDBDropdownMenu>
              {
                token === null ?
                  <>
                    <MDBDropdownItem>
                      <Link to="login">
                        Đăng nhập
                      </Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <Link to="register">
                        Đăng ký
                      </Link>
                    </MDBDropdownItem>
                  </> :
                  <>
                    <MDBDropdownItem>
                      <Link to="user">
                        Thông tin tài khoản
                      </Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <Link to="order">
                        Xem đơn hàng
                      </Link>
                    </MDBDropdownItem>
                    <MDBDropdownItem onClick={() => { handleLogout() }}>
                      <Link>
                        Đăng xuất
                      </Link>
                    </MDBDropdownItem>
                  </>
              }


            </MDBDropdownMenu>
          </MDBDropdown>
          <MDBDropdown onClick={handleMarkAllAsRead}>
            <MDBDropdownToggle style={{ color: "black" }} tag='a' role='button'>
              <MDBIcon fas icon="bell" />
              <span>{notifications.filter(n => !n.isRead).length > 0 && notifications.filter(n => !n.isRead).length}</span>
            </MDBDropdownToggle>

            <MDBDropdownMenu className="Updates">
              {
                notifications.map(n => (
                  <MDBDropdownItem>
                    <Notification n={n} />
                  </MDBDropdownItem>
                ))
              }
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >

  );
};

export default Navbar;
