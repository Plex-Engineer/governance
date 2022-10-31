import { NavBar, useAlert } from "cantoui";
import { addNetwork, connect, getAccountBalance, getChainIdandAccount } from "utils/addCantoToWallet";
import { useEffect } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import logo from "../assets/logo.svg"

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const alert = useAlert();
  async function setChainInfo() {
    const [chainId, account] = await getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
    if (account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(account))
    }
  }

  useEffect(() => {
    if (!netWorkInfo.isConnected) {
      alert.show("Failure", <p>this network is not supported on governance, please <a onClick={addNetwork} style={{cursor: "pointer", textDecoration: "underline"}}>switch networks</a></p>)
    } else {
      alert.close();
    }
  }, [netWorkInfo.isConnected])

  useEffect(() => {
    setChainInfo()
  }, []);

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
  const pageList = [
    {
      name: "bridge",
      link: "https://bridge.canto.io",
    },
    {
      name: "convert coin",
      link: "https://convert.canto.io",
    },
    {
      name: "staking",
      link: "https://staking.canto.io",
    },
    {
      name: "lp interface",
      link: "https://lp.canto.io",
    },
    {
      name: "lending",
      link: "https://lending.canto.io",
    },
    {
      name: "governance",
      link: "https://governance.canto.io",
    },
  ];

  return (
    <NavBar
      onClick={connect}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={!!netWorkInfo.account}
      balance={netWorkInfo.balance}
      currency={"CANTO"}
      logo={logo}
      currentPage="governance"
      pageList={pageList}
    />
  );
};