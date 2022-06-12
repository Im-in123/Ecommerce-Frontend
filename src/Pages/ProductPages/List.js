import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../css/product-css/list.css";
import { useNavigate } from "react-router-dom";
import { CATEGORY_URL, LOCAL_CHECK, TOP_PRODUCT_CATEGORIES } from "../../urls";
import { axiosHandler } from "../../auth/helper";
import { miniErrorHandler } from "../../auth/helper";
import {
  addToCartAction,
  categoriesAction,
} from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";

const List = () => {
  const navigate = useNavigate();
  const {
    state: { categories },
    dispatch,
  } = useContext(store);

  const [categoryList, setCategoryList] = useState([]);
  const [fetching, setFetching] = useState(false);

  console.log("naviage::", navigate);

  useEffect(() => {
    if (categories.data.length < 1) {
      setFetching(true);

      getTopProductCategories();
    }
    return () => {};
  }, []);
  // const getCategories = async () => {
  //   const res = await axiosHandler({
  //     method: "get",
  //     url: CATEGORY_URL,
  //     // token,
  //   }).catch((e) => {
  //     const mini_error = miniErrorHandler(e, true);
  //   });
  //   if (res) {
  //     console.log("res::", res.data);
  //     // dispatch({ type: categoriesAction, payload: res.data.results });
  //   }
  // };

  const getTopProductCategories = async () => {
    const res = await axiosHandler({
      method: "get",
      url: TOP_PRODUCT_CATEGORIES,
      // token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("uri::", res);

      console.log("res getProductCategories::", res.data);
      dispatch({ type: categoriesAction, payload: res.data });
      // console.log("ee:::",)
    }
    setFetching(false);
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="list-content">
        <aside className="list-aside">
          <h4>Categories</h4>
          <ul>
            {categories.data.map((item, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/category/${item.group.slug}`, {
                    state: { category: item },
                  })
                }
              >
                <Link to="">{item.group.name}</Link>
              </li>
            ))}
          </ul>
          <hr />
          {/* <h3>Mode</h3>
          <em>Pickup</em>
          <em>Delivery</em> */}
        </aside>
        {fetching ? (
          <div className="grids">&nbsp;Loading...</div>
        ) : (
          <div className="grids">
            {categories.data.map((item, index) => (
              <GridContainer
                item={item}
                key={index}
                navigate={navigate}
                dispatch={dispatch}
                show_cart={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;

export const GridContainer = (props) => {
  // console.log("prop::", props);
  if (!props.item) return <></>;
  const item = props.item;
  if (item.items?.length < 1) return <></>;

  return (
    <div className="grid-inner">
      <div className="grid-head">
        <h4>{item.group.name}</h4>
        {props.show_cart && (
          <span
            onClick={() =>
              props.navigate(`/category/${item.group.slug}`, {
                state: { category: item },
              })
            }
          >
            See More
          </span>
        )}
      </div>

      <div className="grid-container">
        {item.items.map((item, index) => (
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
                        console.log(e);
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
                      {" "}
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
