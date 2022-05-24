/* global ethers */
/**
 * Deploys smart contract to the selected network
 * @returns object representing the deployed contract
 */
async function deployContracts() {
  const dutchMillsContractFactory = await ethers.getContractFactory(
    'DutchMills',
  );
  const dutchMills = await dutchMillsContractFactory.deploy();
  await dutchMills.deployed();

  return dutchMills;
}

module.exports = deployContracts;
