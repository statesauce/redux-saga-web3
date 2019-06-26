# statesauce-web3

An out-of-the-box state management library for Ethereum and web3.

#### Installation

```
npm i @statesauce/web3-eth-contract
```

#### Usage

```js
import Statesauce from "@statesauce/web3-eth-contract";

import MyContract from "../contracts";
import { networkNumber, provider, backupProvider } from "./myWeb3Config";

export const instance = new Statesauce(
  MyContract.contractName,
  MyContract.abi,
  {
    at: MyContract.networks[networkNumber].address,
    web3Instance: provider,
    provider: backupProvider
  }
);

const { types, actions, reducer, selectors, saga } = instance;
export { types, actions, reducer, selectors, saga };
```

TODO - Add usage example

#### Motivation

#### References

[Flux standard action](https://github.com/redux-utilities/flux-standard-action)
