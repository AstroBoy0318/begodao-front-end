import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as WFTMImg } from "src/assets/tokens/WFTM.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/BEGO-DAI.svg";

import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.FantomTestnet]: true,
    [NetworkID.Fantom]: false,
    [NetworkID.Mumbai]: false,
    [NetworkID.Local]: true,
  },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0x452B9e16f5dE21372B9a83CFC1Cf080FACa06D67",
      reserveAddress: "0x3A5b6631aD2Bd2b82fd3C5c4007937F14fa809b9",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x33DaafEa4863A44C25A582Cc3Ef0d6e778372088",
      reserveAddress: "0xef45e6E3159e9F302D2B85f6E777791d7B7e98d8",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0x3ee73cBc71aB84e1335d82835a3f0237D5500B3F",
      reserveAddress: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    },
    [NetworkID.Local]: {
      bondAddress: "0x3C4bcEC0104038f59CDDe68E4EcC7DCaA6F15af1",
      reserveAddress: "0x7b418ffeB822B6caa791C087e40d6624c39B4Fa8",
    },
  },
});

export const dai_1 = new StableBond({
  name: "dai_1",
  displayName: "DAI v2",
  bondToken: "DAI",
  isAvailable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    [NetworkID.FantomTestnet]: true,
    [NetworkID.Fantom]: true,
    [NetworkID.Mumbai]: true,
    [NetworkID.Local]: true,
  },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0x452B9e16f5dE21372B9a83CFC1Cf080FACa06D67",
      reserveAddress: "0x3A5b6631aD2Bd2b82fd3C5c4007937F14fa809b9",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x977d26965949B3c7dEef880D3B0388f17648171a",
      reserveAddress: "0xef45e6E3159e9F302D2B85f6E777791d7B7e98d8",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0x07e3f256cDFD3d90256e15FB8Cd1DdE8b677141D",
      reserveAddress: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    },
    [NetworkID.Local]: {
      bondAddress: "0x3C4bcEC0104038f59CDDe68E4EcC7DCaA6F15af1",
      reserveAddress: "0x7b418ffeB822B6caa791C087e40d6624c39B4Fa8",
    },
  },
});

export const ohm_dai = new LPBond({
  name: "bego_dai_lp",
  displayName: "BEGO - DAI LP",
  bondToken: "DAI",
  isAvailable: { [NetworkID.FantomTestnet]: true, [NetworkID.Fantom]: false, [NetworkID.Mumbai]: true },
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0xb160DB3963FDe16777AEcAE44b441bC7a0E4B260",
      reserveAddress: "0xb1afd9f533a2b4778fce9a0a4638e0580e16269b",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x31Fc92151d7E34AE25BBd708ea21F816AB27B4cA",
      reserveAddress: "0xe32e598b931866d54f74211326b939de7fe880fb",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0x90fdA3A2822dE1bfeA02eB6568de18F827a99e98",
      reserveAddress: "0xcac86ee9d64bc072552404789f340cc9361f86cb",
    },
    [NetworkID.Local]: {
      bondAddress: "0x11aaAb8AfdbAE798a8e76E3bD006e3b2aea1aEBe",
      reserveAddress: "0xf2F47d88A26592E8ccdB2144D34bA9CBf98Be0aD",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const ohm_dai_1 = new LPBond({
  name: "bego_dai_lp_1",
  displayName: "BEGO - DAI LP v2",
  bondToken: "DAI",
  isAvailable: { [NetworkID.FantomTestnet]: true, [NetworkID.Fantom]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0xb160DB3963FDe16777AEcAE44b441bC7a0E4B260",
      reserveAddress: "0xb1afd9f533a2b4778fce9a0a4638e0580e16269b",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x7D5E32ce10134B04854F401705EdD5C2655faD6F",
      reserveAddress: "0xe32e598b931866d54f74211326b939de7fe880fb",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0x3FeEdd81a48ccd82f593834c1e049226FFb1aA0c",
      reserveAddress: "0xcac86ee9d64bc072552404789f340cc9361f86cb",
    },
    [NetworkID.Local]: {
      bondAddress: "0x11aaAb8AfdbAE798a8e76E3bD006e3b2aea1aEBe",
      reserveAddress: "0xf2F47d88A26592E8ccdB2144D34bA9CBf98Be0aD",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const wftm = new StableBond({
  name: "wftm",
  displayName: "WFTM",
  bondToken: "WFTM",
  isAvailable: { [NetworkID.FantomTestnet]: true, [NetworkID.Fantom]: false, [NetworkID.Mumbai]: true },
  bondIconSvg: WFTMImg,
  bondContractABI: BondOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0x8fC50bAFE7F83BD7883eed92D8Ca017B416e3D52",
      reserveAddress: "0xf1903E0264FaC93Be0163c142DB647B93b3ce0d4",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0xA477450fFf9f36F977ce3E565Ea2564442009406",
      reserveAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0x45FcaD411a37EFDfeFa4611F1c4B943C4b05BC59",
      reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    },
    [NetworkID.Local]: {
      bondAddress: "0x11aaAb8AfdbAE798a8e76E3bD006e3b2aea1aEBe",
      reserveAddress: "0xf2F47d88A26592E8ccdB2144D34bA9CBf98Be0aD",
    },
  },
});

export const wftm_1 = new StableBond({
  name: "wftm_1",
  displayName: "WFTM v2",
  bondToken: "WFTM",
  isAvailable: { [NetworkID.FantomTestnet]: true, [NetworkID.Fantom]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: WFTMImg,
  bondContractABI: BondOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkID.FantomTestnet]: {
      bondAddress: "0x8fC50bAFE7F83BD7883eed92D8Ca017B416e3D52",
      reserveAddress: "0xf1903E0264FaC93Be0163c142DB647B93b3ce0d4",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0xCE3DEF77828aA0feAFEB7700A121E122e6E7E6e4",
      reserveAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    },
    [NetworkID.Fantom]: {
      bondAddress: "0xB8082BcBa7A39d18EbE5496be10DA314AAC54563",
      reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    },
    [NetworkID.Local]: {
      bondAddress: "0x11aaAb8AfdbAE798a8e76E3bD006e3b2aea1aEBe",
      reserveAddress: "0xf2F47d88A26592E8ccdB2144D34bA9CBf98Be0aD",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai, dai_1, ohm_dai, ohm_dai_1, wftm, wftm_1]; //, eth, ohm_dai, ohm_frax, lusd, ohm_lusd, ohm_weth
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
