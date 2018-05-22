# statesauce

An out-of-the-box ethereum web3 api provider and state mananagement tool

:caution: This is unfinished software. Please use at your own risk

```
npm install statesauce
```

# configure store
```js
import { withWeb3InitialStateImmutable, withWeb3Reducer, web3RootSaga } from 'statesauce'

const reducer = combineReducers(withWeb3Reducer(myAppReducers))
const sagaMiddleware = createSagaMiddleware()
const immutableInitialState = withWeb3InitialStateImmutable(myAppInitialState)

export const configureStore = (initialState = immutableInitialState) => {
  const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(
      thunkMiddleWare,
      sagaMiddleware,
      createLogger({ stateTransformer: state => state.toJS() })
    ))
  )

  store.sagaTask = sagaMiddleware.run(web3RootSaga)
  return store
}
```