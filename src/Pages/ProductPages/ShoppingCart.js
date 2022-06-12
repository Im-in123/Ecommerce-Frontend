import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/product-css/shopping-cart.css";
import {
  addToCartAction,
  cartMessageAction,
  removeFromCartAction,
} from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";

const ShoppingCart = () => {
  const {
    state: { cart, userDetail },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();

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
      dispatch({
        type: addToCartAction,
        payload: { item: item, quantity: qtyMin },
      });
    } else {
      minusBtn.disabled = false;
      if (qty >= qtyMax) {
        e.target.value = qtyMax;
        dispatch({
          type: addToCartAction,
          payload: { item: item, quantity: qtyMax },
        });
        addBtn.disabled = true;
      } else {
        e.target.value = qty;
        addBtn.disabled = false;
        dispatch({
          type: addToCartAction,
          payload: { item: item, quantity: qty },
        });
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
    dispatch({
      type: addToCartAction,
      payload: { item: item, quantity: qty },
    });
  }

  const subTotalAll = cart
    .map((item) => Number(item.item.price.replace("$", "")) * item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  console.log("total::::", subTotalAll);
  // const userLocale =
  //   navigator.languages && navigator.languages.length
  //     ? navigator.languages[0]
  //     : navigator.language;
  // console.log(userLocale);

  const subTotal = subTotalAll.toLocaleString("en", {
    style: "currency",
    // currency: "GHC",
    currency: "USD",
  });

  return (
    <div className="shopping-cart">
      <h1>Cart</h1>
      <div className="conts">
        <div className="conts-wrapper">
          {cart && (
            <div className="cart">
              <div className="img-d" />
              <div className="name">Product</div>
              <div className="product-quantity rm-b">&nbsp; Qty</div>
              <div className="price">&nbsp;Price</div>
              <div className="del">x</div>
            </div>
          )}
          {cart.length > 0 &&
            cart.map((obj, index) => {
              // console.log("objj:::", obj);
              return (
                <div className="cart" key={index}>
                  <img
                    src={obj.item.photo[0]?.image}
                    alt={obj.item.name}
                    key={index}
                  />
                  <div
                    className="name"
                    onClick={() =>
                      navigate(`/product/${obj.item.slug}`, {
                        state: obj.item,
                      })
                    }
                  >
                    <span>{obj.item.name}</span>
                    <span>1x{obj.quantity}</span>
                    <span>=${obj.item.price * obj.quantity} </span>
                  </div>{" "}
                  <div className="product-quantity">
                    <div className="qty-input">
                      <button
                        className={`qty-count qty-count--minus  qty-count--minus${obj.item.id}`}
                        data-action="minus"
                        type="button"
                        onClick={(e) => buttonClick(e, obj.item)}
                      >
                        -
                      </button>
                      <input
                        className="product-qty"
                        type="number"
                        name="product-qty"
                        min="1"
                        max="1000"
                        defaultValue={obj.quantity}
                        id={`input${obj.item.id}`}
                        onChange={(e) => inputChange(e, obj.item)}
                        key={index}
                      />
                      <button
                        className={`qty-count qty-count--add  qty-count--add${obj.item.id}`}
                        data-action="add"
                        type="button"
                        onClick={(e) => buttonClick(e, obj.item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="price">
                    {obj.item.compare_price > 0 && (
                      <span>
                        <del>${obj.item.compare_price}</del>
                      </span>
                    )}
                    &nbsp;
                    <span>${obj.item.price}</span>
                  </div>
                  <div className="del">
                    <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => {
                        dispatch({
                          type: removeFromCartAction,
                          payload: { item: obj.item, show: true },
                        });
                        setTimeout(() => {
                          dispatch({
                            type: cartMessageAction,
                            payload: {},
                          });
                        }, 4000);
                      }}
                    ></i>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="checkout">
          <div className="checkout-inner">
            <div className="sub-total">
              <span>Subtotal</span> <span>{subTotal}</span>
            </div>
            {/* <div className="sub-total">
              <span>Discount</span> <span></span>
            </div> */}
            <hr />
          </div>
          <div className="total">
            {/* <div className="total-inner">
              <span>Total</span> <span>$</span>
            </div> */}
            <button
              className="product-btn"
              onClick={() => navigate("/payment")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
