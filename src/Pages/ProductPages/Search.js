import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { PRODUCT_URL } from "../../urls";
import "../../css/product-css/search.css";
import { store } from "../../stateManagement/store";
import axios from "axios";
import { GridContainerProduct } from "./Product";
let cancelToken;

const Search = () => {
  const { dispatch } = useContext(store);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [end, setEnd] = useState(false);

  let goneNext = false;
  let canGoNext = false;
  let shouldHandleScroll = false;
  let pagination;
  let products_temp = [];

  useEffect(() => {
    window.addEventListener("scroll", autoFetchProductsOnScroll);

    return () => {
      window.removeEventListener("scroll", autoFetchProductsOnScroll);
    };
  }, []);

  useEffect(() => {
    getSearch(search);

    return () => {};
  }, [search]);

  const autoFetchProductsOnScroll = async () => {
    if (shouldHandleScroll) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
        console.log("reached --search");
        if (canGoNext && !goneNext) {
          goneNext = true;
          shouldHandleScroll = false;
          await getSearch(search);
        } else {
          console.log("passing: ", canGoNext, goneNext);
        }
      }
    } else {
      console.log("passing autofetch", canGoNext, goneNext);
    }
  };
  const getSearch = async (keyw = "") => {
    setLoading(true);

    let url, keyword;
    if (pagination?.next) {
      url = `${pagination.next}`;
    } else {
      keyword = `?keyword=${keyw}&mode=search&page=${1}`;
      url = `${PRODUCT_URL}${keyword}`;
    }
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation cancelled");
    }
    cancelToken = axios.CancelToken.source();

    const res = await axiosHandler({
      method: "get",
      url: url,
      // token,
      cancelToken: cancelToken.token,
    }).catch((e) => {
      if (axios.isCancel(e)) {
        console.log("i am cancelled..");
      } else {
        const mini_error = miniErrorHandler(e, true);
      }
      canGoNext = true;
      goneNext = false;
      setError(true);
    });
    if (res) {
      console.log("res search::", res.data);
      for (var i in res.data.results) {
        products_temp.push(res.data.results[i]);
      }

      setProducts(products_temp);
      setError(false);

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
  return (
    <div className="main-search">
      <div className="top-search">
        <div className="btn">
          <button onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left-long"></i>
          </button>
        </div>

        <div className="search">
          <div className="search-input">
            <input
              autoFocus
              type="search"
              className="search-field"
              placeholder="Search our products, categories.."
              name="search"
              value={search}
              onChange={(e) => {
                if (e.target.value.includes("#")) {
                  alert("search must not contain the '#' symbol");
                } else {
                  setSearch(e.target.value);
                }
              }}
            />
            <button id="search-btn" onClick={() => getSearch(search)}>
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="search-content">
        <GridContainerProduct
          item={products}
          title="Search results"
          show_cart={true}
          dispatch={dispatch}
        />
        <div className="load-more">
          {error ? (
            <div className="error">
              <span>An error occurred!</span>
              <button
                onClick={() => {
                  canGoNext = true;
                  goneNext = false;
                  shouldHandleScroll = true;
                  getSearch(search);
                }}
              >
                Load remaining items
              </button>
            </div>
          ) : (
            <span>
              {end ? "No more items!" : <>{loading ? "loading..." : ""}</>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
