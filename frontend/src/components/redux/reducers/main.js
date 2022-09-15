import { getProductsreducer } from "./Productreducer";
import { combineReducers } from "redux";

const rootreducers = combineReducers({
  getproductsdata: getProductsreducer,
});

export default rootreducers;
