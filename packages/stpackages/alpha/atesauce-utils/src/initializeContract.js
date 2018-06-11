/* global web3 */
import Truffle from "truffle-contract";

const initializeContract = artifact => {
  const contract = Truffle(artifact);
  contract.setProvider(web3.currentProvider);
  return contract;
};

export default initializeContract;
