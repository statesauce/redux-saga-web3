import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.defaultAccount)

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.DEFAULT_ACCOUNT.RECEIVE:
      return payload
    case types.DEFAULT_ACCOUNT.CHANGE:
      return payload
    default:
      return state
  }
}
