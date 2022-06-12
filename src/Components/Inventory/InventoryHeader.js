import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../../stateManagement/store";
import { logout } from "../../auth/inventoryAuthController";
import { APP_NAME } from "../../urls";
const InventoryHeader = () => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  return (
    <nav className="inventory-header">
      <div className="links">
        <Link to="#" id="logo-name">
          {" "}
          <h1>{APP_NAME}</h1> <span> Inventory</span>
        </Link>
        <Link to="#" className="user">
          |{userDetail.user.email}
        </Link>
      </div>
      <div className="links2">
        <Link to="/inventory/invoice-creation" className="invoice">
          New Invoice
        </Link>
        <Link to="#" className="logout" onClick={() => logout()}>
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default InventoryHeader;
