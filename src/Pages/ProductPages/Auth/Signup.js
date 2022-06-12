import React, { useEffect, useState } from "react";
import { axiosHandler, miniErrorHandler } from "../../../auth/helper";
import { SIGNUP_URL, LOGIN_URL } from "../../../urls";
import { tokenName } from "../../../auth/authController";
import "../../../css/product-css/auth/signup.css";
import visibility from "../../../assets/svg/visibility.svg";
import visibility_off from "../../../assets/svg/visibility_off.svg";
import close_black from "../../../assets/svg/close_black.svg";
import { useNavigate } from "react-router-dom";

export const loginRequest = async (data, setFieldsError, navigate) => {
  console.log("data:", data);
  const result = await axiosHandler({
    method: "post",
    url: LOGIN_URL,
    data: data,
  }).catch((e) => setFieldsError(miniErrorHandler(e)));
  if (result) {
    localStorage.setItem(tokenName, JSON.stringify(result.data));
    navigate("/");
  }
};
const Signup = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_type, setUser_Type] = useState("shopper");
  const [signupData, setSignupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [fieldsError, setFieldsError] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () => {};
  }, []);
  const onChangeSignup = (e) => {
    setSignupData({
      ...signupData,
      user_type,
      [e.target.name]: e.target.value,
    });
  };
  const create_user = async () => {
    setLoading(true);
    setShowSignupPassword(false);
    const result = await axiosHandler({
      method: "post",
      url: SIGNUP_URL,
      data: signupData,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, false);
      if (mini_err.message) {
        if (mini_err.server_error) {
          setFieldsError(mini_err.message);
        }
      }
    });
    if (result) {
      console.log(result);
      await loginRequest(signupData, setFieldsError, navigate);
    }
    setLoading(false);
  };
  return (
    <div className="signup-page">
      <div className="content">
        <div className="img-cont">
          <img src={require("../../../assets/slide/sofa.jpg")} alt="" />
        </div>
        <div className="form-container">
          <div>
            <h2>Create An Account </h2>
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
              create_user();
            }}
          >
            <div className="input-container">
              <label htmlFor="email">
                <input
                  autoFocus
                  type="email"
                  placeholder="Email"
                  name="email"
                  defaultValue={signupData.email}
                  onChange={onChangeSignup}
                  required
                />
              </label>
              {fieldsError.email && <li>{fieldsError.email}</li>}
            </div>
            <div className="input-container">
              <label htmlFor="password">
                <div className="pas">
                  <input
                    type={!showSignupPassword ? "password" : "text"}
                    placeholder="Password"
                    name="password"
                    defaultValue={signupData.password}
                    onChange={onChangeSignup}
                    required
                  />
                  <img
                    src={!showSignupPassword ? visibility : visibility_off}
                    alt="show/hide password"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  />
                </div>
              </label>
              {fieldsError.password && <li>{fieldsError.password}</li>}
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? <span id="loadersignup"></span> : "SIGNUP"}
            </button>
          </form>
        </div>
        <div className="bottom-btn">
          <div className="b-login">
            <span>Already have an account?</span>{" "}
            <button onClick={() => navigate("/login")}>LOGIN</button>
          </div>
          <span>Forgot password?</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
