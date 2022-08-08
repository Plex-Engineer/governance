import { ethers } from "ethers";
import { CantoMainnet } from "cantoui";

export function addNetwork() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x" + CantoMainnet.chainId.toString(16),
            chainName: "Canto",
            nativeCurrency: {
              name: "Canto Coin",
              symbol: "CANTO",
              decimals: 18,
            },
            rpcUrls: [CantoMainnet.rpcUrl],
            blockExplorerUrls: [CantoMainnet.blockExplorerUrl],
          },
        ],
      })
      .catch((error: any) => {
        // console.log(error);
      });
  }
}

export async function getChainIdandAccount(): Promise<string[] | undefined[]> {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    const network = await window.ethereum.networkVersion;
    console.log("🚀 ~ file: addCantoToWallet.ts ~ line 36 ~ getChainIdandAccount ~ network", network)
    //@ts-ignore
    const account = await window.ethereum.selectedAddress;
    console.log("🚀 ~ file: addCantoToWallet.ts ~ line 39 ~ getChainIdandAccount ~ account", account)
    //@ts-ignore
    return [network, account];
  }
  return [undefined, undefined];
}
export async function connect() {
  console.log(window);
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    addNetwork();
  }
}

export async function getAccountBalance(account: string | undefined) {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    let balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    return ethers.utils.formatEther(balance);
  }
  return "0";
}
