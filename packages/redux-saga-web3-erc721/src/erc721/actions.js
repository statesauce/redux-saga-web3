import {
  createMethodCall,
  createMethodSend,
} from "redux-saga-web3-eth-contract";
import { CONTRACT_NAME } from "./constants";

// Implements actions interface for ERC721: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md

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

export function exists(tokenId, options = {}) {
  return createMethodCall(CONTRACT_NAME, "exists", options)(tokenId);
}

export function tokenURI(tokenId, options = {}) {
  return createMethodCall(CONTRACT_NAME, "tokenURI", options)(tokenId);
}

export function tokenByIndex(index, options = {}) {
  return createMethodCall(CONTRACT_NAME, "tokenByIndex", options)(index);
}

export function tokenOfOwnerByIndex(owner, index, options = {}) {
  return createMethodCall(CONTRACT_NAME, "tokenOfOwnerByIndex", options)(
    owner,
    index
  );
}

export function getApproved(tokenId, options = {}) {
  return createMethodCall(CONTRACT_NAME, "getApproved", options)(tokenId);
}

export function isApprovedForAll(owner, operator, options = {}) {
  return createMethodCall(CONTRACT_NAME, "isApprovedForAll", options)(
    owner,
    operator
  );
}
// End call methods

// Start send methods
export function transferFrom(from, to, tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "transferFrom", options)(
    from,
    to,
    tokenId
  );
}

export function safeTransferFrom(from, to, tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "safeTransferFrom", options)(
    from,
    to,
    tokenId
  );
}

export function approve(to, tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "approve", options)(to, tokenId);
}

export function setApprovalForAll(operator, approved, options = {}) {
  return createMethodSend(CONTRACT_NAME, "setApprovalForAll", options)(
    operator,
    approved
  );
}

export function takeOwnership(tokenId, options = {}) {
  return createMethodSend(CONTRACT_NAME, "takeOwnership", options)(tokenId);
}
// End send methods
