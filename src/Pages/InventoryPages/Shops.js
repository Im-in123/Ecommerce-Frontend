import React, { useState, useEffect, useContext } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { INVENTORY_URL, SHOP_URL } from "../../urls";
import { store } from "../../stateManagement/store";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import moment from "moment";
import "../../css/inventory-css/shops.css";
import { getToken } from "../../auth/inventoryAuthController";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginate } from "./Inventories";

const Shops = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loadingAddGroup, setLoadingAddGroup] = useState(false);
  const state = useLocation();
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [addShop, setAddShop] = useState(false);
  const [addShopData, setAddShopData] = useState({
    name: "",
  });
  const [fieldsError, setFieldsError] = useState({
    name: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    getShops();

    return () => {};
  }, [state, search]);
  const onChangeAddShopData = (e) => {
    setAddShopData({
      [e.target.name]: e.target.value,
    });
  };
  const getShops = async () => {
    setLoading(true);
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${SHOP_URL}${state.search}${
        state.search ? "&" : "?"
      }keyword=${search}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      setError(true);
    });
    if (res) {
      console.log("shops res::", res.data);
      setPagination(res.data);

      const data = res.data.results.map((item) => ({
        ...item,
        created_by_email: item.created_by.email,
      }));
      setShops(data);
      console.log("data::", data);
      setError(false);
    }
    setLoading(false);
  };
  const submitAddShop = async () => {
    setFieldsError({ name: "" });
    const token = await getToken();
    setLoadingAddGroup(true);
    console.log(addShopData);
    const result = await axiosHandler({
      method: "post",
      url: SHOP_URL,
      data: addShopData,
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
        payload: { message: "Shop created successfully!" },
      });
      setAddShop(false);
      getShops();
    }
    setLoadingAddGroup(false);
  };

  const content = () => {
    return (
      <div className="shop">
        {addShop ? (
          <div className="add-shop-content">
            <button className="" onClick={() => setAddShop(false)}>
              <i className="fa fa-close" aria-hidden="true"></i>
            </button>
            <div className="content">
              <div className="form-container">
                <div>
                  <h2>ADD SHOP</h2>
                  {fieldsError.error && (
                    <div className="err">
                      <div className="error-div"> {fieldsError.error}</div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAddShop();
                  }}
                >
                  <div className="input-container">
                    <label htmlFor="name">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Name"
                        name="name"
                        defaultValue={addShopData.name}
                        onChange={onChangeAddShopData}
                        required
                      />
                    </label>
                    {fieldsError.name && <li>{fieldsError.name}</li>}
                  </div>

                  <button
                    type="submit"
                    className="button"
                    disabled={loadingAddGroup}
                  >
                    {loadingAddGroup ? (
                      <span id="loadersignup"></span>
                    ) : (
                      "CREATE"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="top">
              <div>shops</div>
              <div className="search-and-add">
                <div className="search">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button onClick={() => getShops()}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="add">
                  <button onClick={() => setAddShop(true)}>Add Shop</button>
                </div>
              </div>
            </div>
            <div className="shop-items g">
              <div className="name bold">Name</div>
              <div className="created-by bold">Created By </div>
              <div className="created-at bold">Created At</div>
            </div>
            <>
              {loading ? (
                <div className="loader-div">
                  <span id="loadersignup"></span>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="loader-div">
                      <span>Error. Try again!</span>
                    </div>
                  ) : (
                    <>
                      {" "}
                      {shops.map((item, index) => {
                        return (
                          <div
                            className="shop-items"
                            key={index}
                            onClick={() => navigate(`/shop-edit/${item.slug}`)}
                          >
                            <div className="name">{item.name}</div>
                            <div className="created-by">
                              {item.created_by.email}
                            </div>
                            <div className="created-at">
                              {moment(item.created_at).format("YYYY/MM/DD")}{" "}
                              {moment(item.created_at).format("hh:mm a")}
                            </div>
                          </div>
                        );
                      })}{" "}
                    </>
                  )}
                </>
              )}
            </>

            <Paginate
              navigate={navigate}
              pagination={pagination}
              state={state}
              name={"shops"}
            />
          </>
        )}
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default Shops;
