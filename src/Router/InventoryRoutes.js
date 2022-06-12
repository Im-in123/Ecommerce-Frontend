import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InventoryLogin from "../Pages/InventoryPages/Auth/InventoryLogin";

const InventoryRoutes = () => {
  return <Route path="/admin/login" element={<InventoryLogin />} exact />;
};

export default InventoryRoutes;
