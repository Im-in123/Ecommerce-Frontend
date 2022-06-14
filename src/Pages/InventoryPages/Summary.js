import React, { useEffect, useState } from "react";
import "../../css/inventory-css/summary.css";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { SUMMARY_URL } from "../../urls";
import { getToken } from "../../auth/inventoryAuthController";

const tempSummary = {
  total_inventory: {
    title: "Total Items",
    count: 0,
    icon: (
      <span className="dashIcon inventory">
        <i className="fa-solid fa-shirt"></i>
      </span>
    ),
  },
  total_group: {
    title: "Total Groups",
    count: 0,
    icon: (
      <span className="dashIcon">
        <i className="fa-solid fa-layer-group"></i>
      </span>
    ),
  },
  total_shop: {
    title: "Total Shops",
    count: 0,
    icon: (
      <span className="dashIcon ">
        <i className="fa-solid fa-shop"></i>
      </span>
    ),
  },
  total_users: {
    title: "Total Users",
    count: 0,
    icon: (
      <span className="dashIcon">
        <i className="fa-solid fa-users-line"></i>{" "}
      </span>
    ),
  },
};

const Summary = () => {
  const [summaryData, setSummaryData] = useState(tempSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary();

    return () => {};
  }, []);
  const getSummary = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: SUMMARY_URL,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("res::", res.data);
      const _tempData = { ...summaryData };
      Object.keys(res.data).map((item) => {
        _tempData[item].count = res.data[item];
        return null;
      });
      console.log(_tempData);
      setSummaryData(_tempData);

      // dispatch({ type: categoriesAction, payload: res.data.results });
    }
    setLoading(false);
  };
  const content = () => {
    return (
      <div className="summary-container">
        {Object.values(summaryData).map((item, index) => (
          <div key={index} className="card summaryContent">
            <div className="info">
              <div className="titl">{item.title}</div>
              <div className="count">{loading ? "..." : item.count}</div>
            </div>
            <div className="icon">{item.icon}</div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div>
      <InventoryContent type="summary" data={content} />
    </div>
  );
};

export default Summary;
