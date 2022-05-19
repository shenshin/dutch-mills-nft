const deployContracts = require('./deployContracts.js');
const mintNfts = require('./mintNfts.js');
const readDeployments = require('./readDeployments.js');
const writeDeployments = require('./writeDeployments.js');
const getDeployedAddress = require('./getDeployedAddress.js');
const promptTxPrice = require('./promptTxPrice.js');
const getDeploymentPrice = require('./getDeploymentPrice.js');
const getCryptoPrice = require('./getCryptoPrice.js');
const checkDeployerBalance = require('./checkDeployerBalance.js');

module.exports = {
  deployContracts,
  mintNfts,
  readDeployments,
  writeDeployments,
  getDeployedAddress,
  promptTxPrice,
  getDeploymentPrice,
  getCryptoPrice,
  checkDeployerBalance,
};
