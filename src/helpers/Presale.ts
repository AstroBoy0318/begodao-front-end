import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import { abi as presale_abi } from "../abi/Presale.json";
import { abi as dai_abi } from "../abi/IERC20.json";
import { ethers } from "ethers";
import { addresses } from "../constants";

export async function isPresaleOpen(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const isOpened = await presaleContract.openIdo();
    const level = await presaleContract.whiteListed(address);
    const startTime = await presaleContract.saleStartTime();
    const privateSalePeriod = await presaleContract.saleStartTime();
    const nowTime = new Date().getTime() / 1000;
    if (level === 0) {
      const publicSalePeriod = await presaleContract.saleStartTime();
      return (
        isOpened &&
        startTime + privateSalePeriod < nowTime &&
        startTime + privateSalePeriod + publicSalePeriod > nowTime
      );
    } else {
      return isOpened && startTime + privateSalePeriod > nowTime;
    }
  } catch (ex) {
    return false;
  }
}

export async function getPurchased(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const purchased = await presaleContract.boughtTokens(address);
    return purchased;
  } catch (ex) {
    return true;
  }
}

export async function getMaxAmount(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const level = await presaleContract.whiteListed(address);
    let maxPurchaseAmount = await presaleContract.maxPurchaseAmount(level);
    maxPurchaseAmount = ethers.utils.formatUnits(maxPurchaseAmount, 9);
    maxPurchaseAmount = Number(maxPurchaseAmount);
    let sellAmount = await presaleContract.sellAmount();
    sellAmount = ethers.utils.formatUnits(sellAmount, 9);
    let totalAmount = await presaleContract.totalAmount();
    totalAmount = ethers.utils.formatUnits(totalAmount, 9);
    const remainAmount = Number(totalAmount) - Number(sellAmount);
    return remainAmount < maxPurchaseAmount ? remainAmount : maxPurchaseAmount;
  } catch (ex) {
    return 0;
  }
}

export async function getPrice(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const level = await presaleContract.whiteListed(address);
    const price = await presaleContract.salePrice(level);
    return ethers.utils.formatEther(price);
  } catch (ex) {
    return 0;
  }
}

export async function getDaiApproval(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider);
    const approval = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    return ethers.utils.formatEther(approval);
  } catch (ex) {
    return 0;
  }
}

export async function getDaiBalance(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider);
    const balance = await daiContract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  } catch (ex) {
    return 0;
  }
}

export async function daiApprove(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider.getSigner());
    await daiContract.approve(addresses[networkID].PRESALE_ADDRESS, "0xfffffffffffffffffffffffffffffff");
    return true;
  } catch (ex) {
    return false;
  }
}

export async function doPurchase(networkID: NetworkID, provider: StaticJsonRpcProvider, val: number) {
  try {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      presale_abi,
      provider.getSigner(),
    );
    await presaleContract.purchase(val);
    return true;
  } catch (ex) {
    return false;
  }
}
