/* eslint-disable no-undef */
const axios = require('axios').default;

/**
 * Fetches Coingecko for the current crypto / fiat rate
 * @param {string} currency fiat currency symbol
 * @returns {Promise<number>} current crypto / fiat rate
 */
async function getCryptoPrice(currency = 'usd') {
  const { coingeckoId } = hre.network.config;
  if (!coingeckoId)
    throw new Error(
      `Add 'coingeckoId' propery to network '${hre.network.name}' in 'hardhat.config.js'`,
    );
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coingeckoId}`,
  );
  const cryptoPrice = response.data.market_data.current_price[currency];
  if (!cryptoPrice)
    throw new Error(`Can't get ${currency} price for ${coingeckoId}.`);
  return cryptoPrice;
}

module.exports = getCryptoPrice;
