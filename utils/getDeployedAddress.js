const readDeployments = require('./readDeployments.js');

/**
 * Reads deployment addresses from JSON file and returns one
 * for the current network
 * @returns current blockchain deployment address
 */
async function getDeployedAddress() {
  const deployments = readDeployments();
  const address = deployments[hre.network.name];
  if (!address)
    throw new Error('smart contract is not deployed on the current network');
  return address;
}

module.exports = getDeployedAddress;
