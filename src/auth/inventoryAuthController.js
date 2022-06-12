import React, { useEffect, useState, useContext } from "react";
import { axiosHandler, miniErrorHandler } from "./helper.js";
import { REFRESH_URL, ME_URL, LOGOUT_URL } from "../urls";
import { store } from "../stateManagement/store";
import { userDetailAction } from "../stateManagement/actions";
import { useNavigate } from "react-router-dom";
import { tokenName } from "./authController.js";
import { SALES_USER_TYPE, SHOPPER_USER_TYPE } from "../constants.js";

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
  alert("logging out!");
  window.location.href = "/inventory/login";
};

export const getToken = async () => {
  console.log("In get token inventory");
  let token = await localStorage.getItem(tokenName);
  if (!token) logout();

  token = JSON.parse(token);
  console.log("token::", token);

  if (!token.access) logout();
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e);
  });

  if (userProfile) {
    return token.access;
  } else {
    const getNewAccess = await axiosHandler({
      method: "post",
      url: REFRESH_URL,
      data: {
        refresh: token.refresh,
      },
    }).catch((e) => {
      console.log(e);
      if (e.response) {
        console.log("e help response.data:::", e.response?.data);

        if (
          e.response.data?.error === "Token is invalid or has expired" ||
          e.response.data?.error === "refresh token not found"
        ) {
          logout();
        }
      } else if (e.request) {
        console.log("e help request:::", e.request);
        alert("Slow Network connection");
      }
    });
    if (getNewAccess) {
      // await AsyncStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
      localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
      console.log("getNewAccess data::", getNewAccess.data.access);
      return getNewAccess.data.access;
    }
  }
};
export const checkCreateState = async (
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
  });
  if (userProfile) {
    console.log(userProfile.data);
    console.log(userProfile.data);
    dispatch({ type: userDetailAction, payload: userProfile.data });
    if (userProfile.data.user_type === SALES_USER_TYPE) {
      setChecking(false);
      return;
    } else if (userProfile.data.user_type === SHOPPER_USER_TYPE) {
      navigate("login");
      return;
    }
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
    if (mini_error.net_error) {
      setTimeout(() => {
        checkCreateState(setChecking, dispatch, navigate, props);
      }, 7000);
    }
    if (mini_error.server_error) {
      if (
        mini_error.message === "Token is invalid or has expired" ||
        mini_error.message === "refresh token not found"
      ) {
        logout(props);
      }
    }
  });

  if (getNewAccess) {
    localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
    checkCreateState(setChecking, dispatch, navigate, props);
  }
};

const InventoryAuthController = (props) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(store);

  useEffect(() => {
    checkCreateState(setChecking, dispatch, navigate, props);
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
export default InventoryAuthController;
