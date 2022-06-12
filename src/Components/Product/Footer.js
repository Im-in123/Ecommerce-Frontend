import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../urls";

const Footer = () => {
  return (
    //  {/* <!--FOOTER--> */}
    <>
      <footer>
        {/* <div className="top_header">
          <section>
            <img src="https://i.postimg.cc/FFJCzwzY/icon-3.png" alt="" />
            <h1 className="title">Newsletter</h1>
            <form>
              <fieldset>
                <input
                  type="email"
                  name="email"
                  placeholder="email address*"
                  requried=""
                />
                <button className="btn2">subscribe</button>
              </fieldset>
            </form>
          </section>
        </div> */}
        <span className="border-shape"></span>
        <div className="bottom_content">
          <section>
            <Link to="#">
              <i className="fa fa-facebook"></i>
            </Link>
            <Link to="#">
              <i className="fa fa-instagram"></i>
            </Link>
            <Link to="#">
              <i className="fa fa-twitter"></i>
            </Link>
            <Link to="#">
              <i className="fa fa-telegram"></i>
            </Link>
          </section>
          <section>
            <Link to="#">Home</Link>
            <Link to="#">About us</Link>
            <Link to="#">Order</Link>
            <Link to="#">Contact Us</Link>
          </section>
        </div>
        <div className="copyright">
          Copyright © 2021 {APP_NAME}.com - All rights reserved
        </div>
      </footer>
      {/* <!--ADDITIONAL--> */}
      <Link
        to="#"
        onClick={() => {
          try {
            let el = document
              .getElementById("logo2")
              .scrollIntoView({ behavior: "smooth" });
          } catch (error) {}
        }}
        id="roll_back"
        className="animate"
      >
        <i className="fa fa-angle-up"></i>
      </Link>
    </>
  );
};

export default Footer;
