import React, { useState, useEffect, useContext } from "react";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import {
  ALL_AVAILABLE_GROUP,
  ALL_AVAILABLE_Inventory,
  GROUP_URL,
  INVENTORY_URL,
  LOCAL_CHECK,
  PHOTO_HANDLER_URL,
} from "../../urls";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import { store } from "../../stateManagement/store";
import "../../css/inventory-css/inventories.css";
import { getToken } from "../../auth/inventoryAuthController";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Editor } from "@tinymce/tinymce-react";

let img_ids = [];
const Inventories = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();
  const params = useParams();
  const [inventories, setInventories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const [allAvailableGroups, setAllAvailableGroups] = useState([]);
  const [addInventory, setAddInventory] = useState(false);

  const state = useLocation();
  console.log(state);

  useEffect(() => {
    getInventories();

    return () => {};
  }, [state, search]);
  useEffect(() => {
    getAllAvailableGroups();

    return () => {};
  }, [state]);

  const getInventories = async () => {
    setLoading(true);
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${INVENTORY_URL}${state.search}${
        state.search ? "&" : "?"
      }keyword=${search}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
      setError(true);
    });
    if (res) {
      console.log("inventories res::", res.data);
      setPagination(res.data);
      const data = res.data.results.map((item) => ({
        ...item,
        groupInfo: item.group?.name,
        photoInfo: item.photo,
      }));
      console.log("data::", data);
      setInventories(data);
      setError(false);
    }
    setLoading(false);
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

  const content = () => {
    return (
      <div className="inv-products">
        {addInventory ? (
          <CreateInventory
            setAddInventory={setAddInventory}
            // fieldsError={fieldsError}
            // submitAddInventory={submitAddInventory}
            // onChangeAddInventoryData={onChangeAddInventoryData}
            // addInventoryData={addInventoryData}
            // setAddInventoryData={setAddInventoryData}
            allAvailableGroups={allAvailableGroups}
            // submitPhoto={submitPhoto}
            // loadingPhoto={loadingPhoto}
            // rawPhoto={rawPhoto}
            // loadingAddInventory={loadingAddInventory}
            dispatch={dispatch}
            getInventories={getInventories}
          />
        ) : (
          <div className="inv-products-cont">
            <div className="top">
              <div>Inventories</div>
              <div className="search-and-add">
                <div className="search">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button onClick={() => getInventories()}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="add">
                  <button onClick={() => setAddInventory(true)}>
                    Add Inventory
                  </button>
                </div>
              </div>
            </div>
            <div className="items g">
              <div className="code bold">Code</div>
              <div className="photo bold">Photo</div>
              <div className="name bold">Name</div>
              <div className="category bold">Category</div>
              <div className="price bold">Price</div>
              <div className="compare-price bold">Comp. Price</div>
              <div className="total bold">Total</div>
              <div className="remaining bold">Remaining</div>
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
                      {inventories.map((item, index) => {
                        return (
                          <div
                            className="items"
                            key={index}
                            onClick={() =>
                              navigate(`/inventory-edit/${item.slug}`)
                            }
                          >
                            <div className="code">{item.code}</div>
                            <div className="photo ">
                              {LOCAL_CHECK ? (
                                <img
                                  src={item.photo[0]?.image}
                                  alt={item.name}
                                />
                              ) : (
                                <img
                                  src={item.photo[0]?.photo}
                                  alt={item.name}
                                />
                              )}
                            </div>
                            <div className="name">{item.name}</div>
                            <div className="category">{item.group?.name}</div>
                            <div className="price">{item.price}</div>
                            <div className="compare-price">
                              <del>
                                {Number(item.compare_price) === 0.0
                                  ? ""
                                  : item.compare_price}
                              </del>
                            </div>
                            <div className="total">{item.total}</div>
                            <div className="remaining">{item.remaining}</div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </>
            <Paginate
              navigate={navigate}
              pagination={pagination}
              state={state}
              name={"inventories"}
            />
          </div>
        )}
      </div>
    );
  };
  return <InventoryContent data={content} />;
};

export default Inventories;

export const Paginate = (props) => {
  let currentPage = 1;
  try {
    currentPage = props.state.search;
    currentPage = Number(currentPage.substring(6));
    // console.log("ccc--", currentPage);
  } catch (error) {
    currentPage = 1;
  }
  return (
    <>
      {props.pagination?.count && (
        <ReactPaginate
          pageCount={Math.ceil(props.pagination.count / 4)}
          pageRangeDisplayed={7}
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          onPageChange={(e) =>
            // dispatch({
            //   type: currentPageMovieAction,
            //   payload: e.selected + 1,
            // })

            props.navigate({
              pathname: `/inventory/${props.name}`,
              search: `page=${e.selected + 1}`,
            })
          }
          marginPagesDisplayed={1}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          containerClassName={"pagination"}
          activeClassName={"active"}
          // subContainerClassName={'pages pagination'}
          forcePage={currentPage - 1}
        />
      )}
    </>
  );
};
let sizes = [];
let colors = [];
const CreateInventory = (props) => {
  const [addInventoryData, setAddInventoryData] = useState({
    name: "",
    group_id: null,
  });
  const [rawPhoto, setRawPhoto] = useState([]);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [fieldsError, setFieldsError] = useState({});
  const [loadingAddInventory, setLoadingAddInventory] = useState(false);

  useEffect(() => {
    const keywords = ["S", "M", "L", "XL", "XXL", "XXXL"];

    const inputSizes = document.querySelector(".input-sizes");

    const sizesContainer = document.querySelector(".sizes");
    const sizesDrop = document.querySelector(".sizes-drop");
    const tagnum = document.querySelector("#sizenum");
    function input_input_sizes(e) {
      if (sizes.length >= 10) return;
      const newSize = sanitizeNewColor(inputSizes.textContent);
      popupList(inputSizes.textContent);

      if (!newSize) return;

      addSize(newSize);
      inputSizes.textContent = "";
    }
    inputSizes.addEventListener("input", input_input_sizes);

    function click_sizes_container(e) {
      if (!e.target.matches(".size")) {
        return;
      }
      e.target.remove();

      sizes = sizes.filter(
        (size) => size !== e.target.textContent.slice(0, -2).trim()
      );
      tagnum.textContent = 10 - sizes.length;

      console.log("sizes remove::", sizes);
    }
    sizesContainer.addEventListener("click", click_sizes_container);

    const sanitizeNewColor = (newSize) => {
      const lastChar = newSize.slice(-1);
      const size = newSize.slice(0, -1).trim().toLowerCase();
      return lastChar === "," && size !== "" ? size : false;
    };

    const addSize = (sizeToAdd) => {
      if (sizes.includes(sizeToAdd)) return;

      const size = document.createElement("SPAN");
      size.setAttribute("class", "size");

      size.innerHTML = `${sizeToAdd}  &times;`;

      sizes.push(sizeToAdd);
      console.log("add sizes::", sizes);

      inputSizes.insertAdjacentElement("beforebegin", size);
      tagnum.textContent = 10 - sizes.length;
    };

    const popupList = (sizeToCheck) => {
      sizesDrop.innerHTML = "";
      if (inputSizes.textContent.trim() === "") return;
      const keywordsFiltered = keywords.filter((keyword) =>
        keyword.toLowerCase().includes(sizeToCheck.toLowerCase())
      );

      if (keywordsFiltered.length === 0) return;
      console.log(keywordsFiltered);
      // console.log("typing");
      const fragment = document.createDocumentFragment();
      keywordsFiltered.forEach((keyword) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "sizes-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = keyword;
        fragment.appendChild(li);
      });
      sizesDrop.appendChild(fragment);
    };
    function click_size_drop(e) {
      if (!e.target.matches(".sizes-drop__item")) return;
      addSize(e.target.textContent);
      inputSizes.textContent = "";
      sizesDrop.innerHTML = "";
      inputSizes.focus();
    }
    sizesDrop.addEventListener("click", click_size_drop);
    function keypress_size_drop(e) {
      if (!e.code === "Enter") return;
      addSize(e.target.textContent);
      inputSizes.textContent = "";
      sizesDrop.innerHTML = "";
      inputSizes.focus();
    }
    sizesDrop.addEventListener("keypress", keypress_size_drop);

    inputSizes.addEventListener("dblclick", (e) => {
      const fragment = document.createDocumentFragment();
      keywords.forEach((keyword) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "sizes-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = keyword;
        fragment.appendChild(li);
      });
      sizesDrop.appendChild(fragment);
    });
    document.addEventListener("keyup", (e) => {
      if (!e.code !== "Escape") return;
    });
    return () => {
      ///////////// return
      inputSizes.removeEventListener("input", input_input_sizes);
      sizesContainer.removeEventListener("click", click_sizes_container);
      sizesDrop.removeEventListener("click", click_size_drop);
      sizesDrop.removeEventListener("keypress", keypress_size_drop);
      document.removeEventListener("keyup", (e) => {
        if (!e.code !== "Escape") return;
      });
    };
  }, []);

  useEffect(() => {
    const keywords = [
      "Red",
      "Orange",
      "Yellow",
      "Greeen",
      "Blue",
      "Indigo",
      "Violet",
      "Black",
      "White",
    ];

    const inputColors = document.querySelector(".input-colors");

    const colorsContainer = document.querySelector(".colors");
    const colorsDrop = document.querySelector(".colors-drop");
    const colornum = document.querySelector("#colornum");
    function input_input_colors(e) {
      if (colors.length >= 10) return;
      const newColor = sanitizeNewColor(inputColors.textContent);
      popupList(inputColors.textContent);

      if (!newColor) return;

      addColor(newColor);
      inputColors.textContent = "";
    }
    inputColors.addEventListener("input", input_input_colors);

    function click_colors_container(e) {
      if (!e.target.matches(".color")) {
        return;
      }
      e.target.remove();

      colors = colors.filter(
        (color) => color !== e.target.textContent.slice(0, -2).trim()
      );
      colornum.textContent = 10 - colors.length;

      console.log("colors remove::", colors);
    }
    colorsContainer.addEventListener("click", click_colors_container);

    const sanitizeNewColor = (newColor) => {
      const lastChar = newColor.slice(-1);
      const color = newColor.slice(0, -1).trim().toLowerCase();
      return lastChar === "," && color !== "" ? color : false;
    };

    const addColor = (colorToAdd) => {
      if (colors.includes(colorToAdd)) return;

      const color = document.createElement("SPAN");
      color.setAttribute("class", "color");

      color.innerHTML = `${colorToAdd}  &times;`;

      colors.push(colorToAdd);
      console.log("add colors::", colors);

      inputColors.insertAdjacentElement("beforebegin", color);
      colornum.textContent = 10 - colors.length;
    };

    const popupList = (colorToCheck) => {
      colorsDrop.innerHTML = "";
      if (inputColors.textContent.trim() === "") return;
      const keywordsFiltered = keywords.filter((keyword) =>
        keyword.toLowerCase().includes(colorToCheck.toLowerCase())
      );

      if (keywordsFiltered.length === 0) return;
      console.log(keywordsFiltered);
      // console.log("typing");
      const fragment = document.createDocumentFragment();
      keywordsFiltered.forEach((keyword) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "colors-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = keyword;
        fragment.appendChild(li);
      });
      colorsDrop.appendChild(fragment);
    };
    function click_color_drop(e) {
      if (!e.target.matches(".colors-drop__item")) return;
      addColor(e.target.textContent);
      inputColors.textContent = "";
      colorsDrop.innerHTML = "";
      inputColors.focus();
    }
    colorsDrop.addEventListener("click", click_color_drop);
    function keypress_color_drop(e) {
      if (!e.code === "Enter") return;
      addColor(e.target.textContent);
      inputColors.textContent = "";
      colorsDrop.innerHTML = "";
      inputColors.focus();
    }
    colorsDrop.addEventListener("keypress", keypress_color_drop);

    inputColors.addEventListener("dblclick", (e) => {
      const fragment = document.createDocumentFragment();
      keywords.forEach((keyword) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "colors-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = keyword;
        fragment.appendChild(li);
      });
      colorsDrop.appendChild(fragment);
    });
    document.addEventListener("keyup", (e) => {
      if (!e.code !== "Escape") return;
    });
    return () => {
      ///////////// return
      inputColors.removeEventListener("input", input_input_colors);
      colorsContainer.removeEventListener("click", click_colors_container);
      colorsDrop.removeEventListener("click", click_color_drop);
      colorsDrop.removeEventListener("keypress", keypress_color_drop);
      document.removeEventListener("keyup", (e) => {
        if (!e.code !== "Escape") return;
      });
    };
  }, []);

  const submitAddInventory = async () => {
    console.log("sizes::", sizes);
    console.log("colors::", colors);

    setFieldsError({ name: "" });
    if (img_ids.length < 1) {
      setFieldsError({ image: "Image is required" });
      return;
    }
    if (addInventoryData.total < 0) {
      setFieldsError({ total: "Total cannot be negative" });
      return;
    }

    const token = await getToken();
    setLoadingAddInventory(true);

    const data = { ...addInventoryData, sizes, colors };
    // console.log(addInventoryData);
    console.log(data);

    // return;
    const result = await axiosHandler({
      method: "post",
      url: INVENTORY_URL,
      data: data,
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
      props.dispatch({
        type: showInventoryMessageAction,
        payload: { message: "Item created successfully!" },
      });
      setRawPhoto([]);
      img_ids = [];
      sizes = [];
      colors = [];
      props.setAddInventory(false);
      setAddInventoryData({});
      props.getInventories();
    }
    setLoadingAddInventory(false);
  };
  const onChangeAddInventoryData = (e) => {
    console.log(addInventoryData);
    setAddInventoryData({
      ...addInventoryData,
      [e.target.name]: e.target.value,
    });
  };
  const submitPhoto = async (e) => {
    setLoadingPhoto(true);
    e.preventDefault();
    let image = document.querySelector("#add-image");
    let img_files = image.files[0];

    const formData = new FormData();
    formData.append("image", img_files);

    const token = await getToken();

    const res = await axiosHandler({
      method: "post",
      url: PHOTO_HANDLER_URL,
      data: formData,
      token,
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((e) => {
      console.log("res:::", e);
      alert("Upload error! Check your internet connection");
    });
    if (res) {
      console.log("res:::", res.data);
      img_ids = [...img_ids, res.data.data];
      setAddInventoryData({
        ...addInventoryData,
        img_ids,
      });
      setRawPhoto([
        ...rawPhoto,
        { img: URL.createObjectURL(e.target.files[0]), id: res.data.data },
      ]);
    }

    setLoadingPhoto(false);
  };
  return (
    <div className="add-Inventory-content">
      <button
        className=""
        onClick={() => {
          props.setAddInventory(false);
          img_ids = [];
        }}
      >
        <i className="fa fa-close" aria-hidden="true"></i>
      </button>
      <div className="content">
        <div className="form-container">
          <div>
            <h2>ADD INVENTORY </h2>
            {fieldsError.error && (
              <div className="err">
                <div className="error-div"> {fieldsError.error}</div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitAddInventory();
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
                  defaultValue={addInventoryData.name}
                  onChange={onChangeAddInventoryData}
                  required
                />
              </label>
              {fieldsError.name && <li>{fieldsError.name}</li>}
            </div>
            <div className="input-container">
              <label htmlFor="price">
                <span>Price:</span>
                <input
                  type="text"
                  placeholder="Individual price"
                  name="price"
                  defaultValue={addInventoryData.price}
                  onChange={onChangeAddInventoryData}
                  required
                />
              </label>
              {fieldsError.price && <li>{fieldsError.price}</li>}
            </div>
            <div className="input-container">
              <label htmlFor="compare_price">
                <span>Compare Price:</span>
                <input
                  type="text"
                  placeholder="(Optional-Should be higher than price)"
                  name="compare_price"
                  defaultValue={addInventoryData.compare_price}
                  onChange={onChangeAddInventoryData}
                />
              </label>
              {fieldsError.compare_price && (
                <li>{fieldsError.compare_price}</li>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="total">
                <span>Total:</span>
                <input
                  type="number"
                  placeholder="Quantity"
                  name="total"
                  defaultValue={addInventoryData.total}
                  onChange={onChangeAddInventoryData}
                  required
                />
              </label>
              {fieldsError.total && <li>{fieldsError.total}</li>}
            </div>

            <div className="input-container">
              <label htmlFor="Inventorys" id="Inventorys">
                <span> Group/Category : &nbsp;</span>

                <select name="Inventorys">
                  <option
                    onClick={() =>
                      setAddInventoryData({
                        ...addInventoryData,
                        group_id: null,
                      })
                    }
                  >
                    Select Group
                  </option>

                  {props.allAvailableGroups &&
                    props.allAvailableGroups.map((item, index) => (
                      <option
                        value={item.name}
                        key={index}
                        onClick={() =>
                          setAddInventoryData({
                            ...addInventoryData,
                            group_id: item.id,
                          })
                        }
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
              </label>
              {fieldsError.belongs_to && <li>{fieldsError.belongs_to}</li>}
            </div>
            <div className="">Description:
              <Editor
                value={addInventoryData.description}
                init={{
                  height: 250,
                  // menubar: false,
                  placeholder:"Product description...",
                  plugins:
                    "lists advlist table paste image code link imagetools advcode media powerpaste codesample",
                  toolbar:
                    "undo redo  formatselect   bullist numlist outdent indent removeformat bold italic backcolor  alignleft aligncenter alignright alignjustify help",
                }}
                onEditorChange={(value, editor) => {
                  setAddInventoryData({
                   ...addInventoryData,
                    description: value,
                  });
                }}
              />
              <>
                {fieldsError.description && <li>{fieldsError.description}</li>}
              </>
            </div>
            <div
              className="size-wrapper"
              onMouseOver={() => {
                let qs = document.querySelector(".input-sizes");
                qs.focus();
              }}
            >
              <div className="spanny-div">
                <span className="spanny">
                  If you want add a new size, write something and end it with a
                  comma. Click on a size to remove it.
                </span>
              </div>
              <div className="sizes">
                <span className="input-sizes" contentEditable></span>
                <ul className="sizes-drop active"></ul>
              </div>
              <span className="spanny">
                <span id="sizenum">10</span> &nbsp; sizes left
              </span>
            </div>
            <div
              className="color-wrapper"
              onMouseOver={() => {
                let qs = document.querySelector(".input-colors");
                qs.focus();
              }}
            >
              <div className="spanny-div">
                <span className="spanny">
                  If you want add a new color, write something and end it with a
                  comma. Click on a color to remove it.
                </span>
              </div>
              <div className="colors">
                <span className="input-colors" contentEditable></span>
                <ul className="colors-drop active"></ul>
              </div>
              <span className="spanny">
                <span id="colornum">10</span> &nbsp; colors left
              </span>
            </div>
            <div className="img-input">
              <label htmlFor="add-image">
                <span>
                  Add Image <i className="fa fa-plus" aria-hidden="true"></i>
                  <span id="num"></span>
                </span>
                <input
                  type="file"
                  placeholder="select photo"
                  name="photo"
                  id="add-image"
                  accept="image"
                  onChange={(e) => {
                    submitPhoto(e);
                  }}
                />
              </label>
              {fieldsError.image && <li>{fieldsError.image}</li>}
            </div>
            <div className="imgs-raw">
              <div className="">
                {rawPhoto.length > 0 &&
                  rawPhoto.map((item, index) => {
                    return <img src={item.img} alt="img" key={index} />;
                  })}
              </div>

              <div className="">{loadingPhoto && "..."}</div>
            </div>

            <button
              type="submit"
              className="button"
              disabled={loadingAddInventory}
            >
              {loadingAddInventory ? <span id="loadersignup"></span> : "CREATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
