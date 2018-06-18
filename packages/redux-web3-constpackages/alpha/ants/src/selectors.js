const WEB3 = 'web3'
const INSTANCE = 'instance'
const ETH = 'eth'
const CURRENT_PROVIDER = 'currentProvider'
const PUBLIC_CONFIG_STORE = 'publicConfigStore'
const STATE = '_state'
const DEFAULT_ACCOUNT = 'defaultAccount'
const GET_ACCOUNTS = 'getAccounts'
const GET_STATE = 'getState'
const SELECTED_ADDRESS = 'selectedAddress'

const ACCOUNTS = 'accounts'
const ITEMS = 'items'

const CONTRACT = 'contract'

export const web3 = state => state[WEB3][INSTANCE]
export const web3Eth = state => state[WEB3][INSTANCE][ETH]
export const defaultAccount = state => state[WEB3][INSTANCE][ETH][DEFAULT_ACCOUNT]
export const getAccounts = state => state[WEB3][INSTANCE][ETH][GET_ACCOUNTS]
export const getState = state => state[WEB3][INSTANCE][CURRENT_PROVIDER][PUBLIC_CONFIG_STORE][GET_STATE]
export const selectedAddress = state => state[WEB3][INSTANCE][CURRENT_PROVIDER][PUBLIC_CONFIG_STORE][STATE][SELECTED_ADDRESS]

export const getAccountsFromStore = state => state[ACCOUNTS][ITEMS]
export const getContract = state => state[CONTRACT][INSTANCE]
