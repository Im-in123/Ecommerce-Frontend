import React, { useState, useEffect, useContext } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { ALL_AVAILABLE_GROUP, GROUP_URL } from "../../urls";
import { store } from "../../stateManagement/store";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import moment from "moment";
import "../../css/inventory-css/groups.css";
import { getToken } from "../../auth/inventoryAuthController";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginate } from "./Inventories";

const Groups = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();
  const state = useLocation();
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [loadingAddGroup, setLoadingAddGroup] = useState(false);
  const [allAvailableGroups, setAllAvailableGroups] = useState([]);
  const [addGroup, setAddGroup] = useState(false);
  const [addGroupData, setAddGroupData] = useState({
    name: "",
  });
  const [fieldsError, setFieldsError] = useState({
    name: "",
  });
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getGroups();

    return () => {};
  }, [state]);
  useEffect(() => {
    getGroups();
    getAllAvailableGroups();
    return () => {};
  }, [state, search]);
  const onChangeAddGroupData = (e) => {
    setAddGroupData({ ...addGroupData, [e.target.name]: e.target.value });
    console.log(addGroupData);
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
  const getGroups = async () => {
    setLoading(true);

    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${GROUP_URL}${state.search}${
        state.search ? "&" : "?"
      }keyword=${search}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      setError(true);
    });
    if (res) {
      console.log("group res::", res.data);
      setPagination(res.data);

      const data = res.data.results.map((item) => ({
        ...item,
        belongsTo: item.belongs_to ? item.belongs_to.name : "Not defined",
      }));
      console.log("data::", data);
      setGroups(data);
      setError(false);
    }
    setLoading(false);
  };
  const submitAddGroup = async () => {
    setFieldsError({ name: "" });
    const token = await getToken();
    setLoadingAddGroup(true);
    console.log(addGroupData);
    const result = await axiosHandler({
      method: "post",
      url: GROUP_URL,
      data: addGroupData,
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
      setAddGroup(false);
      getGroups();
      getAllAvailableGroups();
    }
    setLoadingAddGroup(false);
  };
  const content = () => {
    return (
      <div className="group">
        {addGroup ? (
          <div className="add-group-content">
            <button className="" onClick={() => setAddGroup(false)}>
              <i className="fa fa-close" aria-hidden="true"></i>
            </button>
            <div className="content">
              <div className="form-container">
                <div>
                  <h2>ADD GROUP </h2>
                  {fieldsError.error && (
                    <div className="err">
                      <div className="error-div"> {fieldsError.error}</div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAddGroup();
                  }}
                >
                  <div className="input-container">
                    <label htmlFor="name">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Name"
                        name="name"
                        defaultValue={addGroupData.name}
                        onChange={onChangeAddGroupData}
                        required
                      />
                    </label>
                    {fieldsError.name && <li>{fieldsError.name}</li>}
                  </div>
                  <div className="input-container">
                    <label htmlFor="groups" id="groups">
                      Belongs to : &nbsp;
                      <select name="groups">
                        <option
                          onClick={() =>
                            setAddGroupData({
                              ...addGroupData,
                              belongs_to_id: null,
                            })
                          }
                        >
                          Select a group
                        </option>

                        {allAvailableGroups &&
                          allAvailableGroups.map((item, index) => (
                            <option
                              value={item.name}
                              key={index}
                              onClick={() =>
                                setAddGroupData({
                                  ...addGroupData,
                                  belongs_to_id: item.id,
                                })
                              }
                            >
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </label>
                    {fieldsError.belongs_to && (
                      <li>{fieldsError.belongs_to_id}</li>
                    )}
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
              <div>Groups</div>
              <div className="search-and-add">
                <div className="search">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />{" "}
                  <button onClick={() => getGroups()}>
                    {" "}
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="add">
                  <button onClick={() => setAddGroup(true)}>Add Group</button>
                </div>
              </div>
            </div>
            <div className="group-items g">
              <div className="name bold">Name</div>
              <div className="belongs-to bold">Belongs To (Another Group)</div>
              <div className="total-items bold">Total Items</div>
              <div className="created-at bold">Created At</div>
            </div>
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
                    {groups.map((item, index) => {
                      return (
                        <div
                          className="group-items"
                          key={index}
                          onClick={() => navigate(`/group-edit/${item.slug}`)}
                        >
                          <div className="name">{item.name}</div>
                          <div className="belongs-to">{item.belongsTo}</div>

                          <div className="total-items">{item.total_items}</div>
                          <div className="created-at">
                            {" "}
                            {moment(item.created_at).format("YYYY/MM/DD")}{" "}
                            {moment(item.created_at).format("hh:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}

            <Paginate
              navigate={navigate}
              pagination={pagination}
              state={state}
              name={"groups"}
            />
          </>
        )}
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default Groups;
