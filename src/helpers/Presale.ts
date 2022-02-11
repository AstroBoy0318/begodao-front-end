import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import { abi as presale_abi } from "../abi/Presale.json";
import { abi as dai_abi } from "../abi/IERC20.json";
import { ethers } from "ethers";
import { addresses } from "../constants";

export async function isPresaleOpen(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const isOpened = await presaleContract.isOpenForUser(address);
    return isOpened;
  } catch (ex) {
    return false;
  }
}

export async function getPurchased(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const purchased = await presaleContract.purchasedAmount(address);
    return Number(ethers.utils.formatUnits(purchased, 9));
  } catch (ex) {
    return 0;
  }
}

export async function getMaxAmount(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const maxAmount = await presaleContract.getMaxPurchaseAmount(address);
    return Number(ethers.utils.formatUnits(maxAmount, 9));
  } catch (ex) {
    return 0;
  }
}

export async function getPrice(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const level = await presaleContract.whiteListed(address);
    const price = await presaleContract.salePrice(level);
    return Number(ethers.utils.formatEther(price));
  } catch (ex) {
    return 0;
  }
}

export async function getDaiApproval(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider);
    const approval = await daiContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    return Number(ethers.utils.formatEther(approval));
  } catch (ex) {
    return 0;
  }
}

export async function getDaiBalance(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider);
    const balance = await daiContract.balanceOf(address);
    return Number(ethers.utils.formatEther(balance));
  } catch (ex) {
    console.log(ex);
    return 0;
  }
}

export async function daiApprove(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider.getSigner());
    const tx = await daiContract.approve(addresses[networkID].PRESALE_ADDRESS, "0xfffffffffffffffffffffffffffffff");
    await tx.wait();
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
    const tx = await presaleContract.purchase(ethers.utils.parseUnits(val.toString(), 9));
    await tx.wait();
    return true;
  } catch (ex) {
    return false;
  }
}

export async function getClaimedAmount(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const claimedAmount = await presaleContract.claimedAmount(address);
    return Number(ethers.utils.formatUnits(claimedAmount, 9));
  } catch (ex) {
    console.log(ex);
    return 0;
  }
}

export async function getClaimable(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const claimable = await presaleContract.getClaimable();
    return claimable;
  } catch (ex) {
    return false;
  }
}

export async function getTimeToClaim(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const time = await presaleContract.getTimeForClaim(address);
    return time.toNumber();
  } catch (ex) {
    return 0;
  }
}

export async function getClaimInterval(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const time = await presaleContract.claimTime();
    return time;
  } catch (ex) {
    return 0;
  }
}

export async function doClaim(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      presale_abi,
      provider.getSigner(),
    );
    const tx = await presaleContract.claim();
    await tx.wait();
    return true;
  } catch (ex) {
    return false;
  }
}

export async function getMaxSupply(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const totalAmount = await presaleContract.totalAmount();
    return Number(ethers.utils.formatUnits(totalAmount, 9));
  } catch (ex) {
    return 0;
  }
}

export async function getTotalSold(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const totalSold = await presaleContract.sellAmount();
    return Number(ethers.utils.formatUnits(totalSold, 9));
  } catch (ex) {
    return 0;
  }
}

export async function getSaleTime(networkID: NetworkID, provider: StaticJsonRpcProvider, address: string) {
  try {
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
    const saleStartTime = Number(await presaleContract.saleStartTime());
    const privateSalePeriod = Number(await presaleContract.privateSalePeriod());
    const publicSalePeriod = Number(await presaleContract.publicSalePeriod());
    const whitelist = Number(await presaleContract.whiteListed[address]);
    return {
      startTime: saleStartTime,
      privateSale: privateSalePeriod,
      publicSale: publicSalePeriod,
      whitelist: whitelist,
    };
  } catch (ex) {
    return {};
  }
}

export async function getTotalRaised(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  try {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, dai_abi, provider);
    const totalAmount = await daiContract.balanceOf(addresses[networkID].PRESALE_ADDRESS as string);
    return Number(ethers.utils.formatEther(totalAmount));
  } catch (ex) {
    return 0;
  }
}
