import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Navbar = () => {
  const { products, token } = useSelector((state) => {
    return {
      products: state.cart.products,
      token: state.token.value
    }
  });
  const [showBasic, setShowBasic] = useState(false)
  const dispatch = useDispatch()
  const { data, loading, error } = useFetch("categoryAPI", "getAll")
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(clear())
    if (window.confirm("đang xuất thành công, bạn có muốn chuyển đến trang đăng nhập?"))
      navigate("/login")
  }

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
                        <Link to={`products/${cate._id}`}>
                          {cate.name}
                        </Link>
                      </MDBDropdownItem>
                    )
                  }
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <MDBDropdown>
            <MDBDropdownToggle tag='a' className='nav-link' role='button'>
              <MDBIcon role='button' fas icon="search" />
            </MDBDropdownToggle>

            <MDBDropdownMenu>
              <form className='d-flex input-group w-auto'>
                <input type='search' className='form-control' placeholder='Type query' aria-label='Search' />
              </form>
            </MDBDropdownMenu>
          </MDBDropdown>

          <MDBDropdown>
            <MDBDropdownToggle tag='a' role='button'>
              <MDBIcon fas icon="shopping-cart" />
              <span>{products.length}</span>
            </MDBDropdownToggle>

            <MDBDropdownMenu>
              <Cart />
            </MDBDropdownMenu>
          </MDBDropdown>

          <MDBDropdown style={{ marginLeft: "10px" }}>
            <MDBDropdownToggle tag='a' role='button'>
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

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >

  );
};

export default Navbar;
