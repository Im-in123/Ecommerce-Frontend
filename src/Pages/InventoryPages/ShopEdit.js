import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../stateManagement/store";
import "../../css/inventory-css/shop-edit.css";
import { getToken } from "../../auth/inventoryAuthController";
import { SHOP_URL } from "../../urls";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import InventoryContent from "../../Components/Inventory/InventoryContent";
const ShopEdit = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();

  const params = useParams();
  const [loadingShop, setLoadingShop] = useState(false);
  const [shopData, setShopData] = useState({
    name: "",
  });
  const [fetching, setFetching] = useState(true);

  const [fieldsError, setFieldsError] = useState({});

  useEffect(() => {
    getShopItem();

    return () => {};
  }, []);

  const getShopItem = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${SHOP_URL}/${params.slug}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("shop item res::", res.data);
      setShopData(res.data);
      setFetching(false);
    }
  };

  const submitAddShop = async () => {
    setFieldsError({ name: "" });
    const token = await getToken();
    setLoadingShop(true);
    console.log(shopData);
    const res = await axiosHandler({
      method: "patch",
      url: SHOP_URL,
      data: shopData,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, false);
      if (mini_err.message) {
        if (mini_err.server_error) {
          setFieldsError(mini_err.message);
        }
      }
    });
    if (res) {
      console.log(res.data);
      setShopData(res.data);
      dispatch({
        type: showInventoryMessageAction,
        payload: { message: "Shop updated successfully!" },
      });
    }
    setLoadingShop(false);
  };
  const onChangeShopData = (e) => {
    console.log(shopData);
    setShopData({
      ...shopData,
      [e.target.name]: e.target.value,
    });
  };
  const deleteItem = async (slug) => {
    if (!slug) return;
    if (!window.confirm("Are you sure you want to delete!!!?")) return;

    const token = await getToken();
    const result = await axiosHandler({
      method: "delete",
      url: `${SHOP_URL}/${slug}`,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
    });
    if (result) {
      console.log(result);
      navigate(-1);
    }
  };

  const content = () => {
    return (
      <>
        <div className="shops-edit">
          <div className="add-shop-content">
            <div className="content">
              <div className="form-container">
                <div>
                  <h2>UPDATE SHOP </h2>
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
                      <span>Name:</span>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Name"
                        name="name"
                        defaultValue={shopData.name}
                        onChange={onChangeShopData}
                        required
                      />
                    </label>
                    {fieldsError.name && <li>{fieldsError.name}</li>}
                  </div>

                  <button
                    type="submit"
                    className="button"
                    disabled={loadingShop}
                  >
                    {loadingShop ? <span id="loadersignup"></span> : "UPDATE"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <hr />
          <button onClick={() => deleteItem(shopData.slug)}>Delete Shop</button>
        </div>
      </>
    );
  };
  if (fetching) {
    return (
      <InventoryContent
        data={() => <div className="shops-edit">loading..</div>}
      />
    );
  }
  return <InventoryContent data={content} />;
};

export default ShopEdit;
