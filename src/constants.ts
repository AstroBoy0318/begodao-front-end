export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 41423;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 1;

export const BLOCK_RATE_SECONDS_BONDS = 0.7;

export const TOKEN_DECIMALS = 9;

export const SECONDS_PER_YEAR = 31536000;

export const POOL_GRAPH_URLS = {
  1337: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  250: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  4002: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

export const API_URL = "https://daoback.begoiko.com";

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  1337: {
    DAI_ADDRESS: "0x7b418ffeB822B6caa791C087e40d6624c39B4Fa8",
    BEGO_ADDRESS: "0xA03dAcd0C553F64A4675e5E9040CC0B69Eab8c64",
    STAKING_ADDRESS: "0x90838E686942AB82b6478452c8297E7ef2B9a976",
    STAKING_HELPER_ADDRESS: "0x3d6C22605415C38488D70427a5a63EC4C4d05951",
    SBEGO_ADDRESS: "0x3fd3c471E98837ed8D8dda7ce99c0c0FC76Ac7D7",
    DISTRIBUTOR_ADDRESS: "0x06E20EA329dF5b7539F6a4c8F129f0A74087af2C",
    BONDINGCALC_ADDRESS: "0x31664c503157447C875a4B6862cd9e249C48d751",
    TREASURY_ADDRESS: "0xB257d33A5000fbfE8A71F7E1c2f021aD979FE4E8",
  },
  250: {
    DAI_ADDRESS: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
    BEGO_ADDRESS: "0xe961c722515657C375Fb0D504953041876C34e94",
    STAKING_ADDRESS: "0xBD640dF25B53Cd0D5e2958d7ecF0aa608C3B3009",
    STAKING_HELPER_ADDRESS: "0xd52dE670c0ACD5889A1622376A6288b42E1300A0",
    SBEGO_ADDRESS: "0x8bb6489338366FFa4C342332AF724C4608e983a3",
    DISTRIBUTOR_ADDRESS: "0x75d0a1a28a7022cd0710a6DE9B901A3f6Bf29e5a",
    BONDINGCALC_ADDRESS: "0x514cDe3030994B0BC05d0EEAab53D681139E6606",
    TREASURY_ADDRESS: "0xB5c72472bef025Cb286388BAA9C35D81880635ee",
    REDEEM_HELPER_ADDRESS: "0x18891d5783F4fE8AcD0a5c7e9868C0C0834C709c",
    FACTORY_ADDRESS: "0x152ee697f2e276fa89e96742e9bb9ab1f2e61be3",
    PRESALE_ADDRESS: "0xB9c58543879e15eddDDAf90aE85601c03F940dAC",
    WFTM_ADDRESS: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    MASTERCHEF_ADDRESS: "0x45D6d40c9CCB98A1864674f4106478CA1E371e4A",
    XBEGO_ADDRESS: "0x4E7E66239fA9100e10908c315971B905a00EE518",
  },
  4002: {
    DAI_ADDRESS: "0x3A5b6631aD2Bd2b82fd3C5c4007937F14fa809b9",
    BEGO_ADDRESS: "0x46AE42Cb2D416e59941f60009c1f760795753B3E",
    STAKING_ADDRESS: "0xED9bB82df42E27cb0DBeD398129C852d8694a326",
    STAKING_HELPER_ADDRESS: "0x5E6679cB5bF562813047Fc7D249A2f50E81ECAF6",
    SBEGO_ADDRESS: "0x043e20C088d069e3efF621b272f354c26cfA4D0A",
    DISTRIBUTOR_ADDRESS: "0x426d6B032A95eD1B5fCD85930Ab078cA21FA37F4",
    BONDINGCALC_ADDRESS: "0xC643B9b9033b2B0dE92FA3Ab368ff69CE8541B83",
    TREASURY_ADDRESS: "0x9fB5Dd567f52B13998F520e0204519946b1d3CBD",
    FACTORY_ADDRESS: "0xb2c9d73f632e6e99c3b21ac8e96a71c2d0d33039",
    PRESALE_ADDRESS: "0x6D14E27f79810A0669E3c16EE70e45ff10f14D51",
    WFTM_ADDRESS: "0xf1903E0264FaC93Be0163c142DB647B93b3ce0d4",
    REDEEM_HELPER_ADDRESS: "0x85C70E6180200434B65F47AA6B2C3F4FC3A61f3d",
  },
  80001: {
    DAI_ADDRESS: "0xef45e6E3159e9F302D2B85f6E777791d7B7e98d8",
    BEGO_ADDRESS: "0x6fBEe246b7348F02A04348f160583d3799525001",
    STAKING_ADDRESS: "0xC556Aa8A4c6Cf25bd36d1dcC00426D9cB301114D",
    STAKING_HELPER_ADDRESS: "0xdF9e4641B1E7CCBDCcF46B9737Ff2db1931FbAa8",
    SBEGO_ADDRESS: "0x98f9C90E56a44ED08782Cba0C74D6A2984C82875",
    DISTRIBUTOR_ADDRESS: "0x145321c9137742Adc2Dc87AE90d8E271C78Bab0B",
    BONDINGCALC_ADDRESS: "0xC9C61B96F6631d3199a4e87E14A505566869b098",
    TREASURY_ADDRESS: "0xc090836C4C8fbd66E3903F7ACfeEf6ffa013990E",
    FACTORY_ADDRESS: "0x58767006e1586e1682aeC6E2078B1b3F15Bb836A",
    PRESALE_ADDRESS: "0x37c2fef63F3cC53c103F52f6b970Ac241ae5F41c",
    WFTM_ADDRESS: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    REDEEM_HELPER_ADDRESS: "0xAF46E1DC1Bc685fb0C40F415B6EBbd2123a4AD69",
    MASTERCHEF_ADDRESS: "0x8F137DF0d29e7108f2F9864e1D99bC907A8c1612",
    XBEGO_ADDRESS: "0xa142e64deda1a75094006182f88A30b67B58b56f",
  },
};

