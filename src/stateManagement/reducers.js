import {
  categoriesAction,
  removeFromCartAction,
  addToCartAction,
  userDetailAction,
  showInventoryMessageAction,
  cartMessageAction,
} from "./actions";

export const categoriesState = {
  categories: { data: [], sub_groups: [] },
};

export const cartState = {
  cart: [],
};
export const cartMessageState = {
  cartMessage: { item: {}, action: "", show: true },
};

export const userDetailState = {
  userDetail: null,
};

export const showinventoryMessageState = {
  showInventoryMessage: { message: null },
};

export const AddToCartReducer = (state, action) => {
  if (action.type === addToCartAction) {
    let newState = { ...state };
    let newItem = {};
    let newCart = [];
    // console.log("payload:::", action.payload);
    let get_existing_product = newState.cart.filter(
      (item) => item.item.id === action.payload.item.id
    );
    // console.log("existing::", get_existing_product);

    if (get_existing_product.length > 0) {
      newCart = newState.cart.filter(
        (item) => item.item.id !== action.payload.item.id
      );
      // console.log("newCart::", newCart);

      let existing = get_existing_product[0];
      let p_quantity = action.payload.quantity;
      if (!p_quantity) {
        p_quantity = existing.quantity + 1;
      }
      newItem = {
        item: action.payload.item,
        quantity: p_quantity,
      };
      let temp = [...newCart, newItem];
      newState.cart = temp.sort((a, b) => a.item.id - b.item.id);
    } else {
      let p_quantity = action.payload.quantity;
      if (!p_quantity) {
        p_quantity = 1;
      }
      newItem = {
        item: action.payload.item,
        quantity: p_quantity,
      };
      newState.cart = [...newState.cart, newItem].sort(
        (a, b) => a.item.id - b.item.id
      );
    }

    console.log("newState.cart::", newState.cart);

    return {
      ...state,
      cart: newState.cart,
      cartMessage: {
        item: action.payload.item,
        action: addToCartAction,
        show: action.payload.show,
      },
    };
  } else {
    return state;
  }
};
export const removeFromCartReducer = (state, action) => {
  if (action.type === removeFromCartAction) {
    console.log("remove from cart::", action.payload);
    let newState = { ...state };

    newState.cart = newState.cart
      .filter((item) => item.item.id !== action.payload.item.id)
      .sort((a, b) => a.item.id - b.item.id);
    return {
      ...state,
      cart: newState.cart,
      cartMessage: {
        item: action.payload.item,
        action: removeFromCartAction,
        show: action.payload.show,
      },
    };
  } else {
    return state;
  }
};

export const categoriesReducer = (state, action) => {
  if (action.type === categoriesAction) {
    return {
      ...state,
      categories: action.payload,
    };
  } else {
    return state;
  }
};

export const userDetailReducer = (state, action) => {
  if (action.type === userDetailAction) {
    return {
      ...state,
      userDetail: action.payload,
    };
  } else {
    return state;
  }
};
export const cartMessageReducer = (state, action) => {
  if (action.type === cartMessageAction) {
    console.log("cartmessage reducer::", action.payload);
    return {
      ...state,
      cartMessage: action.payload,
    };
  } else {
    return state;
  }
};

export const showInventoryMessageReducer = (state, action) => {
  if (action.type === showInventoryMessageAction) {
    return {
      ...state,
      showInventoryMessage: action.payload,
    };
  } else {
    return state;
  }
};

////////////////////////
