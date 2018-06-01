import {
  createEventSubscription,
  getPastEvents,
  createMethodCall,
  createMethodSend,
} from "redux-saga-web3-eth-contract";

function balanceOf(who, options = {}) {
  createMethodCall("ERC20", "balanceOf", options)(who);
}

export { balanceOf };
