# statesauce

An out-of-the-box state management library for Ethereum and web3.

:warning: This is unfinished software. Please use at your own risk.

To see statesauce in action, see quickstart:

#### Installation

```
npm i statesauce
```

#### Usage

```js
import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";

import Provider from "statesauce/lib/Provider";

const Accounts = ({ accounts: { isLoading, items } }) =>
  isLoading ? (
    "Loading"
  ) : (
    <div>
      Accounts:
      <ul>{items.map(account => <li>{account}</li>)}</ul>
    </div>
  );

const EnhancedAccounts = connect(state => ({
  accounts: state.accounts
}))(Accounts);

const App = () => (
  <Provider>
    <EnhancedAccounts />
  </Provider>
);

render(<App />, document.getElementById("root"));
```