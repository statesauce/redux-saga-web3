import * as types from './actionTypes'

export const initWeb3Request = rpcAddr => ({
  type: types.INIT_WEB3_REQUEST,
  payload: rpcAddr
})
export const initWeb3Success = web3 => ({
  type: types.INIT_WEB3_SUCCESS,
  payload: web3
})
export const initWeb3Failure = err => ({
  type: types.INIT_WEB3_FAILURE,
  payload: err
})

export const getAccountsRequest = () => ({
  type: types.GET_ACCOUNTS_REQUEST
})
export const getAccountsSuccess = accounts => ({
  type: types.GET_ACCOUNTS_SUCCESS,
  payload: accounts
})
export const getAccountsFailure = err => ({
  type: types.GET_ACCOUNTS_FAILURE,
  payload: err
})

export const receiveDefaultAccount = defaultAccount => ({
  type: types.RECEIVE_DEFAULT_ACCOUNT,
  payload: defaultAccount
})
export const changeDefaultAccount = newDefaultAccount => ({
  type: types.CHANGE_DEFAULT_ACCOUNT,
  payload: newDefaultAccount
})

export const initContractRequest = () => ({
  type: types.INIT_CONTRACT_REQUEST
})
export const initContractFailure = err => ({
  type: types.INIT_CONTRACT_FAILURE,
  payload: err
})
export const initContractSuccess = oracle => ({
  type: types.INIT_CONTRACT_SUCCESS,
  payload: oracle
})
