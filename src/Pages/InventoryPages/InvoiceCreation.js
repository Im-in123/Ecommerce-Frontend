import React, { useState, useEffect, useContext } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import {
  ALL_AVAILABLE_GROUP,
  ALL_AVAILABLE_Inventory,
  GROUP_URL,
  INVENTORY_URL,
  LOCAL_CHECK,
} from "../../urls";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
import "../../css/inventory-css/invoice-creation.css";
import { getToken } from "../../auth/inventoryAuthController";

const InvoiceCreation = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const [inventories, setInventories] = useState([]);
  const [loadingAddInventory, setLoadingAddInventory] = useState(false);
  const [allAvailableGroups, setAllAvailableGroups] = useState([]);
  const [addInventory, setAddInventory] = useState(false);
  const [addInventoryData, setAddInventoryData] = useState({
    name: "",
    group_id: null,
  });
  const [fieldsError, setFieldsError] = useState({});

  useEffect(() => {
    getInventories();
    getAllAvailableGroups();

    return () => {};
  }, []);
  const getInventories = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: INVENTORY_URL,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("inventories res::", res.data);

      const data = res.data.results.map((item) => ({
        ...item,
        groupInfo: item.group?.name,
        photoInfo: item.photo,
      }));
      console.log("data::", data);
      setInventories(data);
    }
  };

  const getAllAvailableGroups = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: ALL_AVAILABLE_GROUP,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("all avialable res::", res.data);
      setAllAvailableGroups(res.data.data);
    }
  };
  const submitAddInventory = async () => {
    setFieldsError({ name: "" });
    const token = await getToken();
    setLoadingAddInventory(true);
    console.log(addInventoryData);
    const result = await axiosHandler({
      method: "post",
      url: INVENTORY_URL,
      data: addInventoryData,
      token,
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
      dispatch({
        type: showInventoryMessageAction,
        payload: { message: "Group created successfully!" },
      });
      setAddInventory(false);

      getAllAvailableGroups();
    }
    setLoadingAddInventory(false);
  };
  const onChangeAddInventoryData = (e) => {
    console.log(addInventoryData);
    setAddInventoryData({
      ...addInventoryData,
      [e.target.name]: e.target.value,
    });
  };
  function inputChange(e, item) {
    console.log("clicked");
    let minusBtn = document.querySelector(`.qty-count--minus${item.id}`);
    let addBtn = document.querySelector(`.qty-count--add${item.id}`);
    let qtyMin = parseInt(e.target.min);
    let qtyMax = parseInt(e.target.max);
    let qty = parseInt(e.target.value);
    console.log("clicked", qty);
    if (isNaN(qty) || qty <= qtyMin) {
      e.target.value = qtyMin;
      minusBtn.disabled = true;
      //   dispatch({
      //     type: addToCartAction,
      //     payload: { item: item, quantity: qtyMin },
      //   });
    } else {
      minusBtn.disabled = false;
      if (qty >= qtyMax) {
        e.target.value = qtyMax;
        // dispatch({
        //   type: addToCartAction,
        //   payload: { item: item, quantity: qtyMax },
        // });
        addBtn.disabled = true;
      } else {
        e.target.value = qty;
        addBtn.disabled = false;
        // dispatch({
        //   type: addToCartAction,
        //   payload: { item: item, quantity: qty },
        // });
      }
    }
  }
  function buttonClick(e, item) {
    let inputs = document.querySelector(`#input${item.id}`);
    let qtyMin = parseInt(inputs.min);
    let qtyMax = parseInt(inputs.max);
    let countBtn1 = document.querySelector(`.qty-count--add${item.id}`);
    let countBtn2 = document.querySelector(`.qty-count--minus${item.id}`);
    var operator;
    if (e.target.classList.contains("qty-count--add")) {
      operator = "add";
    } else {
      operator = "minus";
    }
    var qty = parseInt(inputs.value);
    if (operator === "add") {
      qty += 1;
      if (qty >= qtyMin + 1) {
        countBtn2.disabled = false;
      }
      if (qty >= qtyMax) {
        e.target.disabled = true;
      }
    } else {
      qty = qty <= qtyMin ? qtyMin : (qty -= 1);

      if (qty === qtyMin) {
        e.target.disabled = true;
      }
      if (qty < qtyMax) {
        countBtn1.disabled = false;
      }
    }
    inputs.value = qty;
    // dispatch({
    //   type: addToCartAction,
    //   payload: { item: item, quantity: qty },
    // });
  }

  const content = () => {
    return (
      <div className="invoice-creation">
        <div className="invoice-creation-parent">
          <div className="invoice-creation-cont">
            <div className="top">
              <div>Create Invoice</div>
              <div className="search-and-add">
                <div className="search">
                  <input type="search" placeholder="Search inventory..." />{" "}
                  <button>Search</button>
                </div>
                {/* <div className="add">
                  <button onClick={() => setAddInventory(true)}>
                    Add Inventory
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div className="items-cont">
            <div className="items">
              <div className="code bold">Code</div>
              <div className="photo bold">Photo</div>
              <div className="name bold">Name</div>

              <div className="price bold">Price</div>

              <div className="remaining bold">Remaining</div>
              <div className="actions bold">Actions</div>
            </div>
            {inventories.map((item, index) => {
              return (
                <div className="items" key={index}>
                  <div className="code">{item.code}</div>
                  <div className="photo ">
                    {LOCAL_CHECK ? (
                      <img src={item.photo[0]?.image} alt={item.name} />
                    ) : (
                      <img src={item.photo[0]?.photo} alt={item.name} />
                    )}
                  </div>
                  <div className="name">{item.name}</div>
                  <div className="price">{item.price}</div>
                  <div className="remaining">{item.remaining}</div>
                  <div className="actions">
                    <div className="qty-input">
                      <button
                        className={`qty-count qty-count--minus  qty-count--minus${item.id}`}
                        data-action="minus"
                        type="button"
                        onClick={(e) => buttonClick(e, item)}
                      >
                        -
                      </button>
                      <input
                        className="product-qty"
                        type="number"
                        name="product-qty"
                        min="0"
                        max={item.remaining}
                        defaultValue={0}
                        id={`input${item.id}`}
                        onChange={(e) => inputChange(e, item)}
                        key={index}
                      />
                      <button
                        className={`qty-count qty-count--add  qty-count--add${item.id}`}
                        data-action="add"
                        type="button"
                        onClick={(e) => buttonClick(e, item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mini">
          <Mini />
        </div>
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default InvoiceCreation;

const Mini = () => {
  const loopy = [{ id: 1 }, { id: 2 }];
  function inputChange(e, item) {
    console.log("clicked");
    let minusBtn = document.querySelector(`.qty-count--minus${item.id}`);
    let addBtn = document.querySelector(`.qty-count--add${item.id}`);
    let qtyMin = parseInt(e.target.min);
    let qtyMax = parseInt(e.target.max);
    let qty = parseInt(e.target.value);
    console.log("clicked", qty);
    if (isNaN(qty) || qty <= qtyMin) {
      e.target.value = qtyMin;
      minusBtn.disabled = true;
      //   dispatch({
      //     type: addToCartAction,
      //     payload: { item: item, quantity: qtyMin },
      //   });
    } else {
      minusBtn.disabled = false;
      if (qty >= qtyMax) {
        e.target.value = qtyMax;
        // dispatch({
        //   type: addToCartAction,
        //   payload: { item: item, quantity: qtyMax },
        // });
        addBtn.disabled = true;
      } else {
        e.target.value = qty;
        addBtn.disabled = false;
        // dispatch({
        //   type: addToCartAction,
        //   payload: { item: item, quantity: qty },
        // });
      }
    }
  }
  function buttonClick(e, item) {
    let inputs = document.querySelector(`#inv${item.id}`);
    let qtyMin = parseInt(inputs.min);
    let qtyMax = parseInt(inputs.max);
    let countBtn1 = document.querySelector(`.inv--add${item.id}`);
    let countBtn2 = document.querySelector(`.inv--minus${item.id}`);
    var operator;
    if (e.target.classList.contains("inv--add")) {
      operator = "add";
    } else {
      operator = "minus";
    }
    var qty = parseInt(inputs.value);
    if (operator === "add") {
      qty += 1;
      if (qty >= qtyMin + 1) {
        countBtn2.disabled = false;
      }
      if (qty >= qtyMax) {
        e.target.disabled = true;
      }
    } else {
      qty = qty <= qtyMin ? qtyMin : (qty -= 1);

      if (qty === qtyMin) {
        e.target.disabled = true;
      }
      if (qty < qtyMax) {
        countBtn1.disabled = false;
      }
    }
    inputs.value = qty;
    // dispatch({
    //   type: addToCartAction,
    //   payload: { item: item, quantity: qty },
    // });
  }
  return (
    <>
      <div className="mini-items">
        <div className="name bold">Item</div>
        <div className="qty bold">Qty</div>

        <div className="price bold">Price</div>

        <div className="total bold">Total</div>
        <div className="actions bold">Actions</div>
      </div>

      {loopy.map((item, index) => (
        <div className="mini-items">
          <div className="name">Adidas</div>
          <div className="qty ">12</div>
          <div className="price ">12.000</div>
          <div className="total ">14.00</div>
          <div className="actions ">
            {" "}
            <div className="qty-input">
              <button
                className={`qty-count  qty-count--minus inv--minus${item.id}`}
                data-action="minus"
                type="button"
                onClick={(e) => buttonClick(e, item)}
              >
                -
              </button>
              <input
                className="product-qty"
                type="number"
                name="product-qty"
                min="0"
                // max={item.remaining}
                defaultValue={0}
                id={`inv${item.id}`}
                onChange={(e) => inputChange(e, item)}
                key={index}
              />
              <button
                className={`qty-count  qty-count--add inv--add${item.id}`}
                data-action="add"
                type="button"
                onClick={(e) => buttonClick(e, item)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
