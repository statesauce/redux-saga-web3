import Web3EthContract from "web3-eth-contract";
import { createSaga } from "redux-saga-web3-eth-contract";

import { CONTRACT_NAME } from "./constants";
import abi from "./abi";

export default (provider, options = {}) => {
  Web3EthContract.setProvider(provider);
  const contract = new Web3EthContract(abi, options.at);
  return createSaga(CONTRACT_NAME, contract);
};
