// let sizes = [];
// const sizeFunc = () => {
//     const keywords = [
//       "XL",
//       "XXL",
//       "XXXL",
//       "Large",
//       "Small",
//       "Medium",

//     ];
//     const inputSizes = document.querySelector(".input-sizes");
//     const sizesContainer = document.querySelector(".sizes");
//     const sizesDrop = document.querySelector(".sizes-drop");
//     // const tagListItems = document.querySelectorAll(".sizes-drop__item");
//     // let usersList = [...tagListItems].map((user) => user.textContent);
//     const tagnum = document.querySelector("#sizenum");
//     inputSizes.addEventListener("input", (e) => {
//       if (sizes.length >= 10) return;
//       const newSize = sanitizeNewTag(inputSizes.textContent);
//       popupList(inputSizes.textContent);

//       if (!newSize) return;

//       addSize(newSize);
//       inputSizes.textContent = "";
//     });

//     sizesContainer.addEventListener("click", (e) => {
//       if (!e.target.matches(".size")) {
//         return;
//       }
//       e.target.remove();
//       sizes = sizes.filter((size) => size !== e.target.textContent.slice(0, -2));
//       tagnum.textContent = 10 - sizes.length;

//       console.log("removed sizes::", sizes);
//     });

//     const sanitizeNewTag = (newSize) => {
//       const lastChar = newSize.slice(-1);
//       const size = newSize.slice(0, -1).trim().toLowerCase();
//       return lastChar === "," && size !== "" ? size : false;
//     };

//     const addSize = (sizeToAdd) => {
//       if (sizes.includes(sizeToAdd)) return;

//       const size = document.createElement("SPAN");
//       size.setAttribute("class", "size");

//       size.innerHTML = `#${sizeToAdd}  &times;`;

//       sizes.push(sizeToAdd);
//       inputSizes.insertAdjacentElement("beforebegin", size);
//       tagnum.textContent = 10 - sizes.length;
//     };

//     const popupList = (tagToCheck) => {
//       sizesDrop.innerHTML = "";
//       if (inputSizes.textContent.trim() === "") return;
//       const keywordsFiltered = keywords.filter((keyword) =>
//         keyword.toLowerCase().includes(tagToCheck.toLowerCase())
//       );

//       if (keywordsFiltered.length === 0) return;
//       console.log(keywordsFiltered);
//       console.log("typing");
//       const fragment = document.createDocumentFragment();
//       keywordsFiltered.forEach((keyword) => {
//         const li = document.createElement("LI");
//         li.setAttribute("class", "sizes-drop__item");
//         li.setAttribute("tabindex", "0");
//         li.textContent = keyword;
//         fragment.appendChild(li);
//       });
//       sizesDrop.appendChild(fragment);
//     };

//     sizesDrop.addEventListener("click", (e) => {
//       if (!e.target.matches(".sizes-drop__item")) return;
//       addSize(e.target.textContent);
//       inputSizes.textContent = "";
//       sizesDrop.innerHTML = "";
//       inputSizes.focus();
//     });
//     sizesDrop.addEventListener("keypress", (e) => {
//       if (!e.code === "Enter") return;
//       addSize(e.target.textContent);
//       inputSizes.textContent = "";
//       sizesDrop.innerHTML = "";
//       inputSizes.focus();
//     });

//     inputSizes.addEventListener("dblclick", (e) => {
//       const fragment = document.createDocumentFragment();
//       keywords.forEach((keyword) => {
//         const li = document.createElement("LI");
//         li.setAttribute("class", "sizes-drop__item");
//         li.setAttribute("tabindex", "0");
//         li.textContent = keyword;
//         fragment.appendChild(li);
//       });
//       sizesDrop.appendChild(fragment);
//     });
//     document.addEventListener("keyup", (e) => {
//       if (!e.code !== "Escape") return;
//       console.log("pl");
//     });
//   };

// const removesize=()=>{

