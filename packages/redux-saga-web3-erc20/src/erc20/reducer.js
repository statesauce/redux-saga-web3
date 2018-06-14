import { createTypesForMethodCall } from "redux-saga-web3-eth-contract";

const initialState = {
  contracts: {},
};

const BALANCE_OF = createTypesForMethodCall("ERC20", "balanceOf");

export default (state = initialState, { type, meta, payload }) => {
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
      const { value } = payload;
      const {
        options: { at },
        args: [who],
      } = meta;
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
