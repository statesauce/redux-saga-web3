import { createTypesForMethodCall } from "redux-saga-web3-eth-contract";
import { Map, fromJS } from "immutable";

const initialState = Map({
  contracts: Map(),
});

const BALANCE_OF = createTypesForMethodCall("ERC20", "balanceOf");

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case BALANCE_OF.CALL: {
      const {
        options: { at },
        args: [who],
      } = payload;

      return state.setIn(
        ["contracts", at, "balances", who],
        Map({ isLoading: true, value: null })
      );
    }
    case BALANCE_OF.SUCCESS: {
      const value = payload;
      const {
        options: { at },
        args: [who],
      } = meta;

      return state.setIn(
        ["contracts", at, "balances", who],
        Map({ isLoading: false, value })
      );
    }

    default:
      return state;
  }
};
