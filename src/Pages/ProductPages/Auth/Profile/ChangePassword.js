import React, { useState, useContext } from "react";
import { axiosHandler, getToken } from "../../../../auth/helper";
import "../../../../css/product-css/auth/change-password.css";
import { store } from "../../../../stateManagement/store";
import { CHANGE_PASSWORD_URL } from "../../../../urls";

const ChangePassword = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [passdata, setPassData] = useState("");
  const [fetching, setFetching] = useState(false);
  const [sh, setSh] = useState(true);

  const submit = async (e) => {
    e.preventDefault();
    setFetching(true);
    if (passdata.password === passdata.confirmPassword) {
      if (userDetail.user.username === "guest") {
        alert("sorry, password change is disabled for this account!");
        return;
      }
      const token = await getToken();

      const url = CHANGE_PASSWORD_URL;
      const method = "post";
      const res = await axiosHandler({
        method,
        url,
        data: passdata,
        token,
      }).catch((e) => {
        alert(e);
        console.log(e);
      });
      if (res) {
        alert(res.data.success);
        //   alert("Password Updated successfully!")
      }
    } else {
      alert("Passwords dont match!");
    }
    setFetching(false);
  };

  const onChange = (e) => {
    setPassData({
      ...passdata,
      [e.target.name]: e.target.value,
    });
  };

  const showpassword = (e) => {
    let vv = document.querySelectorAll(".vv");
    let shide = document.getElementById("shide");
    if (sh) {
      vv.forEach(function (el) {
        el.type = "text";
      });
      shide.innerText = "hide password";
      setSh(false);
    } else {
      vv.forEach(function (el) {
        el.type = "password";
      });
      shide.innerText = "show password";
      setSh(true);
    }
  };

  return (
    <div className="ChangePasswordMain">
      <div className="mainDiv">
        <div className="cardStyle">
          <form
            method="POST"
            onSubmit={submit}
            name="signupForm"
            id="signupForm"
          >
            <h2 className="formTitle">Change Password</h2>

            <div className="inputDiv">
              <label className="inputLabel" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className="vv"
                type="password"
                id="currentPassword"
                name="currentPassword"
                onChange={onChange}
                defaultValue={passdata.currentPassword}
                required
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="password">
                New Password
              </label>
              <input
                className="vv"
                type="password"
                id="password"
                name="password"
                onChange={onChange}
                defaultValue={passdata.password}
                required
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                className="vv"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={onChange}
                defaultValue={passdata.confirmPassword}
                required
              />
            </div>
            <div className="inputDiv">
              <p
                id="shide"
                style={{ color: "red", fontSize: "11px", float: "right" }}
                onClick={() => showpassword()}
              >
                show password
              </p>
            </div>
            <div className="buttonWrapper">
              <button
                type="submit"
                id="submitButton"
                className="submitButton pure-button pure-button-primary"
              >
                {fetching ? <span id="loader"></span> : <span>Continue</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
