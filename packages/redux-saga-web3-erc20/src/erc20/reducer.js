import { createTypesForMethod } from "redux-saga-web3-eth-contract";

const initialState = {
  contracts: {},
};

const BALANCE_OF = createTypesForMethod("ERC20", "balanceOf");

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case BALANCE_OF.CALL: {
      const {
        options: { at },
        args: [who],
      } = payload;

      return {
        ...state,
        contracts: {
          [at]: {
            balances: {
              [who]: { isLoading: true, value: null },
            },
          },
        },
      };
    }
    case BALANCE_OF.SUCCESS: {
      const {
        options: { at },
        args: [who],
        value,
      } = payload;

      return {
        ...state,
        contracts: {
          [at]: {
            balances: {
              [who]: { isLoading: false, value },
            },
          },
        },
      };
      return state;
    }

    default:
      return state;
  }
};
