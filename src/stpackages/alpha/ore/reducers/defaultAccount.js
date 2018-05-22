import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import types from '../constants'

const defaultState = fromJS(initialState.defaultAccount)

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.RECEIVE_DEFAULT_ACCOUNT:
      return payload
    case types.CHANGE_DEFAULT_ACCOUNT:
      return payload
    default:
      return state
  }
}
