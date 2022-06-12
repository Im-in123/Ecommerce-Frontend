import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthController from "../auth/authController";
import InventoryAuthController from "../auth/inventoryAuthController";
import InventoryHeader from "../Components/Inventory/InventoryHeader";
import Footer from "../Components/Product/Footer";
import Header from "../Components/Product/Header";
import InventoryLogin from "../Pages/InventoryPages/Auth/InventoryLogin";
import InventorySignup from "../Pages/InventoryPages/Auth/InventorySignup";
import Dashboard from "../Pages/InventoryPages/Dashboard/Dashboard";
import Groups from "../Pages/InventoryPages/Groups";
import Inventories from "../Pages/InventoryPages/Inventories";
import InventoryEdit from "../Pages/InventoryPages/InventoryEdit";
import InvoiceCreation from "../Pages/InventoryPages/InvoiceCreation";
import Shops from "../Pages/InventoryPages/Shops";
import ShopEdit from "../Pages/InventoryPages/ShopEdit";
import Summary from "../Pages/InventoryPages/Summary";
import UserActivities from "../Pages/InventoryPages/UserActivities";
import Users from "../Pages/InventoryPages/Users";

import Address from "../Pages/ProductPages/Auth/Address";
import CreateProfile from "../Pages/ProductPages/Auth/CreateProfile";
import Login from "../Pages/ProductPages/Auth/Login";
import PhoneNumber from "../Pages/ProductPages/Auth/PhoneNumber";
import Signup from "../Pages/ProductPages/Auth/Signup";
import InsideCategory from "../Pages/ProductPages/InsideCategory";
import Landing from "../Pages/ProductPages/Landing";
import List from "../Pages/ProductPages/List";
import NotFound from "../Pages/ProductPages/NotFound";
import Payment from "../Pages/ProductPages/Payment";
import Product from "../Pages/ProductPages/Product";
import Search from "../Pages/ProductPages/Search";
import ShoppingCart from "../Pages/ProductPages/ShoppingCart";
import InventoryRoutes from "./InventoryRoutes";
import GroupEdit from "../Pages/InventoryPages/Group-edit";
import BasicInfo from "../Pages/ProductPages/Auth/Profile/BasicInfo";
import Password from "../Pages/ProductPages/Auth/Profile/Password";
import Orders from "../Pages/ProductPages/Auth/Orders";
import Email from "../Pages/ProductPages/Auth/Profile/Email";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search" element={<Search />} exact />
        <Route path="/signup" element={<Signup />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route
          path="/create-profile"
          element={
            <AuthController>
              <CreateProfile />
            </AuthController>
          }
          exact
        />
        <Route
          path="/address"
          element={
            <AuthController>
              <Address />
            </AuthController>
          }
          exact
        />
        <Route
          path="/phone-number"
          element={
            <AuthController>
              {" "}
              <PhoneNumber />{" "}
            </AuthController>
          }
          exact
        />
        <Route
          path="/basic-info"
          element={
            <AuthController>
              <BasicInfo />
            </AuthController>
          }
          exact
        />
        <Route
          path="/password"
          element={
            // <AuthController>
            <Password />
            // </AuthController>
          }
          exact
        />
        <Route
          path="/email"
          element={
            <AuthController>
              <Email />
            </AuthController>
          }
          exact
        />

        {/* InventoryRoutes() */}
        <Route path="/inventory/login" element={<InventoryLogin />} exact />
        <Route path="/inventory/signup" element={<InventorySignup />} exact />
        <Route
          path="/inventory/dashboard"
          element={
            <InventoryAuthController>
              <Dashboard />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/summary"
          element={
            <InventoryAuthController>
              <Summary />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/groups"
          element={
            <InventoryAuthController>
              <Groups />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/inventories"
          element={
            <InventoryAuthController>
              <Inventories />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/shops"
          element={
            <InventoryAuthController>
              <Shops />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/users"
          element={
            <InventoryAuthController>
              <Users />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/user-activities"
          element={
            <InventoryAuthController>
              <UserActivities />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory/invoice-creation"
          element={
            <InventoryAuthController>
              <InvoiceCreation />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/inventory-edit/:slug"
          element={
            <InventoryAuthController>
              <InventoryEdit />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/shop-edit/:slug"
          element={
            <InventoryAuthController>
              <ShopEdit />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="/group-edit/:slug"
          element={
            <InventoryAuthController>
              <GroupEdit />
            </InventoryAuthController>
          }
          exact
        />
        <Route
          path="*"
          element={
            <>
              <Routes>
                <Route
                  path="*"
                  element={
                    // <AuthController>
                    <>
                      <>
                        <Header />

                        <Routes>
                          <Route
                            path="/"
                            element={
                              <>
                                <List />
                              </>
                            }
                            exact
                          />
                          <Route
                            path="/list"
                            element={
                              <>
                                <List />
                              </>
                            }
                            exact
                          />
                          <Route
                            path="/product/:slug"
                            element={
                              <>
                                <Product />
                              </>
                            }
                            exact
                          />
                          <Route
                            path="/cart"
                            element={
                              <>
                                <ShoppingCart />
                              </>
                            }
                            exact
                          />

                          <Route
                            path="/category/:category"
                            element={
                              <>
                                <InsideCategory />
                              </>
                            }
                            exact
                          />
                          <Route
                            path="/payment"
                            element={
                              <>
                                <AuthController>
                                  <Payment />
                                </AuthController>
                              </>
                            }
                            exact
                          />
                          <Route
                            path="/orders"
                            element={
                              <AuthController>
                                <Orders />
                              </AuthController>
                            }
                            exact
                          />

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </>
                      <Footer />

                      {/* // </AuthController> */}
                    </>
                  }
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
