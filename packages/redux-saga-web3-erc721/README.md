# redux-saga-web3-erc721

A redux-saga interface to an ERC721 contract instance.

### Usage

Add the reducer to your redux store:

```javascript
import { reducer as ERC721Reducer } from "@statesauce/web3-erc721";

...

const reducers = combineReducers({
  ...,
  ...ERC721Reducer,
});
```

Interact with an ERC721 instance through actions and selectors:

```javascript
import {
  actions as ERC721Actions,
  selectors as ERC721Selectors,
} from "@statesauce/web3-erc721";

export default connect(
  (state, { owner, at }) => ({
    balance: ERC721Selectors.selectBalanceOf(state, { owner, at }),
  }),
  dispatch => ({
    getBalanceOf(owner, at) {
      dispatch(ERC721Actions.balanceOf(owner, { at }));
    },
  })
)(Component);
```
