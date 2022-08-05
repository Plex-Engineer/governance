import { NavBar } from "cantoui";
import { connect, getAccountBalance, getChainIdandAccount } from "utils/addCantoToWallet";
import { useEffect } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import logo from "../assets/logo.svg"

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();

  useEffect(() => {
    const [chainId, account] = getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
    //@ts-ignore
  }, [window.ethereum?.selectedAddress, window.ethereum?.networkVersion]);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    //@ts-ignore
    window.ethereum.on("networkChanged", () => {
      window.location.reload();
    });
  }

  async function getBalance() {
    if (netWorkInfo.account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account))
    }
  }
  useEffect(() => {
    getBalance();
  },[netWorkInfo.account])

  return (
    <NavBar
      title="governance"
      onClick={connect}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={netWorkInfo.isConnected && netWorkInfo.account ? true : false}
      balance={netWorkInfo.balance}
      currency={"CANTO"}
      logo={logo}
    />
  );
};