import { NetworkID } from "../lib/Bond";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { abi as masterchefAbi } from "../abi/Masterchef.json";
import { abi as erc20 } from "../abi/IERC20.json";
import { abi as xBegoAbi } from "../abi/xBegoToken.json";
import { ethers } from "ethers";
import { addresses, farms, SECONDS_PER_YEAR } from "../constants";
import { getLPTokenPrice, getTokenPrice } from "./GetPrice";

export async function getFarmsDetail(networkID: NetworkID, provider: StaticJsonRpcProvider, userAddress: string) {
  const masterchefContract = new ethers.Contract(
    addresses[networkID].MASTERCHEF_ADDRESS as string,
    masterchefAbi,
    provider,
  );
  const xBegoContract = new ethers.Contract(addresses[networkID].XBEGO_ADDRESS as string, erc20, provider);
  const xBegoDecimals = Number(await xBegoContract.decimals());
  const xBegoPrice = await getTokenPrice(networkID, provider, addresses[networkID].XBEGO_ADDRESS);
  const isStarted = Number(await masterchefContract.startTime()) < new Date().getTime() / 1000;
  const xBegoPerSec = Number(ethers.utils.formatUnits(await masterchefContract.xbegoPerSec(), xBegoDecimals));
  const xBegoPerYear = xBegoPerSec * SECONDS_PER_YEAR * xBegoPrice;
  const totalAllocPoint = Number(await masterchefContract.totalAllocPoint());
  const farmDetails = await Promise.all(
    farms[networkID].map(async el => {
      const poolInfo = await masterchefContract.poolInfo(el.id);
      const token = poolInfo.lpToken;
      const tokenContract = new ethers.Contract(token, erc20, provider);
      const allocPoint = Number(poolInfo.allocPoint);
      const depositFee = Number(poolInfo.depositFeeBP);
      const tokenDecimals = Number(await tokenContract.decimals());
      const totalStaked = Number(
        ethers.utils.formatUnits(await tokenContract.balanceOf(addresses[networkID].MASTERCHEF_ADDRESS), tokenDecimals),
      );
      const depositTokenPrice = el.isLP
        ? await getLPTokenPrice(networkID, provider, token)
        : await getTokenPrice(networkID, provider, token);
      const totalValue = totalStaked > 0 ? totalStaked * depositTokenPrice : 0;
      const rewardPerYear = (xBegoPerYear * allocPoint) / totalAllocPoint;
      const apy = totalValue > 0 && isStarted ? (rewardPerYear / (totalValue / 3)) * 100 : 0;
      const userInfo = userAddress ? await masterchefContract.userInfo(el.id, userAddress) : null;
      const stakedBalance = userAddress ? Number(ethers.utils.formatUnits(userInfo.amount, tokenDecimals)) : 0;
      const pendingReward = userAddress
        ? Number(ethers.utils.formatUnits(await masterchefContract.pendingxbego(el.id, userAddress)))
        : 0;
      const allowance = userAddress
        ? Number(
            ethers.utils.formatUnits(
              await xBegoContract.allowance(userAddress, addresses[networkID].MASTERCHEF_ADDRESS),
              xBegoDecimals,
            ),
          )
        : 0;
      return {
        ...el,
        token: token,
        allocPoint: allocPoint,
        depositFee: depositFee,
        apy: apy,
        tvl: totalStaked,
        stakedBalance: stakedBalance,
        pendingReward: pendingReward,
        allowance: allowance,
      };
    }),
  );
  return farmDetails;
}

export async function getXbegoTotalSupply(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const xBegoContract = new ethers.Contract(addresses[networkID].XBEGO_ADDRESS as string, erc20, provider);
  const xBegoDecimals = Number(await xBegoContract.decimals());
  const totalSupply = Number(ethers.utils.formatUnits(await xBegoContract.totalSupply(), xBegoDecimals));
  return totalSupply;
}

export async function getLockedXbego(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const xBegoContract = new ethers.Contract(addresses[networkID].XBEGO_ADDRESS as string, erc20, provider);
  const xBegoDecimals = Number(await xBegoContract.decimals());
  const lockedBal = Number(
    ethers.utils.formatUnits(await xBegoContract.balanceOf(addresses[networkID].MASTERCHEF_ADDRESS), xBegoDecimals),
  );
  return lockedBal;
}

export async function getXbegoMaxSupply(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const xBegoContract = new ethers.Contract(addresses[networkID].XBEGO_ADDRESS as string, xBegoAbi, provider);
  const xBegoDecimals = Number(await xBegoContract.decimals());
  const maxSupply = Number(ethers.utils.formatUnits(await xBegoContract.maxSupply(), xBegoDecimals));
  return maxSupply;
}

export async function getRewardPerSec(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const masterchefContract = new ethers.Contract(
    addresses[networkID].MASTERCHEF_ADDRESS as string,
    masterchefAbi,
    provider,
  );
  const xBegoContract = new ethers.Contract(addresses[networkID].XBEGO_ADDRESS as string, erc20, provider);
  const xBegoDecimals = Number(await xBegoContract.decimals());
  const rewardPerSec = Number(ethers.utils.formatUnits(await masterchefContract.xbegoPerSec(), xBegoDecimals));
  return rewardPerSec;
}
