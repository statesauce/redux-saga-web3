# statesauce

An out-of-the-box state management library for Ethereum and web3.

:warning: This is unfinished software. Please use at your own risk.

To see statesauce in action, see quickstart:
# quickstart

```
npm i -g create-react-app
create-react-app testsauce
cd testsauce
npm i react-redux redux immutable redux-immutable redux-logger redux-saga redux-thunk truffle-contract web3
```
- Drag statesauce folder into testsauce/src. In statesauce, you can remove package.json, package-lock, etc.
- In testsauce/index.js paste the following code:
```js
import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { Provider } from 'react-redux'
import { store } from './statesauce/src/statesauce.js'

render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
```
- In testsauce/App.js paste the following code:
```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'

import { creators, selectors } from './statesauce/src/statesauce'

class App extends Component {
  componentDidMount () {
    this.props.sauceIt('http://127.0.0.1:8545')
  }
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
          Your default account is {this.props.defaultAccount}
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  defaultAccount: selectors.fromStore.getDefaultAccount(state)
})

const mapDispatchToProps = dispatch => ({
  sauceIt (rpcAddr) {
    dispatch(creators.initWeb3Request(rpcAddr))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
```