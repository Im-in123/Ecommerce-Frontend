import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../css/product-css/list.css";
import { GridContainer } from "./List";
import {
  addToCartAction,
  categoriesAction,
} from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { PRODUCT_URL, CATEGORY_URL, LOCAL_CHECK } from "../../urls";

const InsideCategory = () => {
  const navigate = useNavigate();

  const params = useParams();

  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({});
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [end, setEnd] = useState(false);

  let goneNext = false;
  let canGoNext = false;
  let shouldHandleScroll = false;
  let temp_category = null;
  let pagination;
  let products_temp = [];

  const {
    state: { categories },
    dispatch,
  } = useContext(store);

  useEffect(() => {
    window.addEventListener("scroll", autoFetchProductsOnScroll);

    return () => {
      window.removeEventListener("scroll", autoFetchProductsOnScroll);
    };
  }, [params]);

  useEffect(() => {
    (async () => {
      await getCategory(params.category);
    })();

    return () => {};
  }, [params]);
  useEffect(() => {
    (async () => {
      await getCategoryProducts(params.category);
    })();

    return () => {};
  }, [params]);

  const autoFetchProductsOnScroll = async () => {
    if (shouldHandleScroll) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
        console.log("reached");
        if (canGoNext && !goneNext) {
          goneNext = true;
          shouldHandleScroll = false;
          if (currentCategory.group) {
            console.log("category");

            await getCategoryProducts(currentCategory.group.slug);
          } else if (temp_category?.group) {
            console.log("temp");
            await getCategoryProducts(temp_category.group.slug);
          } else {
            await getCategoryProducts(params.category);
          }
        } else {
          console.log("passing: ", canGoNext, goneNext);
        }
      }
    } else {
      console.log("passing autofetch", canGoNext, goneNext);
    }
  };
  const getCategoryProducts = async (keyw = "") => {
    setLoading(true);
    let url, keyword;
    if (pagination?.next) {
      url = `${pagination.next}`;
    } else {
      keyword = `?keyword=${keyw}&page=${1}`;
      url = `${PRODUCT_URL}${keyword}`;
    }
    const res = await axiosHandler({
      method: "get",
      url: url,
      // token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      canGoNext = true;
      goneNext = false;
      shouldHandleScroll = true;
      setError(true);
    });
    if (res) {
      console.log("res getcategoryProducts::", res.data);

      for (var i in res.data.results) {
        products_temp.push(res.data.results[i]);
      }
      let data = [
        {
          // group: currentCategory.group,
          items: products_temp,
        },
      ];

      setProducts(data);
      setError(false);

      console.log("products temp::", products_temp);
      console.log("products::", products);

      pagination = res.data;

      if (pagination.next) {
        canGoNext = true;
        goneNext = false;
        setEnd(false);
        shouldHandleScroll = true;
      } else {
        setEnd(true);
        shouldHandleScroll = false;
        canGoNext = false;
      }
    }
    setLoading(false);
  };
  const getCategory = async (slug) => {
    const res = await axiosHandler({
      method: "get",
      url: `${CATEGORY_URL}${slug}/`,
      // token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("res getCategory::", res.data);
      temp_category = res.data;
      setCurrentCategory(res.data);
    }
  };
  return (
    <div>
      {/* <Header /> */}
      <div className="list-content">
        <aside className="list-aside">
          <h4>Departments</h4>
          <ul>
            {currentCategory.groups?.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(`/category/${item.slug}`)}
              >
                <Link to="">{item.name}</Link>
              </li>
            ))}
          </ul>

          <hr />
          <h4>Categories</h4>
          <ul>
            {categories.data.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(`/category/${item.group.slug}`)}
              >
                <Link to="">{item.group.name}</Link>
              </li>
            ))}
          </ul>
          <hr />
          <h3>Mode</h3>
          <em>Pickup</em>
          <em>Delivery</em>
        </aside>
        <div className="grids">
          {products.map((item, index) => (
            <GridContainerCategory
              item={item}
              key={index}
              show_cart={true}
              dispatch={dispatch}
              group_title={currentCategory.group?.name}
            />
          ))}
          <div className="load-more">
            {error ? (
              <div className="error">
                <span>An error occurred!</span>
                <button
                  onClick={() => {
                    canGoNext = true;
                    goneNext = false;
                    shouldHandleScroll = true;
                    getCategoryProducts(params.category);
                  }}
                >
                  Load remaining items
                </button>
              </div>
            ) : (
              <span>
                {end ? (
                  "No more items!"
                ) : (
                  <>{loading ? "loading..." : "Scroll down to fetch more..."}</>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideCategory;

export const GridContainerCategory = (props) => {
  // console.log("prop  thiss::", props);
  if (!props.item) return <></>;
  const item = props.item;
  return (
    <div className="grid-inner">
      <div className="grid-head">
        <h4>{props.group_title}</h4>
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
