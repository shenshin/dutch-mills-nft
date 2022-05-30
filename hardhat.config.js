require('@nomiclabs/hardhat-waffle');
const { join } = require('path');
require('dotenv').config();
const { mnemonic } = require('./.secret.json');
const {
  deployContracts,
  writeDeployments,
  mintNfts,
  getDeploymentPrice,
  promptTxPrice,
  checkDeployerBalance,
} = require('./utils');

const newCIDsToMint = [
  'Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
  'QmY6KX35Rg25rnaffmZzGUFb3raRhtPA5JEFeSSWQA4GHL',
];

task('deploy', 'Deploys smart contract to a blockchain', async () => {
  try {
    const deploymentPrice = await getDeploymentPrice('DutchMills');
    await promptTxPrice(deploymentPrice);
    await checkDeployerBalance(deploymentPrice);
    const dutchMills = await deployContracts();
    await writeDeployments(dutchMills.address);
    console.log(
      `Dutch Mills NFT deployed to: ${dutchMills.address} on ${hre.network.name}`,
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});

task('mint', 'Mint new NFT collectibles').setAction(async () => {
  try {
    await mintNfts();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});

const constants = {
  rsk: { coingeckoId: 'rootstock', currencyName: 'RBTC' },
  eth: { coingeckoId: 'ethereum', currencyName: 'ETH' },
  bnc: { coingeckoId: 'binancecoin', currencyName: 'BNB' },
};

module.exports = {
  newCIDsToMint,
  deploymentFile: join(__dirname, 'deployments.json'),
  solidity: '0.8.12',
  settings: {
    optimizer: {
      enabled: true,
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      coingeckoId: constants.eth.coingeckoId,
    },
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ETHEREUM_API_KEY}`,
      chainId: 1,
      accounts: {
        mnemonic,
      },
      coingeckoId: constants.eth.coingeckoId,
      currencyName: constants.eth.currencyName,
      mainnet: true,
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_ROPSTEN_API_KEY}`,
      chainId: 3,
      accounts: {
        mnemonic,
      },
      coingeckoId: constants.eth.coingeckoId,
      currencyName: constants.eth.currencyName,
    },
    ganache: {
      url: 'http://localhost:7171',
      coingeckoId: constants.eth.coingeckoId,
      currencyName: constants.eth.currencyName,
    },
    rskregtest: {
      url: 'http://localhost:4444',
      chainId: 33,
      coingeckoId: constants.rsk.coingeckoId,
      currencyName: constants.rsk.currencyName,
    },
    rsktestnet: {
      chainId: 31,
      url: 'https://public-node.testnet.rsk.co/',
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      coingeckoId: constants.rsk.coingeckoId,
      currencyName: constants.rsk.currencyName,
    },
    rskmainnet: {
      chainId: 30,
      url: 'https://public-node.rsk.co',
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      coingeckoId: constants.rsk.coingeckoId,
      currencyName: constants.rsk.currencyName,
      mainnet: true,
    },
    bnctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: { mnemonic },
      coingeckoId: constants.bnc.coingeckoId,
      currencyName: constants.bnc.currencyName,
    },
    bncmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      accounts: { mnemonic },
      coingeckoId: constants.bnc.coingeckoId,
      currencyName: constants.bnc.currencyName,
      mainnet: true,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    // 10 minutes
    timeout: 600000,
  },
};