//     inputSizes.removeEventListener("input", (e) => {
//       if (sizes.length >= 10) return;
//       const newSize = sanitizeNewTag(inputSizes.textContent);
//       popupList(inputSizes.textContent);

//       if (!newSize) return;

//       addSize(newSize);
//       inputSizes.textContent = "";
//     });

//     sizesContainer.removeEventListener("click", (e) => {
//       if (!e.target.matches(".size")) {
//         //inputSizes.textContent = '';
//         return;
//       }
//       e.target.remove();
//       sizes = sizes.filter((size) => size !== e.target.textContent.slice(0, -2));
//       tagnum.textContent = 10 - sizes.length;

//       console.log("removed sizes::", sizes);
//     });

//     const sanitizeNewTag = (newSize) => {
//       const lastChar = newSize.slice(-1);
//       const size = newSize.slice(0, -1).trim().toLowerCase();
//       return lastChar === "," && size !== "" ? size : false;
//     };

//     const addSize = (sizeToAdd) => {
//       if (sizes.includes(sizeToAdd)) return;

//       const size = document.createElement("SPAN");
//       size.setAttribute("class", "size");

//       size.innerHTML = `#${sizeToAdd}  &times;`;

//       sizes.push(sizeToAdd);
//       inputSizes.insertAdjacentElement("beforebegin", size);
//       tagnum.textContent = 10 - sizes.length;
//     };

//     const popupList = (tagToCheck) => {
//       sizesDrop.innerHTML = "";
//       if (inputSizes.textContent.trim() === "") return;
//       const keywordsFiltered = keywords.filter((keyword) =>
//         keyword.toLowerCase().includes(tagToCheck.toLowerCase())
//       );

//       if (keywordsFiltered.length === 0) return;
//       console.log(keywordsFiltered);
//       console.log("typing");
//       const fragment = document.createDocumentFragment();
//       keywordsFiltered.forEach((keyword) => {
//         const li = document.createElement("LI");
//         li.setAttribute("class", "sizes-drop__item");
//         li.setAttribute("tabindex", "0");
//         li.textContent = keyword;
//         fragment.appendChild(li);
//       });
//       sizesDrop.appendChild(fragment);
//     };

//     sizesDrop.removeEventListener("click", (e) => {
//       if (!e.target.matches(".sizes-drop__item")) return;
//       addSize(e.target.textContent);
//       inputSizes.textContent = "";
//       sizesDrop.innerHTML = "";
//       inputSizes.focus();
//     });
//     sizesDrop.removeEventListener("keypress", (e) => {
//       if (!e.code === "Enter") return;
//       addSize(e.target.textContent);
//       inputSizes.textContent = "";
//       sizesDrop.innerHTML = "";
//       inputSizes.focus();
//     });

//     inputSizes.removeEventListener("dblclick", (e) => {
//       const fragment = document.createDocumentFragment();
//       keywords.forEach((keyword) => {
//         const li = document.createElement("LI");
//         li.setAttribute("class", "sizes-drop__item");
//         li.setAttribute("tabindex", "0");
//         li.textContent = keyword;
//         fragment.appendChild(li);
//       });
//       sizesDrop.appendChild(fragment);
//     });
//     document.removeEventListener("keyup", (e) => {
//       if (!e.code !== "Escape") return;
//       console.log("pl");
//     });
//   };

//   const g=()=>{
//       return(        <div
//         className="size-wrapper"
//         onMouseOver={() => {
//           let qs = document.querySelector(".input-sizes");
//           qs.focus();
//         }}
//       >
//         <div className="spanny-div">
//           <span className="spanny">
//             If you want add a new hashtag, write something and end it with a
//             comma. Click on a hashtag to remove it.
//           </span>
//         </div>
//         <div className="sizes">
//           <span className="input-sizes" contentEditable></span>
//           <ul className="sizes-drop active"></ul>
//         </div>
//         <span className="spanny">
//           <span id="sizenum">10</span> &nbsp; hashsizes left
//         </span>
//       </div>)
//   }
