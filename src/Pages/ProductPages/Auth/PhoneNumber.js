import React, { useEffect, useState, useContext } from "react";
import "../../../css/product-css/auth/phonenumber.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  isValidPhoneNumber,
  parsePhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import { axiosHandler, getToken, miniErrorHandler } from "../../../auth/helper";
import { PROFILE_URL } from "../../../urls";
import { userDetailAction } from "../../../stateManagement/actions";
import { store } from "../../../stateManagement/store";
const PhoneNumber = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [info, setInfo] = useState({});
  const [valid, setValid] = useState(true);
  const [setupData, setSetupData] = useState({});
  // process.env.KEY
  // console.log("env::", process.env.GOOGLE_MAPS_API_KEY);
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  useEffect(() => {
    if (!userDetail) {
      navigate("/login");
    }
    if (userDetail?.phone_number) {
      navigate("/");
    }
    if (userDetail?.full_name) {
      setSetupData({
        ...userDetail,
        user_id: userDetail.user.id,
      });
      // navigate("/");
    } else {
      navigate("/create-profile");
    }

    return () => {};
  }, []);

  useEffect(() => {
    getPhoneNumber();
    return () => {};
  }, [value]);

  const setNumber = async () => {
    console.log("send::", setupData);

    const token = await getToken();
    const result = await axiosHandler({
      method: "patch",
      url: PROFILE_URL,
      data: setupData,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
      console.log(mini_err);
    });

    if (result) {
      console.log("res::", result.data);
      dispatch({ type: userDetailAction, userDetail: result.data });
      // if (!result.data.city) {
      //   navigate("/Address");
      // } else {
      //   navigate("/");
      // }
      navigate("/");
    }
  };
  const getPhoneNumber = () => {
    console.log(value);
    if (!value) {
      setValid(false);

      return;
    }
    let valid = isValidPhoneNumber(value);

    console.log(valid);

    if (!valid) {
      setValid(false);
      return;
    }
    const parse_num = parsePhoneNumber(value);
    console.log(":parse::", parse_num);
    const info_ = {
      calling_code: parse_num.countryCallingCode,
      short_country: parse_num.country,
      national_number: parse_num.nationalNumber,
      phone_number: parse_num.number,
    };
    setSetupData({
      ...setupData,
      ...info_,
    });
    setValid(valid);
    setInfo(info_);
    console.log("info_::", info_);
  };
  return (
    <div className="phone-number">
      <PhoneInput
        placeholder="Enter phone number"
        value={value}
        onChange={setValue}
        withCountryCallingCode
        international
        defaultCountry="US"
      />
      <button
        className="button"
        disabled={!valid}
        // onClick={() => navigate({ pathname: "/li" }, { state: info })}
        onClick={() => setNumber()}
      >
        {valid ? "Continue" : "Enter a valid number"}
      </button>
    </div>
  );
};

export default PhoneNumber;
// useEffect(() => {
//   navigator.geolocation.getCurrentPosition(handleNavigator, () =>
//     console.warn("permission was rejected")
//   );
// }, []);

// async function handleNavigator(pos) {
//   const { latitude, longitude } = pos.coords;
//   console.log(latitude, longitude);
//   const userCountryCode = await lookupCountry({ latitude, longitude });
// }

// async function lookupCountry({ latitude, longitude }) {
//   const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${"free"}`;

//   const locationData = await fetch(URL).then((res) => res.json());

//   const [{ address_components }] = locationData.results.filter(({ types }) =>
//     types.includes("country")
//   );

//   const [{ short_name }] = address_components;

//   return short_name;
// }
