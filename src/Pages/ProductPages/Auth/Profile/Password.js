import React, { useEffect } from "react";
import "../../../../css/product-css/auth/password.css";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import Pwrap from "./Pwrap";

const Password = () => {
  useEffect(() => {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    function clickhandle() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.color = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", clickhandle);
    }

    return () => {
      for (i = 0; i < coll.length; i++) {
        coll[i].removeEventListener("click", clickhandle);
      }
    };
  }, []);
  return (
    <Pwrap name={"password"}>
      <div className="password-comb">
        <button className="collapsible">Change Password</button>
        <div className="content">
          <ChangePassword />
        </div>
        <button className="collapsible">Forgot Password</button>
        <div className="content">
          <ForgotPassword />
        </div>
      </div>
    </Pwrap>
  );
};

export default Password;
