import * as types from './actionTypes'

export const initWeb3Request = rpcAddr => ({
  type: types.WEB3.INIT_REQUEST,
  payload: rpcAddr
})
export const initWeb3Success = web3 => ({
  type: types.WEB3.INIT_SUCCESS,
  payload: web3
})
export const initWeb3Failure = err => ({
  type: types.WEB3.INIT_FAILURE,
  payload: err
})

export const getAccountsRequest = () => ({
  type: types.ACCOUNTS.GET_REQUEST
})
export const getAccountsSuccess = accounts => ({
  type: types.ACCOUNTS.GET_SUCCESS,
  payload: accounts
})
export const getAccountsFailure = err => ({
  type: types.ACCOUNTS.GET_FAILURE,
  payload: err
})

export const receiveDefaultAccount = defaultAccount => ({
  type: types.DEFAULT_ACCOUNT.RECEIVE,
  payload: defaultAccount
})
export const changeDefaultAccount = newDefaultAccount => ({
  type: types.DEFAULT_ACCOUNT.CHANGE,
  payload: newDefaultAccount
})

export const initContractRequest = artifact => ({
  type: types.CONTRACT.INIT_REQUEST,
  payload: artifact
})
export const initContractFailure = err => ({
  type: types.CONTRACT.INIT_FAILURE,
  payload: err
})
export const initContractSuccess = contract => ({
  type: types.CONTRACT.INIT_SUCCESS,
  payload: contract
})
