/* global hre */
const fs = require('fs');

/**
 * Reads deployment addresses from a JSON file
 * @returns deployment addresses object
 */
function readDeployments() {
  let deployments;
  try {
    deployments = JSON.parse(
      fs.readFileSync(hre.config.deploymentFile, 'utf8'),
    );
  } catch (error) {
    deployments = {};
  }
  return deployments;
}

module.exports = readDeployments;
