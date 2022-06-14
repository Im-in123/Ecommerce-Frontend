import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const InventoryAside = () => {
  useEffect(() => {
    const link = document.querySelectorAll(".i-links");
    for (let i = 0; i < link.length; i++) {
      link[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }
    return () => {
      for (let i = 0; i < link.length; i++) {
        link[i].removeEventListener("click", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
    };
  }, []);
  return (
    <aside className="inventory-aside">
      <div className="content">
        {" "}
        <Link to="/inventory/dashboard" className="i-links">
          <i className="fa-solid fa-border-all"></i>Dashboard
        </Link>
        <Link
          className="i-links"
          to={{
            pathname: `/inventory/groups`,
            search: "page=1",
          }}
        >
          <i className="fa-solid fa-layer-group"></i>
          Groups
        </Link>
        <Link
          className="i-links"
          to={{
            pathname: `/inventory/inventories`,
            search: "page=1",
          }}
        >
          <i className="fa-solid fa-shirt"></i>
          Inventories
        </Link>
        <Link
          className="i-links"
          to={{
            pathname: `/inventory/shops`,
            search: "page=1",
          }}
        >
          <i className="fa-solid fa-shop"></i>
          Shops
        </Link>
        <Link
          className="i-links"
          to={{
            pathname: `/inventory/users`,
            search: "page=1",
          }}
        >
          <i className="fa-solid fa-users-line"></i> Users
        </Link>
        <Link
          className="i-links"
          to={{
            pathname: `/inventory/user-activities`,
            search: "page=1",
          }}
        >
          <i className="fa-brands fa-creative-commons-by"></i> User Activities
        </Link>
      </div>
    </aside>
  );
};

export default InventoryAside;
