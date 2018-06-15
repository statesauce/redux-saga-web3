# redux-saga-web3-erc721

A redux-saga interface to an ERC721 contract instance.

### Usage

Add the reducer to your redux store:

```
import { reducer as ERC721Reducer } from "redux-saga-web3-erc721";

...

const reducers = combineReducers({
  ...,
  ...ERC721Reducer,
});
```

Interact with an ERC721 instance through actions and selectors:

```
import { actions as ERC721Actions, selectors as ERC721Selectors } from "redux-saga-web3-erc721";

connect(state => ({
  balance: ERC721Selectors.selectBalanceOf(state, { owner: "0xbeef" });
}), dispatch => ({
  getBalanceOf: (owner, at) => dispatch(ERC721Actions.balanceOf(owner, { at }));
}))(Component)
```
