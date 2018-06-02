import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.web3ProviderStatus)

const web3Error = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.WEB3.INIT_FAILURE:
      return payload
    case types.ACCOUNTS.GET_FAILURE:
      return payload
    case types.CONTRACT.INIT_FAILURE:
      return payload
    case types.WEB3.INIT_SUCCESS:
      return null
    default:
      return state
  }
}

export default web3Error
