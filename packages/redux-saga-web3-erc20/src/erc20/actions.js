import { createMethodCall } from "redux-saga-web3-eth-contract";

function balanceOf(who, options = {}) {
  return createMethodCall("ERC20", "balanceOf", options)(who);
}

export { balanceOf };
