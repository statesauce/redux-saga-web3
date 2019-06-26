import {
  createActionForMethodCall,
  createActionForMethodSend,
} from "@statesauce/web3-eth-contract";
import { CONTRACT_NAME } from "./constants";

// Implements actions interface for ERC721: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md

// Start call methods
export function name(options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "name", options, meta)();
}

export function symbol(options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "symbol", options, meta)();
}

export function totalSupply(options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "totalSupply", options, meta)();
}

export function balanceOf(owner, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "balanceOf", options, meta)(owner);
}

export function ownerOf(tokenId, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "ownerOf", options, meta)(tokenId);
}

export function exists(tokenId, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "exists", options, meta)(tokenId);
}

export function tokenURI(tokenId, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "tokenURI", options, meta)(tokenId);
}

export function tokenByIndex(index, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "tokenByIndex", options, meta)(index);
}

export function tokenOfOwnerByIndex(owner, index, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "tokenOfOwnerByIndex", options, meta)(
    owner,
    index
  );
}

export function getApproved(tokenId, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "getApproved", options, meta)(tokenId);
}

export function isApprovedForAll(owner, operator, options = {}, meta = {}) {
  return createActionForMethodCall(CONTRACT_NAME, "isApprovedForAll", options, meta)(
    owner,
    operator
  );
}
// End call methods

// Start send methods
export function transferFrom(from, to, tokenId, options = {}, meta = {}) {
  return createActionForMethodSend(CONTRACT_NAME, "transferFrom", options, meta)(
    from,
    to,
    tokenId
  );
}

export function safeTransferFrom(from, to, tokenId, options = {}, meta = {}) {
  return createActionForMethodSend(CONTRACT_NAME, "safeTransferFrom", options, meta)(
    from,
    to,
    tokenId
  );
}

export function approve(to, tokenId, options = {}, meta = {}) {
  return createActionForMethodSend(CONTRACT_NAME, "approve", options, meta)(to, tokenId);
}

export function setApprovalForAll(operator, approved, options = {}, meta = {}) {
  return createActionForMethodSend(CONTRACT_NAME, "setApprovalForAll", options, meta)(
    operator,
    approved
  );
}

export function takeOwnership(tokenId, options = {}, meta = {}) {
  return createActionForMethodSend(CONTRACT_NAME, "takeOwnership", options, meta)(
    tokenId
  );
}
// End send methods
