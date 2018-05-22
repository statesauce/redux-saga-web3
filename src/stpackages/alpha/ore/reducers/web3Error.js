import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.web3ProviderStatus)

const web3Error = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.INIT_WEB3_FAILURE:
      return payload
    case types.GET_ACCOUNTS_FAILURE:
      return payload
    case types.INIT_CONTRACT_FAILURE:
      return payload
    case types.INIT_WEB3_SUCCESS:
      return null
    default:
      return state
  }
}

export default web3Error
