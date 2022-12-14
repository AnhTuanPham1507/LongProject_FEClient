import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
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
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const products = useSelector((state) => state.cart.products);
  const [showBasic, setShowBasic] = useState(false)

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
            <MDBDropdownToggle tag='a'role='button'>
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
    // <div className="navbar">
    //   <div className="wrapper">
    //     <div className="left">
    //       <div className="item">
    //         <img src="/img/en.png" alt="" />
    //         <KeyboardArrowDownIcon />
    //       </div>

    //       <div className="item">
    //         <Link className ="link" to="/products/1">Women</Link>
    //       </div>
    //       <div className="item">
    //         <Link className ="link" to="/products/2">Men</Link>
    //       </div>
    //       <div className="item">
    //         <Link className ="link" to="/products/3">Children</Link>
    //       </div>
    //     </div>
    //     <div className="center">
    //       <Link className ="link" to="/">LAMASTORE</Link>
    //     </div>
    //     <div className="right">
    //       <div className="item">
    //         <Link className ="link" to="/">Homepage</Link>
    //       </div>
    //       <div className="item">
    //         <Link className ="link" to="/">About</Link>
    //       </div>
    //       <div className="item">
    //         <Link className ="link" to="/">Contact</Link>
    //       </div>
    //       <div className="item">
    //         <Link className ="link" to="/">Stores</Link>
    //       </div>
    //       <div className="icons">
    //         <SearchIcon/>
    //         <PersonOutlineOutlinedIcon/>
    //         <FavoriteBorderOutlinedIcon/>
    //         <div className="cartIcon" onClick={()=>setOpen(!open)}>
    //           <ShoppingCartOutlinedIcon/>
    //           <span>{products.length}</span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {open && <Cart/>}
    // </div>
  );
};

export default Navbar;
