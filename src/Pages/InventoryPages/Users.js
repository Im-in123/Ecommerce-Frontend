import React, { useState, useEffect } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { USERS_URL } from "../../urls";
import "../../css/inventory-css/users.css";
import moment from "moment";
import { getToken } from "../../auth/inventoryAuthController";
import { useLocation, useNavigate } from "react-router-dom";
import { Paginate } from "./Inventories";

const Users = () => {
  const [users, setUsers] = useState([]);
  const state = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();

    return () => {};
  }, [state, search]);

  const getUsers = async () => {
    setLoading(true);

    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${USERS_URL}${state.search}${
        state.search ? "&" : "?"
      }keyword=${search}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      setError(true);
    });
    if (res) {
      console.log("users res::", res.data);
      setPagination(res.data);

      setUsers(res.data.results);
      setError(false);
    }
    setLoading(false);
  };

  const content = () => {
    return (
      <div className="users">
        <div className="top">
          <div>Users</div>
          <div className="search-and-add">
            <div className="search">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />{" "}
              <button onClick={() => getUsers()}>
                {" "}
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="users-items g">
          <div className="email bold">Email</div>
          <div className="name bold">Name </div>
          <div className="is-active bold">IsActive </div>
          <div className="last-login bold">Last Login </div>
          <div className="role bold">Role </div>
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
                {users.map((item, index) => (
                  <div className="users-items" key={index}>
                    <div className="email ">{item.email}</div>
                    <div className="name ">{item.name} </div>
                    <div className="is-active">
                      {item.is_active ? "True" : "False"}
                    </div>
                    <div className="last-login ">
                      {" "}
                      {moment(item.last_login).format("YYYY/MM/DD")}{" "}
                      {moment(item.last_login).format("hh:mm a")}
                    </div>
                    <div className="role ">{item.user_type} </div>

                    <div className="created-at">
                      {" "}
                      {moment(item.created_at).format("YYYY/MM/DD")}{" "}
                      {moment(item.created_at).format("hh:mm a")}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        <Paginate
          navigate={navigate}
          pagination={pagination}
          state={state}
          name={"users"}
        />
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default Users;
