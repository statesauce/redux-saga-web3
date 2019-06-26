import { createTypes } from "@statesauce/web3-eth-subscribe";

export const newBlockHeaders = createTypes("blocks", "newBlockHeaders");

export const blockHeaders = {
  GET: "BLOCKS/HEADERS/GET/REQUEST",
  SUCCESS: "BLOCKS/HEADERS/GET/SUCCESS",
  FAILURE: "BLOCKS/HEADERS/GET/FAILURE",
};
