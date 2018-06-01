import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.accounts)

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.GET_ACCOUNTS_SUCCESS:
      return payload
    default:
      return state
  }
}
