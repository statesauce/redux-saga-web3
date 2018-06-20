# redux-saga-web3

An out-of-the-box state management library for Ethereum and web3.

:warning: This is alpha software. There may be breaking changes.

#### Installation

```
npm i redux-web3
```

#### Usage

```js
import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

import Provider from 'redux-web3-provider'

const AppComponent = ({ isLoading, accounts }) => (
  <div> Accounts:
    <ul>
      {isLoading
        ? <li>Loading...</li>
        : accounts && accounts.map(act => <li key={act}>{act}</li>)
      }
    </ul>
  </div>
)

const AppContainer = connect({ accounts } => ({
  isLoading: accounts.isLoading,
  accounts: accounts.items
}))(AppComponent)

render(
  <Provider>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)
```

#### Motivation

#### References
[Flux standard action](https://github.com/redux-utilities/flux-standard-action)
