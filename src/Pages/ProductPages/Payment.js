import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../../stateManagement/store";

const Payment = () => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();
  console.log("UserDetail::", userDetail);
  useEffect(() => {
    if (!userDetail) {
      navigate("/login");
    }
    if (!userDetail.phone_number) {
      navigate("/create-profile");
    }
    // if (!userDetail.city) {
    //   navigate("/address");
    // }
    return () => {};
  }, []);

  return (
    <div className="">
      Payment
      <Link to="#">Paypal</Link>
      <Link to={"#"}>Credit Card</Link>
    </div>
  );
};

export default Payment;
