import {
  createMethodCall,
  createMethodSend,
} from "redux-saga-web3-eth-contract";
import { CONTRACT_NAME } from "./constants";

// Implements actions interface for ERC721: https://github.com/ethereum/eips/issues/721

// Start call methods
export function name(options = {}) {
  return createMethodCall(CONTRACT_NAME, "name", options)();
}

export function symbol(options = {}) {
  return createMethodCall(CONTRACT_NAME, "symbol", options)();
}

export function totalSupply(options = {}) {
  return createMethodCall(CONTRACT_NAME, "totalSupply", options)();
}

export function balanceOf(owner, options = {}) {
  return createMethodCall(CONTRACT_NAME, "balanceOf", options)(owner);
}

export function ownerOf(tokenId, options = {}) {
  return createMethodCall(CONTRACT_NAME, "ownerOf", options)(tokenId);
}

export function tokenOfOwnerByIndex(owner, index, options = {}) {
  return createMethodCall(CONTRACT_NAME, "tokenOfOwnerByIndex", options)(
    owner,
    index
  );
}

export function tokenMetadata(tokenId, options = {}) {
  return createMethodCall(CONTRACT_NAME, "tokenMetadata", options)(tokenId);
}
// End call methods

// Start send methods
export function transfer(to, tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "transfer", options)(to, tokenId);
}

export function approve(to, tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "approve", options)(to, tokenId);
}

export function takeOwnership(tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "takeOwnership", options)(tokenId);
}
// End send methods
