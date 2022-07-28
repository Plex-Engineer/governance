import addresses from "constants/addresses"

export const CantoMain = {
    name: "Canto Mainnet",
    symbol: "CANTO",
    chainId: 740,
    addresses: addresses.cantoMainnet,
    rpcUrl : "https://eth.plexnode.wtf",
    isTestChain: true,
    blockExplorerUrl: "https://www.nothing.com",
};
export const CantoTest = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId : 771,
  addresses: addresses.testnet,
  rpcUrl : "http://165.227.98.94:8545",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
}
