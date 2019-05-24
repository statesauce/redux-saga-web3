import * as types from "./types";

export const blocksActions = {
  getFailure: error => ({
    type: types.blockHeaders.FAILURE,
    payload: error,
    error: true,
  }),
  getSuccess: (number, hash) => ({
    type: types.blockHeaders.SUCCESS,
    payload: number,
    meta: {
      blockHashOrBlockNumber: hash,
    },
  }),
};

function getBlockHeader(blockHashOrBlockNumber) {
  return {
    type: types.blockHeaders.GET,
    payload: { hash: blockHashOrBlockNumber },
  };
}

/* 
 Object - The subscription options

  fromBlock - Number: The number of the earliest block. By default null.
  address - String|Array: An address or a list of addresses to only get logs from particular account(s).
  topics - Array: An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
 */

function subscribeNewHeaders(options = {}) {
  return {
    type: types.newBlockHeaders.SUBSCRIBE,
    payload: { options },
  };
}

export default {
  getBlockHeader,
  subscribeNewHeaders,
};
