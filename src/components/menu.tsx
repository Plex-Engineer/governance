import { useState } from "react";
import styled from "styled-components";

interface MenuProps {
  open: boolean;
}
const StyledBurger = styled.button<MenuProps>`
  position: left;
  top: 5%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${({ open }) => (open ? "#EFFFFA" : "#06fc99")};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? "0" : "1")};
      transform: ${({ open }) => (open ? "translateX(20px)" : "translateX(0)")};
    }

    :nth-child(3) {
      transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;
const StyledMenu = styled.nav<MenuProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background: #effffa; */
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 576px) {
    width: 100%;
  }

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #0d0c1d;
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: 576px) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: #343078;
    }
  }
`;
interface BurgerProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Menu = ({ open }: MenuProps) => {
  return (
    <StyledMenu open={open}>
      <a href="https://bridge-canto.netlify.app/">bridge</a>
      <a href="/">convert coin</a>
      <a href="/">dex</a>
      <a href="https://generator-canto.netlify.app/">generator</a>
      <a href="https://governance-canto.netlify.app/">governance</a> 
      <a href="/">lending</a> 
      <a href="https://staking-canto.netlify.app/">staking</a>
    </StyledMenu>
  );
};

export const Burger = ({ open, setIsOpen }: BurgerProps) => {
  return (
  <StyledBurger open={open} onClick={() => setIsOpen(!open)}>
    <div/>
    <div/>
    <div/>
  </StyledBurger>
)};
