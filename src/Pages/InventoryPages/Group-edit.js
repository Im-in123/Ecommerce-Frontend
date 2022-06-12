import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../stateManagement/store";
import "../../css/inventory-css/group-edit.css";
import { getToken } from "../../auth/inventoryAuthController";
import { ALL_AVAILABLE_GROUP, GROUP_URL } from "../../urls";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import InventoryContent from "../../Components/Inventory/InventoryContent";
const GroupEdit = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();

  const params = useParams();
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
  });
  const [fetching, setFetching] = useState(true);
  const [allAvailableGroups, setAllAvailableGroups] = useState([]);

  const [fieldsError, setFieldsError] = useState({});

  useEffect(() => {
    getGroupItem();
    getAllAvailableGroups();
    return () => {};
  }, []);

  const getGroupItem = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${GROUP_URL}/${params.slug}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("Group item res::", res.data);
      setGroupData(res.data);
      setFetching(false);
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
  const submitAddGroup = async () => {
    setFieldsError({ name: "" });
    const token = await getToken();
    setLoadingGroup(true);
    console.log(groupData);
    const res = await axiosHandler({
      method: "patch",
      url: GROUP_URL,
      data: groupData,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
      console.log(mini_err);
      if (mini_err.message) {
        if (mini_err.server_error) {
          setFieldsError(mini_err.message);
        }
      }
    });
    if (res) {
      console.log(res.data);
      setGroupData(res.data);
      dispatch({
        type: showInventoryMessageAction,
        payload: { message: "Group updated successfully!" },
      });
    }
    setLoadingGroup(false);
  };
  const onChangeGroupData = (e) => {
    console.log(groupData);
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteItem = async (slug) => {
    if (!slug) return;
    if (!window.confirm("Are you sure you want to delete!!!?")) return;

    const token = await getToken();
    const result = await axiosHandler({
      method: "delete",
      url: `${GROUP_URL}/${slug}`,
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
        <div className="groups-edit">
          <div className="add-group-content">
            <div className="content">
              <div className="form-container">
                <div>
                  <h2>UPDATE GROUP </h2>
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
                      <span>Name:</span>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Name"
                        name="name"
                        defaultValue={groupData.name}
                        onChange={onChangeGroupData}
                        required
                      />
                    </label>
                    {fieldsError.name && <li>{fieldsError.name}</li>}
                  </div>
                  <div className="input-container">
                    <label htmlFor="groups" id="groups">
                      <span>Belongs To : &nbsp;</span>
                      <select name="groups">
                        {groupData.belongs_to ? (
                          <option
                            onClick={() =>
                              setGroupData({
                                ...groupData,
                                belongs_to_id: groupData.belongs_to.id,
                              })
                            }
                          >
                            {groupData.belongs_to.name}
                          </option>
                        ) : null}
                        <option
                          onClick={() => {
                            setGroupData({
                              ...groupData,
                              belongs_to_id: null,
                            });
                          }}
                        >
                          No Group
                        </option>
                        {allAvailableGroups &&
                          allAvailableGroups.map((item, index) => (
                            <option
                              value={item.name}
                              key={index}
                              onClick={() =>
                                setGroupData({
                                  ...groupData,
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
                      <li>{fieldsError.belongs_to}</li>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="button"
                    disabled={loadingGroup}
                  >
                    {loadingGroup ? <span id="loadersignup"></span> : "UPDATE"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <hr />
          <button onClick={() => deleteItem(groupData.slug)}>
            Delete Group
          </button>
        </div>
      </>
    );
  };
  if (fetching) {
    return (
      <InventoryContent
        data={() => <div className="groups-edit">loading..</div>}
      />
    );
  }
  return <InventoryContent data={content} />;
};

export default GroupEdit;
