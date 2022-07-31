import { useState } from "react";
import styled from "styled-components";
import { slide as Menu } from "react-burger-menu";

const BurgerStyles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "36px",
  },
  bmBurgerBars: {
    background: "var(--primary-color",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
  },
  bmMenu: {
    background: "#000000",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },
  bmItem: {
    display: "inline-block",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

export const BurgerMenu = () => {
  return (
    <Menu styles={BurgerStyles} pageWrapId={"page-wrap"}>
      <a id="bridge" className="menu-item" href="https://bridge-canto.netlify.app/">bridge</a>
      <a id="convertCoin" className="menu-item" href="/">convert coin</a>
      <a id="dex" className="menu-item" href="/">dex</a>
      <a id="generator" className="menu-item" href="https://generator-canto.netlify.app/">generator</a>
      <a id="governance" className="menu-item" href="https://governance-canto.netlify.app/">governance</a>
      <a id="lending" className="menu-item" href="/">lending</a>
      <a id="staking" className="menu-item" href="https://staking-canto.netlify.app/">staking</a>
    </Menu>
  );
};
