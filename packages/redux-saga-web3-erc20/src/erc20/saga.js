import { createSaga } from "redux-saga-web3-eth-contract";
import abi from "./abi";

export default createSaga("ERC20", abi);
