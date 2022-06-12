import React, { useEffect, useContext } from "react";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
import InventoryAside from "./InventoryAside";
import InventoryHeader from "./InventoryHeader";
import InventoryInnerContent from "./InventoryInnerContent";

const InventoryContent = (props) => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);

  useEffect(() => {
    const overlay = document.querySelector(".overlay");
    const closeOverlay = document.querySelector(".close-overlay");
    closeOverlay.addEventListener("click", closeOverlayHandler);
    overlay.addEventListener("click", overlayHandler);
    function closeOverlayHandler(e) {
      e.preventDefault();
      document.body.classList.remove("nav-open");
    }
    function overlayHandler(e) {
      e.preventDefault();
      document.body.classList.remove("nav-open");
    }
    return () => {
      closeOverlay.removeEventListener("click", closeOverlayHandler);
      overlay.removeEventListener("click", overlayHandler);
    };
  }, []);
  useEffect(() => {
    if (showInventoryMessage.message) {
      document.body.classList.add("nav-open");

      setTimeout(() => {
        dispatch({
          type: showInventoryMessageAction,
          payload: { message: null },
        });
      }, 7000);
    } else {
      document.body.classList.remove("nav-open");
    }

    return () => {};
  }, [showInventoryMessage]);

  return (
    <>
      <InventoryHeader />
      <div className="inventory-content">
        <InventoryAside />
        <InventoryInnerContent data={props.data} />
        <div className="show-messages">
          <div className="inner">
            <button className="close-overlay">
              <i className="fa fa-close" aria-hidden="true"></i>
            </button>
            <span>{showInventoryMessage.message}</span>
          </div>
        </div>
        <div className="overlay"></div>
      </div>{" "}
    </>
  );
};

export default InventoryContent;
