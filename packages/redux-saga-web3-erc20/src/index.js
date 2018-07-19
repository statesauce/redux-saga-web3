import ReduxSagaWeb3EthContract from "redux-saga-web3-eth-contract";

import abi from "./abi";

class ReduxSagaWeb3ERC20 extends ReduxSagaWeb3EthContract {
  constructor(address) {
    super("ERC20", abi, address);
  }
}

export default ReduxSagaWeb3ERC20;
