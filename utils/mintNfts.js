const getDeployedAddress = require('./getDeployedAddress.js');
const promptTxPrice = require('./promptTxPrice.js');
const checkDeployerBalance = require('./checkDeployerBalance.js');

/**
 * Sends transactions one by one
 * @param {*} deployedNft object representing the deployed s/c
 * @param {string} minterAddress minted NFTs owner (minter) address
 */
async function mintSequentially(deployedNft, minterAddress) {
  const cid = hre.config.newCIDsToMint.shift();
  if (cid) {
    // send mint transaction
    const tx = await deployedNft.mintNFT(minterAddress, `ipfs://${cid}`);
    const receipt = await tx.wait();
    // trying to get an ID of the newly minted item
    let tokenId = '?';
    try {
      tokenId = receipt.events[0].args.tokenId;
    } catch (error) {
      // do nothing
    }
    console.log(`Minted NFT ${deployedNft.address} # ${tokenId}`);
    // call recursively until `newCIDsToMint` is empty
    await mintSequentially(deployedNft, minterAddress);
  }
}

/**
 * Mints new CIDs to deployed Dutch Mills s/c
 */
async function mintNfts() {
  if (
    !hre.config.newCIDsToMint ||
    !Array.isArray(hre.config.newCIDsToMint) ||
    hre.config.newCIDsToMint.length === 0
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
  // calculate mint price
  const estimatedGas = await dutchMills.estimateGas.mintNFT(
    signer.address,
    `ipfs://${hre.config.newCIDsToMint[0]}`,
  );
  const gasPrice = await dutchMillsContractFactory.signer.getGasPrice();
  const mintTxsPrice = gasPrice
    .mul(estimatedGas)
    .mul(ethers.BigNumber.from(hre.config.newCIDsToMint.length));
  await promptTxPrice(mintTxsPrice);
  await checkDeployerBalance(mintTxsPrice);
  await mintSequentially(dutchMills, signer.address);
}

module.exports = mintNfts;
