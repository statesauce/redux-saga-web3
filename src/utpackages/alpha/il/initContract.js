/* global web3 */
import Truffle from 'truffle-contract'

const initializeContract = artifact => {
  let contract = Truffle(artifact)
  contract.setProvider(web3.currentProvider) // get networkID
  return contract
}

export default initializeContract

// truffleABI.networks