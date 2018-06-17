import {
  createMethodCall,
  createMethodSend,
} from "redux-saga-web3-eth-contract";
import { CONTRACT_NAME } from "./constants";

// Implements actions interface for ERC20: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

export function name(options = {}) {
  return createMethodCall(CONTRACT_NAME, "name", options)();
}

export function symbol(options = {}) {
  return createMethodCall(CONTRACT_NAME, "symbol", options)();
}

export function totalSupply(who, options = {}) {
  return createMethodCall(CONTRACT_NAME, "totalSupply", options)(who);
}

export function balanceOf(owner, options = {}) {
  return createMethodCall(CONTRACT_NAME, "balanceOf", options)(owner);
}

export function allowance(owner, spender, options = {}) {
  return createMethodCall(CONTRACT_NAME, "allowance", options)(owner, spender);
}

export function transfer(to, tokens, options = {}) {
  return createMethodCall(CONTRACT_NAME, "transfer", options)(to, tokens);
}

export function approve(spender, tokens, options = {}) {
  return createMethodCall(CONTRACT_NAME, "approve", options)(spender, tokens);
}

export function transferFrom(from, to, tokens, options = {}) {
  return createMethodCall(CONTRACT_NAME, "transferFrom", options)(from, to, tokens);
}

export { balanceOf };
