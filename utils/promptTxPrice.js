/* global ethers hre */
const { prompt } = require('inquirer');
const getCryptoPrice = require('./getCryptoPrice.js');

const toEther = (wei) => ethers.utils.formatEther(wei);

/**
 * Askes the signer (deployer) to confirm a transaction price by
 * showing him a terminal prompt. Terminates the transaction if the signer
 * said 'No'
 * @param {bignumber} txPrice estimated transaction price, ETH
 * @param {string} currency fiat currency symbol
 */
async function promptTxPrice(txPrice, currency = 'usd') {
  const cryptoPrice = await getCryptoPrice(currency);
  const toFiatPrice = (wei) => (cryptoPrice * toEther(wei)).toFixed(2);
  const currencyName = hre.network.config.currencyName || 'ETH';
  const { confirmPrice } = await prompt([
    {
      type: 'confirm',
      name: 'confirmPrice',
      message: `You are about to pay ${toEther(
        txPrice,
      )} ${currencyName} (${toFiatPrice(
        txPrice,
      )} ${currency}) for the transaction. Do you want to proceed?`,
      default: true,
    },
  ]);
  if (!confirmPrice)
    throw new Error(
      'Terminating. The transaction price was considered too high.',
    );
  if (hre.network.config.mainnet) {
    const { confirmMainnet } = await prompt([
      {
        type: 'confirm',
        name: 'confirmMainnet',
        message: `You are going to pay real money for the next transaction! Do you want to proceed?`,
        default: false,
      },
    ]);
    if (!confirmMainnet)
      throw new Error(
        `Terminating. You refused to send the transaction to ${hre.network.name}`,
      );
  }
}

module.exports = promptTxPrice;
