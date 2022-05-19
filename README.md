# Dutch Mills NFTs

## Deploy and mint NFTs with a collection of Dutch windmill/watermill photos

- Rename `template.secret.json` to `.secret.json` and put there your account mnemonic phrase. 

- To compile the smart contract
```bash
npx hardhat compile
```
- To deploy the s/c
```bash
npx hardhat deploy --network yourNetwork
```
see the available networks in `hardhat.config.js`

- To mint new items modify `utils/mintNfts.js`. Add new CIDs to `newCIDsToMint` array. Then run
```bash
npx hardhat mint --network yourNetwork
```