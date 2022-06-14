import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../stateManagement/store";
import "../../css/inventory-css/inventory-edit.css";
import { getToken } from "../../auth/inventoryAuthController";
import {
  ALL_AVAILABLE_GROUP,
  INVENTORY_URL,
  LOCAL_CHECK,
  PHOTO_HANDLER_URL,
} from "../../urls";
import { axiosHandler, miniErrorHandler } from "../../auth/helper";
import { showInventoryMessageAction } from "../../stateManagement/actions";
import InventoryContent from "../../Components/Inventory/InventoryContent";
import { Editor } from "@tinymce/tinymce-react";

const InventoryEdit = () => {
  const {
    state: { showInventoryMessage },
    dispatch,
  } = useContext(store);
  const navigate = useNavigate();

  const params = useParams();
  const [allAvailableGroups, setAllAvailableGroups] = useState([]);
  const [inventoryData, setInventoryData] = useState({
    name: "",
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getInventoryItem();
    getAllAvailableGroups();

    return () => {};
  }, []);

  const getInventoryItem = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: `${INVENTORY_URL}/${params.slug}`,
      token,
    }).catch((e) => {
      const mini_error = miniErrorHandler(e, true);
    });
    if (res) {
      console.log("inv item res::", res.data);
      setInventoryData({
        ...res.data,
        group_id: res.data.group?.id,
        created_by_id: res.data.created_by.id,
        group: null,
        tempGroup: res.data.group,
        created_by: null,
      });

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

  const content = () => {
    return (
      <UpdateInventory
        getInventoryItem={getInventoryItem}
        setInventoryData={setInventoryData}
        navigate={navigate}
        inventoryData={inventoryData}
        allAvailableGroups={allAvailableGroups}
        dispatch={dispatch}
      />
    );
  };
  if (fetching) {
    return (
      <InventoryContent
        data={() => <div className="inv-edit">loading..</div>}
      />
    );
  }
  return <InventoryContent data={content} />;
};

export default InventoryEdit;

