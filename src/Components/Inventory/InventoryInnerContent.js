import React from "react";

const InventoryInnerContent = (props) => {
  console.log("inner::", props);
  return (
    <>
      <div className="inner-content">{props.data()}</div>
    </>
  );
};

export default InventoryInnerContent;
