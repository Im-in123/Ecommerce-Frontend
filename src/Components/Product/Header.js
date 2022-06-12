import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addToCartAction,
  cartMessageAction,
  removeFromCartAction,
  searchAction,
} from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
import logo from "../../assets/logo.jpg";
import { logout } from "../../auth/authController";
const Header = () => {
  const navigate = useNavigate();
  const [cartNumber, setCartNumber] = useState(0);

  const {
    state: { cart },
    dispatch,
  } = useContext(store);
  const {
    state: { cartMessage },
  } = useContext(store);
  const {
    state: { categories },
  } = useContext(store);
  useEffect(() => {
    console.log("cartmsg", cartMessage);
    setCartNumber(cart?.length);
    let msg = document.getElementById("show-msg");

    if (cartMessage.item) {
      if (cartMessage.show) {
        if (cartMessage.action === addToCartAction) {
          msg.innerText = "Item added to cart!";
        }
        if (cartMessage.action === removeFromCartAction) {
          msg.innerText = "Item removed from to cart!";
        }
        msg.style.display = "flex";
      } else {
        msg.style.display = "none";
      }
    }
    setTimeout(() => {
      msg.style.display = "none";
    }, 4000);
    return () => {};
  }, [cart, cartMessage]);

  useEffect(() => {
    window.addEventListener("scroll", scrollFunction);

    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);
  const NavBar = () => {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  };
  const scrollFunction = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      document.getElementById("navbar").style.top = "0";
      document.getElementById("roll_back").style.display = "flex";
    } else {
      document.getElementById("navbar").style.top = "-100px";
      document.getElementById("roll_back").style.display = "none";
    }
  };

  const navigationContent = (arg) => {
    return (
      <>
        <Link to={`/list/`} id="logo2">
          <img src={logo} alt="" /> {/* <b>Decorish</b> */}
        </Link>

        <div className="search" onClick={() => navigate("search")}>
          <div className="search-input">
            <input
              type="search"
              className="search-field"
              placeholder=""
              name="search"
              value=""
              readOnly
            />
            <button id="search-btn">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <Link to={`/search`} className="mini-search">
          <i className="fa fa-search" aria-hidden="true"></i>
        </Link>
        {arg && (
          <Link
            to="#"
            style={{ fontSize: 15 }}
            className="icon"
            onClick={() => NavBar()}
          >
            &#9776;
          </Link>
        )}

        <div className="dropdown">
          <button className="dropbtn animate">
            <i className="fa fa-user-circle" aria-hidden="true"></i> &nbsp;
            Account &nbsp; <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to="/basic-info">Account</Link>
            <Link to="#" onClick={() => logout()}>
              Logout
            </Link>
          </div>
        </div>
        <Link to={"/cart"} className="animate cart-icon">
          <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          <span style={{ color: "blue" }}> {cartNumber}</span>
          &nbsp; Cart
        </Link>
        <Link to="/orders" className="animate orders">
          Orders
        </Link>
      </>
    );
  };
  return (
    <>
      <nav id="main-nav">
        <div className="topnav" id="myTopnav">
          {navigationContent(true)}
        </div>
        <div id="navbar">{navigationContent(false)}</div>
      </nav>
      <div id="show-msg"></div>
    </>
  );
};

export default Header;
