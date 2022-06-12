import React, { useEffect, useState } from "react";
import InventoryAside from "../../../Components/Inventory/InventoryAside";
import InventoryHeader from "../../../Components/Inventory/InventoryHeader";
import "../../../css/inventory-css/dashboard.css";
import InventoryContent from "../../../Components/Inventory/InventoryContent";
import { axiosHandler, getToken, miniErrorHandler } from "../../../auth/helper";
import { SUMMARY_URL } from "../../../urls";
import Summary from "../Summary";

const Dashboard = () => {
  useEffect(() => {
    return () => {};
  }, []);

  return <Summary />;
};

export default Dashboard;
