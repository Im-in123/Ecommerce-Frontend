import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../../stateManagement/store";
import "../../../css/product-css/auth/create-profile.css";
import close_black from "../../../assets/svg/close_black.svg";
import { axiosHandler, getToken, miniErrorHandler } from "../../../auth/helper";
import { PROFILE_URL } from "../../../urls";
import { userDetailAction } from "../../../stateManagement/actions";

const CreateProfile = () => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();
  // const { state } = useLocation();
  // console.log("state::", state);
  useEffect(() => {
    if (!userDetail) {
      navigate("/login");
    }
    if (userDetail.full_name) {
      if (!userDetail.phonenumber) {
        navigate("/phone-number");
      }
      // navigate("/");
    }

    return () => {};
  }, []);

  const [loading, setLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState({
    full_name: "",
    first_name: "",
  });

  const [setupData, setSetupData] = useState({
    ...userDetail,
    user_id: userDetail.user.id,
  });

  console.log("setupdata::", setupData);

  const onChangeSetup = (e) => {
    setSetupData({
      ...setupData,
      [e.target.name]: e.target.value,
    });
  };
  const create = async () => {
    setLoading(true);
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: PROFILE_URL,
      data: setupData,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
      console.log(mini_err);
      if (mini_err.message) {
        if (mini_err.server_error) {
          setFieldsError(mini_err.message);
        }
      }
    });

    if (result) {
      setLoading(false);
      console.log("res::", result.data);
      dispatch({ type: userDetailAction, payload: result.data });
      if (!result.data.phonenumber) {
        navigate("/phone-number");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };
  return (
    <div className="create-profile">
      <div className="content">
        <div className="form-container">
          <div>
            <h2> A LITTLE MORE INFO TO SETUP YOUR ACCOUNT! </h2>
            {fieldsError.error && (
              <div className="err">
                <div className="error-div"></div>
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
              create();
            }}
          >
            <div className="input-container">
              <label htmlFor="first_name">
                <input
                  autoFocus
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                  defaultValue={setupData.first_name}
                  onChange={onChangeSetup}
                  required
                />
              </label>
              {fieldsError.first_name && <li>{fieldsError.first_name}</li>}
            </div>
            <div className="input-container">
              <label htmlFor="full_name">
                <input
                  autoFocus
                  type="text"
                  placeholder="Full Name"
                  name="full_name"
                  defaultValue={setupData.full_name}
                  onChange={onChangeSetup}
                  required
                />
              </label>
              {fieldsError.full_name && <li>{fieldsError.full_name}</li>}
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? <span id="loadersignup"></span> : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
