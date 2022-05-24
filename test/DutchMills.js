/* global describe before it hre */
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { deployContracts } = require('../utils');

describe('Meow NFT', () => {
  let deployer;
  let dutchMills;

  before(async () => {
    if (hre.network.config.mainnet)
      throw new Error('dont run this test on a real network!!!!!');
    [deployer] = await ethers.getSigners();
    dutchMills = await deployContracts();
  });

  describe('upon deployment', () => {
    it('Deployer must be the owner', async () => {
      expect(await dutchMills.owner()).to.equal(deployer.address);
    });

    it(`Owner's balance should be zero`, async () => {
      expect(await dutchMills.balanceOf(deployer.address)).to.equal(0);
    });
  });

  describe('mint', () => {
    const newNftId = 1;
    it('should be able to mint new NFT', async () => {
      const tx = await dutchMills
        .connect(deployer)
        .mintNFT(
          deployer.address,
          'ipfs://QmP7goH8m5XoFGPcLJTfCzUmncYLXSJUgijXKTsf4o25UH',
        );
      await expect(tx)
        .to.emit(dutchMills, 'Transfer')
        .withArgs(ethers.constants.AddressZero, deployer.address, newNftId);
    });
  });
});
