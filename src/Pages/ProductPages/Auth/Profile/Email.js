import React, { useContext, useState } from "react";
import { store } from "../../../../stateManagement/store";
import Pwrap from "./Pwrap";
import "../../../../css/product-css/auth/email.css";
const Email = () => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [loading, setLoading] = useState(false);
  const [new_email, setNew_Email] = useState("");

  return (
    <Pwrap name={"email"}>
      <div className="email-div">
        <h2> Change Email</h2>
        <form
        //   onSubmit={(e) => {
        //     e.preventDefault();
        //     create();
        //   }}
        >
          <div className="input-container">
            <label htmlFor="first_name">
              {/* <span>First Name:</span> */}
              <input
                autoFocus
                type="text"
                placeholder="Current Email"
                name="email"
                value={userDetail.user.email}
                readOnly
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="first_name">
              <span>New Email:</span>
              <input
                autoFocus
                type="email"
                placeholder="New Email"
                name="new_email"
                defaultValue={new_email}
                onChange={(e) => setNew_Email(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? <span id="loadersignup"></span> : "Change"}
          </button>
        </form>
      </div>
    </Pwrap>
  );
};

export default Email;
