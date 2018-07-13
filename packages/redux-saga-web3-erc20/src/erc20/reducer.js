import {
  createTypesForMethodCall,
  createReducer,
} from "redux-saga-web3-eth-contract";
import { Map, fromJS } from "immutable";

import abi from "./abi";

const initialState = Map({
  contracts: Map(),
});

export default createReducer("ERC20", abi);
