import React, { createContext, useReducer } from "react";
import {
  categoriesState,
  categoriesReducer,
  AddToCartReducer,
  cartState,
  removeFromCartReducer,
  userDetailReducer,
  userDetailState,
  cartMessageState,
  cartMessageReducer,
  showInventoryMessageReducer,
  showinventoryMessageState,
} from "./reducers";

const reduceReducers =
  (...reducers) =>
  (prevState, value, ...args) => {
    return reducers.reduce(
      (newState, reducer) => reducer(newState, value, ...args),
      prevState
    );
  };

const combinedReducers = reduceReducers(
  categoriesReducer,
  AddToCartReducer,
  removeFromCartReducer,
  userDetailReducer,
  cartMessageReducer,
  showInventoryMessageReducer
);

const initialState = {
  ...categoriesState,
  ...cartState,
  ...cartMessageState,
  ...userDetailState,
  ...showinventoryMessageState,
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
