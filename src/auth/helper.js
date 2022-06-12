import Axios from "axios";
import { logout, tokenName } from "./authController";
import { ME_URL, REFRESH_URL } from "../urls";
// import AsyncStorage from "@react-native-async-storage/async-storage";
const AsyncStorage = "";
export const axiosHandler = ({
  method = "",
  url = "",
  token = null,
  data = {},
  extra = null,
  cancelToken = null,
}) => {
  let methodType = method.toUpperCase();
  if (
    ["GET", "POST", "PATCH", "PUT", "DELETE"].includes(methodType) ||
    {}.toString(data) !== "[object Object]"
  ) {
    let axiosProps = { method: methodType, url, data, cancelToken };

    if (token) {
      axiosProps.headers = { Authorization: `Bearer ${token}` };
    }
    if (extra) {
      axiosProps.headers = { ...axiosProps.headers, ...extra };
    }
    return Axios(axiosProps);
  } else {
    alert(`method ${methodType} is not accepted or data is not an object`);
    console.log(
      `method ${methodType} is not accepted or data is not an object`
    );
  }
};

export const miniErrorHandler = (err, log = false, defaulted = false) => {
  let net_error = false;
  let server_error = false;
  let message = null;

  if (log) {
    console.log("miniErrorHandler::", err);
  }
  if (defaulted) {
    message = { error: "Ops!, an error occurred." };
    if (log) {
      console.log("errmsg:", message);
    }
    return { message, net_error, server_error };
  }

  if (!err.response) {
    message = { error: "Network error! check your network and try again" };
    net_error = true;
  } else {
    let data;
    try {
      server_error = true;
      data = err.response.data.results;
      if (!data) {
        data = err.response.data.error;
        // data = err.response.data.sike;

        if (!data) {
          data = err.response.data;
        }
      }
    } catch (error) {
      console.log("this error shouldnt show when there is internet");
      data = { error: "Network error! check your network and try again" };
      net_error = true;
    }

    message = data;
  }
  if (log) {
    console.log("errmsg:", message);
  }
  return { message, net_error, server_error };
};

export const errorHandler = (err, defaulted = false) => {
  if (defaulted) {
    console.log("Ops!, an error occurred.");
    return "Ops!, an error occurred.";
  }

  let messageString = "";
  if (!err.response) {
    messageString += "Network error! check your network and try again";
  } else {
    let data = err.response.data.results;
    if (!err.response.data.results) {
      data = err.response.data;
    }
    messageString = loopObj(data);
  }
  return messageString.replace(/{|}|'|\[|\]/g, "");
};

const loopObj = (obj) => {
  let agg = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      agg += `<div>${key}: ${
        typeof obj[key] === "object" ? loopObj(obj[key]) : obj[key]
      }</div>`;
    }
  }
  return agg;
};

export const getToken = async () => {
  console.log("In get token");
  let token = await localStorage.getItem(tokenName);
  if (!token) logout();
  token = JSON.parse(token);
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

      return getNewAccess.data.access;
    }
  }
};
