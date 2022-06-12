import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../../Components/Product/Header";
import Footer from "../../../../Components/Product/Footer";

import "../../../../css/product-css/auth/profile.css";

const Pwrap = (props) => {
  console.log("pwrap props::", props);
  const navigate = useNavigate();
  useEffect(() => {
    const hamburgerMenu = document.getElementById("hamburger-icon");
    const link = document.querySelectorAll(".link");
    // const closeBtn = document.getElementById("close");

    for (let i = 0; i < link.length; i++) {
      link[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }

    // Menu
    hamburgerMenu.addEventListener("click", function () {
      const sidebar = document.getElementById("sidebars");
      sidebar.classList.toggle("toggle");
    });

    return () => {
      for (let i = 0; i < link.length; i++) {
        link[i].removeEventListener("click", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
      hamburgerMenu.removeEventListener("click", function () {
        const sidebar = document.getElementById("sidebars");
        sidebar.classList.toggle("toggle");
      });
    };
  }, []);
  //   close icon
  function closeNav() {
    const sidebar = document.getElementById("sidebars");
    sidebar.classList.toggle("toggle");
  }

  return (
    <>
      <Header />
      <div className="settings-main">
        <div class="hamburger-menu">
          <span id="hamburger-icon">
            <i class="fa-solid fa-bars"></i>
          </span>
        </div>
        <div class="sidebar" id="sidebars">
          <div class="close-icon" id="close" onClick={() => closeNav()}>
            <i class="fa-solid fa-xmark"></i>
          </div>

          <ul class="links">
            {/* <li class="link active">
              <a href="#">
                <span class="material-icons-outlined icon">home</span> Home
              </a>
            </li> */}
            <li
              className={`link ${props.name === "basic-info" && "active"}`}
              onClick={() => {
                navigate("/basic-info");
              }}
            >
              <Link to="#">
                <span>
                  <i class="fa-solid fa-address-card"></i>
                </span>
                Info
              </Link>
            </li>
            {/* <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">email</span>
                Messages
              </a>
            </li> */}
            {/* <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">notifications</span>
                Notification
              </a>
            </li> */}
            <li
              className={`link ${props.name === "email" && "active"}`}
              onClick={() => {
                navigate("/email");
              }}
            >
              <Link to="#">
                <span>
                  <i class="fa-solid fa-envelope"></i>
                </span>
                Email
              </Link>
            </li>
            <li
              class="link"
              //   onClick={() => {
              //     switchView("liked");
              //   }}
            >
              <a href="#">
                <span>
                  <i class="fa-solid fa-location-dot"></i>
                </span>{" "}
                Address
              </a>
            </li>
            <li
              class="link"
              //   onClick={() => {
              //     switchView("profile_update");
              //   }}
            >
              <a href="#">
                <span>
                  <i class="fa-solid fa-credit-card"></i>
                </span>{" "}
                Billing
              </a>
            </li>
            <li
              className={`link ${props.name === "password" && "active"}`}
              onClick={() => {
                navigate("/password");
              }}
            >
              <Link to="#">
                <span>
                  <i class="fa-solid fa-lock"></i>
                </span>{" "}
                Password
              </Link>
            </li>
          </ul>
        </div>
        <div className="settings-content">{props.children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Pwrap;
