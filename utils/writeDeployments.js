/* eslint-disable no-undef */
const fs = require('fs');
const readDeployments = require('./readDeployments.js');

/**
 * Writes deployed s/c address for the current network to a JSON file
 * specified in `project.config.js`
 * @param {string} address deployment address in the selected network
 */
async function writeDeployments(address) {
  const deployments = readDeployments();
  deployments[hre.network.name] = address;
  fs.writeFileSync(
    hre.config.deploymentFile,
    JSON.stringify(deployments),
    'utf8',
  );
}

module.exports = writeDeployments;
