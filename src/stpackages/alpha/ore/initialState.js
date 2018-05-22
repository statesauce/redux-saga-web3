const web3InitialState = {
  web3: null,
  accounts: [],
  contract: null,
  defaultAccount: null,
  web3Error: null
}

export const { web3, accounts, contract, defaultAccount, web3Error } = web3InitialState
export const initialState = web3InitialState
export default web3InitialState
