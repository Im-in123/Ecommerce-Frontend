import React, { useEffect, useState } from "react";
import { axiosHandler, miniErrorHandler } from "../../../auth/helper";
import { LOGIN_URL } from "../../../urls";
import { tokenName } from "../../../auth/authController";
import "../../../css/product-css/auth/signup.css";
import visibility from "../../../assets/svg/visibility.svg";
import visibility_off from "../../../assets/svg/visibility_off.svg";
import close_black from "../../../assets/svg/close_black.svg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_type, setUser_Type] = useState("shopper");
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [fieldsError, setFieldsError] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () => {};
  }, []);
  const onChangeLogin = (e) => {
    setLoginData({
      ...loginData,
      user_type,
      [e.target.name]: e.target.value,
    });
  };
  const submit = async () => {
    setLoading(true);
    setShowLoginPassword(false);
    console.log(loginData);
    const result = await axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
      if (mini_err.message) {
        if (mini_err.server_error) {
          setFieldsError(mini_err.message);
        }
      }
    });
    if (result) {
      console.log(result);
      localStorage.setItem(tokenName, JSON.stringify(result.data));

      navigate("/list");
    }
    setLoading(false);
  };
  return (
    <div className="signup-page">
      <div className="content">
        <div className="img-cont">
          {/* <img src={require("../../../assets/slide/sofa.jpg")} alt="" /> */}
        </div>
        <div className="form-container">
          <div>
            <h2>LOGIN </h2>
            {fieldsError.error && (
              <div className="err">
                <div
                  className="error-div"
                  dangerouslySetInnerHTML={{ __html: fieldsError.error }}
                />
                <img
                  id="err-img"
                  src={close_black}
                  alt="close error message"
                  onClick={() =>
                    setFieldsError({ ...fieldsError, error: null })
                  }
                />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="input-container">
              <label htmlFor="email">
                <input
                  autoFocus
                  type="email"
                  placeholder="Email"
                  name="email"
                  defaultValue={loginData.email}
                  onChange={onChangeLogin}
                  required
                />
              </label>
              {fieldsError.email && <li>{fieldsError.email}</li>}
            </div>
            <div className="input-container">
              <label htmlFor="password">
                <div className="pas">
                  <input
                    type={!showLoginPassword ? "password" : "text"}
                    placeholder="Password"
                    name="password"
                    defaultValue={loginData.password}
                    onChange={onChangeLogin}
                    required
                  />
                  <img
                    src={!showLoginPassword ? visibility : visibility_off}
                    alt="show/hide password"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  />
                </div>
              </label>
              {fieldsError.password && <li>{fieldsError.password}</li>}
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? <span id="loadersignup"></span> : "LOGIN"}
            </button>
          </form>
        </div>
        <div className="bottom-btn">
          <div className="b-login">
            <span>Don't have an account?</span>{" "}
            <button onClick={() => navigate("/signup")}>SIGNUP</button>
          </div>
          <div className="b-login">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
