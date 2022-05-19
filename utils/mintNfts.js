/* eslint-disable no-undef */
const getDeployedAddress = require('./getDeployedAddress.js');
const promptTxPrice = require('./promptTxPrice.js');
const checkDeployerBalance = require('./checkDeployerBalance.js');

const newCIDsToMint = [
  'Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
  'QmY6KX35Rg25rnaffmZzGUFb3raRhtPA5JEFeSSWQA4GHL',
];

/**
 * Sends transactions one by one
 * @param {*} deployedNft object representing the deployed s/c
 * @param {string} minterAddress minted NFTs owner (minter) address
 */
async function mintSequentially(deployedNft, minterAddress) {
  const cid = newCIDsToMint.shift();
  if (cid) {
    const tx = await deployedNft.mintNFT(minterAddress, `ipfs://${cid}`);
    const receipt = await tx.wait();
    let tokenId = '?';
    try {
      tokenId = receipt.events[0].args.tokenId;
    } catch (error) {
      // do nothing
    }
    console.log(`Minted NFT ${deployedNft.address} # ${tokenId}`);
    await mintSequentially(deployedNft, minterAddress);
  }
}

/**
 * Mints new CIDs to deployed Dutch Mills s/c
 */
async function mintNfts() {
  if (
    !newCIDsToMint ||
    !Array.isArray(newCIDsToMint) ||
    newCIDsToMint.length === 0
  )
    throw new Error(`Provide some new IPFS CIDs to mint NFTs out of them`);
  const [signer] = await ethers.getSigners();
  const deployedAddress = await getDeployedAddress();
  const dutchMillsContractFactory = await ethers.getContractFactory(
    'DutchMills',
  );
  const dutchMills = new ethers.Contract(
    deployedAddress,
    dutchMillsContractFactory.interface,
    signer,
  );
  const estimatedGas = await dutchMills.estimateGas.mintNFT(
    signer.address,
    `ipfs://${newCIDsToMint[0]}`,
  );
  const gasPrice = await dutchMillsContractFactory.signer.getGasPrice();
  const txPrice = gasPrice
    .mul(estimatedGas)
    .mul(ethers.BigNumber.from(newCIDsToMint.length));
  await promptTxPrice(txPrice);
  await checkDeployerBalance(txPrice);
  await mintSequentially(dutchMills, signer.address);
}

module.exports = mintNfts;