export const farms = {
  1337: [],
  4002: [],
  250: [
    {
      id: 0,
      isLP: false,
      toShowUsd: true,
      name: "xBEGO",
      image: "xBego.svg",
    },
    {
      id: 1,
      isLP: true,
      toShowUsd: true,
      name: "BEGO - DAI",
      image: "BEGO-DAI.svg",
    },
    {
      id: 2,
      isLP: true,
      toShowUsd: true,
      name: "BEGO - WFTM",
      image: "BEGO-WFTM.svg",
    },
    {
      id: 3,
      isLP: true,
      toShowUsd: true,
      name: "USDC - USDT",
      image: "USDT-USDC.svg",
    },
    {
      id: 4,
      isLP: true,
      toShowUsd: true,
      name: "WFTM - USDC",
      image: "USDC-WFTM.svg",
    },
    {
      id: 5,
      isLP: true,
      toShowUsd: true,
      name: "DAI - WFTM",
      image: "DAI-WFTM.svg",
    },
    {
      id: 6,
      isLP: true,
      toShowUsd: true,
      name: "WBTC - ETH",
      image: "WBTC-ETH.svg",
    },
    {
      id: 7,
      isLP: false,
      toShowUsd: true,
      name: "WFTM",
      image: "WFTM.svg",
    },
    {
      id: 8,
      isLP: false,
      toShowUsd: false,
      name: "DAI",
      image: "DAI.svg",
    },
    {
      id: 9,
      isLP: false,
      toShowUsd: true,
      name: "WBTC",
      image: "WBTC.svg",
    },
    {
      id: 10,
      isLP: false,
      toShowUsd: true,
      name: "ETH",
      image: "ETH.svg",
    },
    {
      id: 11,
      isLP: false,
      toShowUsd: false,
      name: "USDC",
      image: "USDC.svg",
    },
    {
      id: 12,
      isLP: false,
      toShowUsd: false,
      name: "USDT",
      image: "USDT.svg",
    },
    {
      id: 13,
      isLP: false,
      toShowUsd: false,
      name: "MIM",
      image: "MIM.svg",
    },
  ],
  80001: [
    {
      id: 0,
      isLP: true,
      name: "BEGO-DAI LP",
      toShowUsd: true,
      image: "BEGO-DAI.svg",
    },
    {
      id: 1,
      isLP: false,
      name: "DAI",
      toShowUsd: false,
      image: "DAI.svg",
    },
    {
      id: 2,
      isLP: false,
      name: "BUSD",
      toShowUsd: false,
      image: "DAI.svg",
    },
    {
      id: 3,
      isLP: false,
      name: "sBEGO",
      toShowUsd: true,
      image: "DAI.svg",
    },
    {
      id: 4,
      isLP: false,
      name: "xBEGO",
      toShowUsd: true,
      image: "DAI.svg",
    },
  ],
};

export const pools = {
  1337: [],
  4002: [],
  250: [
    {
      address: "0x5fD9d44d69c49F94095F12A147Bd502d545e3fae",
      stake: "xBEGO",
      toShowUsd: true,
      reward: "DAI",
      isLP: false,
      image: "DAI.svg",
    },
    {
      address: "0xc51b593F25F201124F8Ba4a13C4F1dD41ab8E551",
      stake: "xBEGO",
      toShowUsd: true,
      reward: "BEGO",
      isLP: false,
      image: "BEGO.svg",
    },
  ],
  80001: [
    {
      address: "0x26b316e5D11C1cB8Ca759F20F6f4970FD5FC7Fc9",
      stake: "XBEGO",
      reward: "DAI",
      toShowUsd: true,
      isLP: false,
      image: "BEGO-DAI.svg",
    },
    {
      address: "0xA8f3Bd50E02Dc127bDDfcf9B23D561B26521ABA6",
      stake: "XBEGO",
      reward: "BEGO",
      toShowUsd: true,
      isLP: false,
      image: "BEGO-DAI.svg",
    },
  ],
};
