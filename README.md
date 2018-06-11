# statesauce

An out-of-the-box state management library for Ethereum and web3.

:warning: This is unfinished software. Please use at your own risk.

#### Installation

```
npm i statesauce
```

#### Usage

```js
import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

import Provider from 'statesauce/lib/Provider'

const AppComponent = ({ accounts: { isLoading, items } }) => (
  <div> Accounts:
    <ul>
      {isLoading
        ? <li>Loading...</li>
        : items && items.map(account => <li key={account}>{account}</li>)
      }
    </ul>
  </div>
)

const AppContainer = connect(state => ({
  accounts: state.accounts
}))(AppComponent)

render(
  <Provider>
    <AppContainer />
  </Provider>,
  document.getElementById('root'))
```