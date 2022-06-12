import React, { useEffect, useState, useContext } from "react";
import { axiosHandler, getToken, miniErrorHandler } from "./helper.js";
import { REFRESH_URL, ME_URL, LOGOUT_URL } from "../urls";
import { store } from "../stateManagement/store";
import { userDetailAction } from "../stateManagement/actions";
import { useNavigate } from "react-router-dom";
require("regenerator-runtime/runtime");

export const tokenName = "Ecommerce";

export const logout = async (props = "") => {
  if (localStorage.getItem(tokenName)) {
    const token = await getToken();
    const res = axiosHandler({
      method: "get",
      url: LOGOUT_URL,
      token: token,
    }).catch((e) => {
      console.log(e);
    });

    localStorage.removeItem(tokenName);
  }
  window.location.href = "/login";
};

export const checkAuthState = async (
  setChecking,
  dispatch,
  navigate,
  props
) => {
  let token = localStorage.getItem(tokenName);
  if (!token) {
    console.log("no token");
    logout(props);
    return;
  }
  token = JSON.parse(token);
  if (!token.access) {
    console.log("no access token");
    logout(props);
    return;
  }
  console.log(token);
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    let mini_error = miniErrorHandler(e, true);
    console.log(mini_error);
    if (e.response) {
      // console.log("Request made and server responded");
    } else if (e.request) {
      // The request was made but no response was received
      // console.log("e request:::", e.request);
    }
  });
  if (userProfile) {
    console.log(userProfile.data);
    dispatch({ type: userDetailAction, payload: userProfile.data });
    setChecking(false);

    return;
  }
  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    let mini_error = miniErrorHandler(e, true);
    console.log(mini_error);
    if (e.response) {
      // console.log("Request made and server responded");
      console.log("e:::", e);
      if (
        e.response.data.error === "Token is invalid or has expired" ||
        e.response.data.error === "refresh token not found"
      ) {
        logout(props);
      }
    } else if (e.request) {
      setTimeout(() => {
        // checkAuthState(setChecking, dispatch, navigate, props);
      }, 7000);
    }
  });

  if (getNewAccess) {
    localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
    checkAuthState(setChecking, dispatch, navigate, props);
  }
};

const AuthController = (props) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(store);

  useEffect(() => {
    checkAuthState(setChecking, dispatch, navigate, props);
  }, []);

  return (
    <div>
      {checking ? (
        <div className="AuthDiv">
          <p id="loader"></p>
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};

export default AuthController;
