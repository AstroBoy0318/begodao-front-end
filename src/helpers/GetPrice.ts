import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import { abi as erc20 } from "../abi/IERC20.json";
import { abi as factory } from "../abi/Factory.json";
import { abi as pairAbi } from "../abi/PairContract.json";
import { ethers } from "ethers";
import { addresses } from "../constants";

async function getFTMPrice() {
  try {
    const resp = await fetch("https://api.binance.com/api/v3/avgPrice?symbol=FTMUSDT", { method: "GET" });
    let data = await resp.json();
    return data.price;
  } catch (ex) {
    return 0;
  }
}

export async function getTokenPrice(networkID: NetworkID, provider: StaticJsonRpcProvider, tokenAddress: string) {
  const ftmPrice = await getFTMPrice();
  if (tokenAddress === addresses[networkID].DAI_ADDRESS) return 1;
  if (tokenAddress === addresses[networkID].WFTM_ADDRESS && ftmPrice > 0) return Number(ftmPrice);
  const factoryContract = new ethers.Contract(addresses[networkID].FACTORY_ADDRESS as string, factory, provider);
  const wftmContract = new ethers.Contract(addresses[networkID].WFTM_ADDRESS as string, erc20, provider);
  const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, erc20, provider);
  const tokenContract = new ethers.Contract(tokenAddress as string, erc20, provider);
  const tokenDecimals = await tokenContract.decimals();
  const pair = await factoryContract.getPair(tokenAddress, addresses[networkID].WFTM_ADDRESS);
  if (pair !== "0x0000000000000000000000000000000000000000") {
    const wftmBal = await wftmContract.balanceOf(pair);
    const tokenBal = await tokenContract.balanceOf(pair);
    const wftmBalance = Number(ethers.utils.formatEther(wftmBal.toString()));
    const tokenBalance = Number(ethers.utils.formatUnits(tokenBal.toString(), tokenDecimals));
    return (wftmBalance / tokenBalance) * ftmPrice;
  } else {
    const pair1 = await factoryContract.getPair(tokenAddress, addresses[networkID].DAI_ADDRESS);
    const daimBal = await daiContract.balanceOf(pair1);
    const tokenBal = await tokenContract.balanceOf(pair1);
    const daiBalance = Number(ethers.utils.formatEther(daimBal.toString()));
    const tokenBalance = Number(ethers.utils.formatUnits(tokenBal.toString(), tokenDecimals));
    return daiBalance / tokenBalance;
  }
}

export async function getLPTokenPrice(networkID: NetworkID, provider: StaticJsonRpcProvider, tokenAddress: string) {
  const ftmPrice = await getFTMPrice();
  const pairContract = new ethers.Contract(tokenAddress as string, pairAbi, provider);
  const token0 = await pairContract.token0();
  const token1 = await pairContract.token1();
  const reserves = await pairContract.getReserves();
  const totalSupply = await pairContract.totalSupply();
  let totalValue = 0;
  if (token0 == addresses[networkID].WFTM_ADDRESS) {
    totalValue = Number(ethers.utils.formatEther(reserves["reserve0"]).toString()) * ftmPrice;
  } else if (token1 == addresses[networkID].WFTM_ADDRESS) {
    totalValue = Number(ethers.utils.formatEther(reserves["reserve1"]).toString()) * ftmPrice;
  } else if (token0 == addresses[networkID].DAI_ADDRESS) {
    totalValue = Number(ethers.utils.formatEther(reserves["reserve0"]).toString());
  } else if (token1 == addresses[networkID].DAI_ADDRESS) {
    totalValue = Number(ethers.utils.formatEther(reserves["reserve1"]).toString());
  } else {
    totalValue = await getTokenPrice(networkID, provider, token0);
    const tokenContract = new ethers.Contract(token0 as string, erc20, provider);
    const tokenDecimal = await tokenContract.decimals();
    totalValue = totalValue * Number(ethers.utils.formatUnits(reserves["reserve0"].toString(), tokenDecimal));
  }
  return (totalValue / Number(ethers.utils.formatEther(totalSupply.toString()))) * 2;
}