let img_ids = [];
let sizes = [];
let colors = [];
const UpdateInventory = (props) => {
  const [rawPhoto, setRawPhoto] = useState([]);
  const [imgIds, setImgIds] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [fieldsError, setFieldsError] = useState({});

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
    let st = [];
    console.log("sizes sec:;", props.inventoryData.sizes);
    for (var i in props.inventoryData.sizes) {
      let t = props.inventoryData.sizes[i];
      st.push(t.name);
    }
    console.log("st:::", st);
    for (var i in st) {
      addSize(st[i]);
    }

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
    let st2 = [];
    console.log("colors sec:;", props.inventoryData.colors);
    for (var i in props.inventoryData.colors) {
      let t = props.inventoryData.colors[i];
      st2.push(t.name);
    }
    for (var i in st2) {
      addColor(st2[i]);
    }
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
    console.log(imgIds);

    setFieldsError({ name: "" });

    if (props.inventoryData.photo?.length < 1) {
      if (img_ids.length < 1) {
        setFieldsError({ image: "Image is required" });
        return;
      }
    }
    if (props.inventoryData.total < 0) {
      setFieldsError({ total: "Quantity cannot be negative" });
      return;
    }
    if (props.inventoryData.remaining < 0) {
      setFieldsError({ remaining: "Remaining cannot be negative" });
      return;
    }
    const data = { ...props.inventoryData, sizes, colors };
    const token = await getToken();
    setLoadingInventory(true);
    console.log(data);
    const res = await axiosHandler({
      method: "patch",
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
    if (res) {
      console.log(res.data);
      props.setInventoryData({
        ...res.data,
        group_id: res.data.group?.id,
        created_by_id: res.data.created_by.id,
        group: null,
        tempGroup: res.data.group,
        created_by: null,
      });
      setRawPhoto([]);
      img_ids = [];
      sizes = [];
      colors = [];
      props.dispatch({
        type: showInventoryMessageAction,
        payload: { message: "Inventory item updated successfully!" },
      });
    }
    setLoadingInventory(false);
  };
  const onChangeInventoryData = (e) => {
    console.log(props.inventoryData);

    props.setInventoryData({
      ...props.inventoryData,
      [e.target.name]: e.target.value,
    });
  };
  const submitPhoto = async (e) => {
    setLoadingPhoto(true);
    e.preventDefault();
    let image = document.querySelector("#add-image");
    let img_files = image.files[0];
    console.log("img", img_files);

    let temp = [];
    const formData = new FormData();
    formData.append("image", img_files);
    temp.push(img_files);

    console.log("temp", temp);

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
      props.setInventoryData({
        ...props.inventoryData,
        img_ids,
      });
      setRawPhoto([
        ...rawPhoto,
        { img: URL.createObjectURL(e.target.files[0]), id: res.data.data },
      ]);
    }

    setLoadingPhoto(false);
  };

  const deletePhoto = async (e, id) => {
    e.preventDefault();
    if (props.inventoryData.photo.length < 2) {
      setFieldsError({
        image: "Add another image to be able to delete this one!",
      });
      return;
    }
    const token = await getToken();
    const data = { inv_id: props.inventoryData.id, photo_id: id };
    const res = await axiosHandler({
      method: "post",
      url: `${PHOTO_HANDLER_URL}`,
      data: data,
      token,
    }).catch((e) => {
      console.log("res:::", e);
      alert("Delete error! Check your internet connection");
    });
    if (res) {
      console.log("res:::", res.data);
      let photo = props.inventoryData.photo.filter((item) => item.id !== id);

      props.setInventoryData({
        ...props.inventoryData,
        photo,
      });
    }
  };

  const deleteItem = async (slug) => {
    if (!slug) return;
    if (!window.confirm("Are you sure you want to delete this item!!!?"))
      return;

    const token = await getToken();
    const result = await axiosHandler({
      method: "delete",
      url: `${INVENTORY_URL}/${slug}`,
      token,
    }).catch((e) => {
      const mini_err = miniErrorHandler(e, true);
      alert("Delete error");
    });
    if (result) {
      console.log(result);
      props.navigate(-1);
    }
  };
  return (
    <>
      <div className="inv-edit">
        <div className="add-Inventory-content">
          <div className="content">
            <div className="form-container">
              <div>
                <h2>UPDATE INVENTORY ITEM </h2>
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
                      defaultValue={props.inventoryData.name}
                      onChange={onChangeInventoryData}
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
                      defaultValue={props.inventoryData.price}
                      onChange={onChangeInventoryData}
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
                      placeholder="Slash price(Optional-Should be higher than price)"
                      name="compare_price"
                      defaultValue={props.inventoryData.compare_price}
                      onChange={onChangeInventoryData}
                    />
                  </label>
                  {fieldsError.compare_price && (
                    <li>{fieldsError.compare_price}</li>
                  )}
                </div>
                <div className="input-container">
                  <label htmlFor="total">
                    <span>Quantity:</span>
                    <input
                      type="number"
                      placeholder="Quantity"
                      name="total"
                      defaultValue={props.inventoryData.total}
                      onChange={onChangeInventoryData}
                      required
                    />
                  </label>
                  {fieldsError.total && <li>{fieldsError.total}</li>}
                </div>
                <div className="input-container">
                  <label htmlFor="remaining">
                    <span>Remaining:</span>
                    <input
                      type="number"
                      placeholder="Remaining"
                      name="remaining"
                      defaultValue={props.inventoryData.remaining}
                      onChange={onChangeInventoryData}
                      required
                    />
                  </label>
                  {fieldsError.remaining && <li>{fieldsError.remaining}</li>}
                </div>
                <div className="input-container">
                  <label htmlFor="groups" id="groups">
                    <span>Group/Category : &nbsp;</span>
                    <select name="groups">
                      {props.inventoryData.tempGroup ? (
                        <option
                          onClick={() =>
                            props.setInventoryData({
                              ...props.inventoryData,
                              group_id: props.inventoryData.tempGroup.id,
                            })
                          }
                        >
                          {props.inventoryData.tempGroup.name}
                        </option>
                      ) : null}
                      <option
                        onClick={() => {
                          props.setInventoryData({
                            ...props.inventoryData,
                            group_id: null,
                          });
                        }}
                      >
                        No Group
                      </option>
                      {props.allAvailableGroups &&
                        props.allAvailableGroups.map((item, index) => (
                          <option
                            value={item.name}
                            key={index}
                            onClick={() =>
                              props.setInventoryData({
                                ...props.inventoryData,
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

                <div className="">
                  Description:
                  <Editor
                    value={props.inventoryData.description}
                    init={{
                      height: 250,
                      // menubar: false,
                      placeholder: "Product description...",

                      plugins:
                        "lists advlist table paste image code link imagetools advcode media powerpaste codesample",
                      toolbar:
                        "undo redo  formatselect   bullist numlist outdent indent removeformat bold italic backcolor  alignleft aligncenter alignright alignjustify help",
                    }}
                    onEditorChange={(value, editor) => {
                      props.setInventoryData({
                        ...props.inventoryData,
                        description: value,
                      });
                    }}
                  />
                  <>
                    {fieldsError.description && (
                      <li>{fieldsError.description}</li>
                    )}
                  </>
                </div>

                <div className="size-wrapper">
                  <div className="spanny-div">
                    <span className="spanny">
                      If you want add a new size, write something and end it
                      with a comma. Click on a size to remove it.
                    </span>
                  </div>
                  <div className="sizes">
                    <span className="input-sizes" contentEditable></span>
                    <ul className="sizes-drop active"></ul>
                  </div>
                  <span className="spanny">
                    <span id="sizenum">10</span> &nbsp; sizes left &nbsp;
                    Current sizes:{props.inventoryData.sizes.length}
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
                      If you want add a new color, write something and end it
                      with a comma. Click on a color to remove it.
                    </span>
                  </div>
                  <div className="colors">
                    <span className="input-colors" contentEditable></span>
                    <ul className="colors-drop active"></ul>
                  </div>
                  <span className="spanny">
                    <span id="colornum">10</span> &nbsp; colors left&nbsp;
                    Current colors:{props.inventoryData.colors.length}
                  </span>
                </div>
                <div className="img-input">
                  <label htmlFor="add-image">
                    <span>
                      Add Image{" "}
                      <i className="fa fa-plus" aria-hidden="true"></i>
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
                  {rawPhoto.length > 0 && "Click update to save"}
                  <div className="">
                    {rawPhoto.length > 0 &&
                      rawPhoto.map((item, index) => {
                        return <img src={item.img} alt="img" key={index} />;
                      })}
                  </div>

                  <div className="">{loadingPhoto && "..."}</div>
                </div>
                <div className="imgs-render">
                  <p>Product Images({props.inventoryData.photo.length})</p>
                  <div className="photos">
                    {props.inventoryData.photo.length > 0 &&
                      props.inventoryData.photo.map((item, index) => (
                        <div className="" key={index}>
                          <img
                            src={LOCAL_CHECK ? item.image : item.photo}
                            alt="img"
                          />
                          <button onClick={(e) => deletePhoto(e, item.id)}>
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="button"
                  disabled={loadingInventory}
                >
                  {loadingInventory ? (
                    <span id="loadersignup"></span>
                  ) : (
                    "UPDATE"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        <hr />
        <button onClick={() => deleteItem(props.inventoryData.slug)}>
          Delete Item
        </button>
      </div>
    </>
  );
};
