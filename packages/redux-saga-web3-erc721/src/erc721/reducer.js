import {createTypesForMethodCall, createTypesForMethodSend} from "redux-saga-web3-eth-contract";
import {CONTRACT_NAME} from "./constants";

const initialState = {
  contracts: {}
};

const NAME = createTypesForMethodCall(CONTRACT_NAME, "name");
const SYMBOL = createTypesForMethodCall(CONTRACT_NAME, "symbol");
const TOTAL_SUPPLY = createTypesForMethodCall(CONTRACT_NAME, "totalSupply");
const BALANCE_OF = createTypesForMethodCall(CONTRACT_NAME, "balanceOf");
const OWNER_OF = createTypesForMethodCall(CONTRACT_NAME, "ownerOf");
const TOKEN_OF_OWNER_BY_INDEX = createTypesForMethodCall(CONTRACT_NAME, "tokenOfOwnerByIndex");

const TRANSFER = createTypesForMethodSend(CONTRACT_NAME, "transfer");
const APPROVE = createTypesForMethodSend(CONTRACT_NAME, "approve");
const TAKE_OWNERSHIP = createTypesForMethodSend(CONTRACT_NAME, "takeOwnership");

export default(state = initialState, {type, meta, payload}) => {
  switch (type) {
    case NAME.CALL:
      {
        const {options: {
            at
          }} = payload;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              name: {
                isLoading: true,
                value: null
              }
            }
          }
        }
      }
    case NAME.SUCCESS:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              name: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case NAME.ERROR:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              name: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case SYMBOL.CALL:
      {
        const {options: {
            at
          }} = payload;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              symbol: {
                isLoading: true,
                value: null
              }
            }
          }
        }
      }
    case SYMBOL.SUCCESS:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              symbol: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case SYMBOL.ERROR:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              symbol: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case TOTAL_SUPPLY.CALL:
      {
        const {options: {
            at
          }} = payload;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              totalSupply: {
                isLoading: true,
                value: null
              }
            }
          }
        }
      }
    case TOTAL_SUPPLY.SUCCESS:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              totalSupply: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case TOTAL_SUPPLY.ERROR:
      {
        const value = payload;
        const {options: {
            at
          }} = meta;

        return {
          ...state,
          contracts: {
            [at]: {
              ...state.contracts[at],
              totalSupply: {
                value,
                isLoading: false
              }
            }
          }
        }
      }
    case BALANCE_OF.CALL:
      {
        const {options: {
            at
          }, args: [who]} = payload;

        return {
          ...state,
          contracts: {
            [at]: {
              balances: {
                [who]: {
                  isLoading: true,
                  value: null
                }
              }
            }
          }
        };
      }
    case BALANCE_OF.SUCCESS:
      {
        const value = payload;
        const {options: {
            at
          }, args: [who]} = meta;
        return {
          ...state,
          contracts: {
            [at]: {
              balances: {
                [who]: {
                  isLoading: false,
                  value
                }
              }
            }
          }
        };
        return state;
      }

    default:
      return state;
  }
};