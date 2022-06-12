import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../css/product-css/product.css";
import { useNavigate } from "react-router-dom";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { LOCAL_CHECK, PRODUCT_URL, RELATED_PRODUCT_URL } from "../../urls";
import { addToCartAction } from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
let productQuantity = 1;
const Product = () => {
  const { state } = useLocation();
  console.log("product state::", state);
  const navigate = useNavigate();
  const params = useParams();
  // console.log("product params::", params);
  const {
    state: { cart },
    dispatch,
  } = useContext(store);

  const [product, setProduct] = useState(state ? state : {});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    let inputs = document.querySelector(".product-qty");
    let countBtns = document.getElementsByClassName("qty-count");

    let countBtn1 = document.querySelector(".qty-count--add");
    let countBtn2 = document.querySelector(".qty-count--minus");

    let qtyMin = parseInt(inputs.min);
    let qtyMax = parseInt(inputs.max);
    let minusBtn = document.querySelector(".qty-count--minus");
    let addBtn = document.querySelector(".qty-count--add");

    function inputChange() {
      console.log("clicked");
      let qty = parseInt(this.value);
      console.log("clicked", qty);
      if (isNaN(qty) || qty <= qtyMin) {
        this.value = qtyMin;
        minusBtn.disabled = true;
        productQuantity = qtyMin;
      } else {
        minusBtn.disabled = false;

        if (qty >= qtyMax) {
          this.value = qtyMax;
          addBtn.disabled = true;
          productQuantity = qtyMax;
        } else {
          this.value = qty;
          addBtn.disabled = false;
          productQuantity = qty;
        }
      }
    }
    function buttonClick() {
      var operator;
      if (this.classList.contains("qty-count--add")) {
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
          this.disabled = true;
        }
      } else {
        qty = qty <= qtyMin ? qtyMin : (qty -= 1);

        if (qty === qtyMin) {
          this.disabled = true;
        }

        if (qty < qtyMax) {
          countBtn1.disabled = false;
        }
      }

      inputs.value = qty;
      productQuantity = qty;
    }

    inputs.addEventListener("change", inputChange);
    // countBtn.addEventListener("click", buttonClick);
    let i;
    for (i = 0; i < countBtns.length; i++) {
      countBtns[i].addEventListener("click", buttonClick);
    }
    return () => {
      inputs.removeEventListener("change", inputChange);
      for (i = 0; i < countBtns.length; i++) {
        countBtns[i].removeEventListener("click", buttonClick);
      }
      // inputs.removeEventListener("click", buttonClick);
    };
  }, []);

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
  useEffect(() => {
    const openMenu = document.querySelector(".btc");
    const openMenu2 = document.querySelector(".btc2");

    const closeCart = document.querySelector(".close-cart");
    const overlay = document.querySelector(".overlay");
    const main_nav = document.querySelector("#main-nav");
    function openMenuHandler(e) {
      e.preventDefault();
      console.log(productQuantity);
      dispatch({
        type: addToCartAction,
        payload: {
          item: product,
          quantity: productQuantity === 1 ? null : productQuantity,
        },
      });
      document.body.classList.add("nav-open");
      main_nav.style.display = "none";
    }
    function openMenuHandler2(e) {
      e.preventDefault();
      console.log(productQuantity);
      dispatch({
        type: addToCartAction,
        payload: {
          item: product,
          quantity: productQuantity === 1 ? null : productQuantity,
        },
      });
      document.body.classList.add("nav-open");
      main_nav.style.display = "none";
      navigate("/checkout");
    }
    function closeCartHandler(e) {
      e.preventDefault();
      document.body.classList.remove("nav-open");
      main_nav.style.display = "flex";
    }
    function overlayHandler(e) {
      e.preventDefault();
      document.body.classList.remove("nav-open");
      main_nav.style.display = "flex";
    }
    openMenu.addEventListener("click", openMenuHandler);
    openMenu2.addEventListener("click", openMenuHandler2);

    closeCart.addEventListener("click", closeCartHandler);
    overlay.addEventListener("click", overlayHandler);

    return () => {
      openMenu.removeEventListener("click", openMenuHandler);
      openMenu2.removeEventListener("click", openMenuHandler2);

      closeCart.removeEventListener("click", closeCartHandler);
      overlay.removeEventListener("click", overlayHandler);
      document.body.classList.remove("nav-open");
      main_nav.style.display = "flex";
    };
  }, []);

  useEffect(() => {
    // if (state) {
    //   getRelatedProducts(state.name);
    // } else {
    //   if (params.slug) {
    //     getProduct(params.slug);
    //   }
    // }
    if (params.slug) getProduct(params.slug);

    return () => {};
  }, []);

  const getProduct = async (slug) => {
    const res = await axiosHandler({
      method: "get",
      url: `${PRODUCT_URL}${slug}/`,
      // token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("res::", res.data);
      setProduct(res.data);
      // if (!state) {
      getRelatedProducts(res.data.slug);
      // }
    }
  };
  const getRelatedProducts = async (keyw = "") => {
    let keyword = `?keyword=${keyw}&page=1`;

    const res = await axiosHandler({
      method: "get",
      url: `${RELATED_PRODUCT_URL}${keyword}`,
      // token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("Related res::", res.data);
      setRelatedProducts(res.data.results);
    }
  };
  return (
    <>
      <div className="product-main">
        <div className="wrapper">
          <div className="product-top">
            <div className="product-gallery">
              {product.photo?.map((item, index) => (
                <div key={index}>
                  {LOCAL_CHECK ? (
                    <img src={item.image} alt={`${product.name}`} />
                  ) : (
                    <img src={item.photo} alt={`${product.name}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="product-info">
              <div className="product-desc">
                <div className="product-type">In stock</div>
                <h1>{product.name}</h1>
                <p className="product-price">
                  {product.compare_price > 0 && (
                    <span>
                      <del>${product.compare_price}</del>
                    </span>
                  )}
                  &nbsp; ${product.price}
                </p>
                <h3>Quantity</h3>
                <div className="product-quantity">
                  <div className="qty-input">
                    <button
                      className="qty-count qty-count--minus"
                      data-action="minus"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      className="product-qty"
                      type="number"
                      name="product-qty"
                      min="1"
                      max="10000"
                      // value="1"
                      defaultValue={productQuantity}
                    />
                    <button
                      className="qty-count qty-count--add"
                      data-action="add"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="product-short">
                  <h3>Description</h3>
                  {product.description?.length > 200 ? (
                    <p
                      onClick={() => {
                        try {
                          let el = document
                            .getElementById("descr")
                            .scrollIntoView({ behavior: "smooth" });
                        } catch (error) {}
                      }}
                    >
                      {product.description?.substring(0, 190)} &nbsp;
                      <span style={{ color: "grey", cursor: "pointer" }}>
                        See more..
                      </span>
                    </p>
                  ) : (
                    <p>{product.description}</p>
                  )}
                </div>

                {product.sizes?.length > 0 && <h3>Size</h3>}
                <div className="product-sizes">
                  {product.sizes?.map((item, index) => (
                    <span key={index}>{item.name}</span>
                  ))}
                </div>
                {product.colors?.length > 0 && <h3>Color</h3>}

                <div className="product-sizes">
                  {product.colors?.map((item, index) => (
                    <span key={index}>{item.name}</span>
                  ))}
                </div>
                <div className="btn-cont">
                  <button className="product-btn btc">Add to cart</button>
                  <button className="product-btn2 btc2">Buy it now</button>
                </div>
              </div>
            </div>
          </div>
          <div className="product-bottom">
            {product.description?.length > 200 && (
              <>
                <h2 id="descr">Description</h2>
                <p>{product.description}</p>
              </>
            )}
            <div>
              <GridContainerProduct
                item={relatedProducts}
                title="Related"
                show_cart={true}
                dispatch={dispatch}
              />
            </div>
          </div>
        </div>

        <div className="cart">
          <div className="cart-inner">
            <header className="cart-header">
              <div className="icos">
                <div className="ico-inner">
                  <i className="fa fa-check" aria-hidden="true"></i>
                  &nbsp; <span>Item added to cart</span>
                </div>
                <button className="close-cart">
                  <i className="fa fa-close" aria-hidden="true"></i>
                </button>
              </div>
              <div className="added-item">
                {product.photo?.length > 0 && (
                  <>
                    {LOCAL_CHECK ? (
                      <img
                        src={product.photo[0]?.image}
                        alt={`${product.name}`}
                      />
                    ) : (
                      <img
                        src={product.photo[0]?.photo}
                        alt={`${product.name}`}
                      />
                    )}
                  </>
                )}

                <span>
                  {product.name} x {productQuantity}
                </span>
              </div>
            </header>
            <div className="cart-content">
              <div className="btn-cont">
                <button
                  className="product-btn2"
                  onClick={() => {
                    productQuantity = 1;
                    navigate(`/cart`);
                  }}
                >
                  View cart({cart.length})
                </button>
                <button className="product-btn2">Check out</button>
                {/* <a href="#">Continue shopping</a> */}
              </div>
            </div>
          </div>
        </div>
        <div className="overlay"></div>
      </div>
    </>
  );
};

export default Product;

export const GridContainerProduct = (props) => {
  // console.log("prop::", props);

  if (!props.item) return <></>;
  const item = props.item;
  if (item.length < 1) return <></>;

  return (
    <div className="grid-inner">
      <div className="grid-head">
        <h2>{props?.title}</h2>
        {/* {!props.show_cart && (
          <span onClick={() => navigate("/inside-category")}>See More</span>
        )} */}
      </div>

      <div className="grid-container">
        {item.map((item, index) => (
          <div className="grid-item" key={index}>
            <div className="grid-cont">
              <Link
                to={{
                  pathname: `/product/${item.slug}`,
                }}
                state={item}
                key={index}
              >
                {LOCAL_CHECK ? (
                  <img src={item.photo[0]?.image} alt={item.name} />
                ) : (
                  <img src={item.photo[0]?.photo} alt={item.name} />
                )}
              </Link>
              <div className="info">
                <div className="title">
                  <span>{item.name}</span>
                </div>
                <div className="price">
                  {item.compare_price > 0 && (
                    <span>
                      <del>${item.compare_price}</del>
                    </span>
                  )}

                  <span>${item.price}</span>
                </div>
                {props.show_cart && (
                  <div className="add-btn">
                    <button
                      onClick={(e) => {
                        props.dispatch({
                          type: addToCartAction,
                          payload: { item: item, quantity: null, show: false },
                        });
                        let inner = `<span style='color:orange'>Added</span>`;
                        e.target.innerHTML = inner;
                        setTimeout(() => {
                          e.target.innerText = "Add to cart";
                        }, 3000);
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
