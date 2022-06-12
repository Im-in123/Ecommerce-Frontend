import React, { useState, useEffect } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { ACTIVITIES_URL } from "../../urls";
import "../../css/inventory-css/user-activities.css";
import moment from "moment";
import { getToken } from "../../auth/inventoryAuthController";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginate } from "./Inventories";

const UserActivities = () => {
  const [userActivities, setUserActivities] = useState([]);
  const state = useLocation();
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUserActivities();

    return () => {};
  }, [state, search]);

  const getUserActivities = async () => {
    setLoading(true);

    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${ACTIVITIES_URL}${state.search}${
        state.search ? "&" : "?"
      }keyword=${search}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      setError(true);
    });
    if (res) {
      console.log("useractivities res::", res.data);
      setPagination(res.data);

      setUserActivities(res.data.results);
      setError(false);
    }
    setLoading(false);
  };

  const content = () => {
    return (
      <div className="user-activity">
        <div className="top">
          <div>User Activities</div>
          <div className="search-and-add">
            <div className="search">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => getUserActivities()}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="user-activity-items g">
          <div className="action bold">Action</div>
          <div className="performed-by bold">Performed By </div>
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
                {userActivities.map((item, index) => (
                  <div className="user-activity-items" key={index}>
                    <div className="action ">{item.action}</div>
                    <div className="performed-by ">{item.email} </div>
                    <div className="created-at">
                      {" "}
                      {moment(item.created_at).format("YYYY/MM/DD")}{" "}
                      {moment(item.created_at).format("hh:mm a")}
                    </div>
                  </div>
                ))}
              </>
            )}{" "}
          </>
        )}

        <Paginate
          navigate={navigate}
          pagination={pagination}
          state={state}
          name={"user-activities"}
        />
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default UserActivities;
