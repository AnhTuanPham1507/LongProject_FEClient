import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";

const Navbar = () => {
  const products = useSelector((state) => state.cart.products);
  const [showBasic, setShowBasic] = useState(false)

  const { data, loading, error } = useFetch("categoryAPI", "getAll")

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
                    data.map(cate =>
                      <MDBDropdownItem >
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

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >

  );
};

export default Navbar;
