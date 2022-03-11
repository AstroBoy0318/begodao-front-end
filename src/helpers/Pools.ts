import { NetworkID } from "../lib/Bond";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { abi as poolAbi } from "../abi/StakingPool.json";
import { abi as dai_abi, abi as erc20 } from "../abi/IERC20.json";
import { abi as xBegoAbi } from "../abi/xBegoToken.json";
import { ethers } from "ethers";
import { addresses, pools, SECONDS_PER_YEAR } from "../constants";
import { getLPTokenPrice, getTokenPrice } from "./GetPrice";

export async function getPoolsDetail(networkID: NetworkID, provider: StaticJsonRpcProvider, userAddress: string) {
  const poolDetails = await Promise.all(
    pools[networkID].map(async el => {
      const poolContract = new ethers.Contract(el.address as string, poolAbi, provider);
      const stakeToken = await poolContract.stakeToken();
      const stakeTokenContract = new ethers.Contract(stakeToken, erc20, provider);
      const stakeTokenDecimals = Number(await stakeTokenContract.decimals());
      const stakeTokenPrice = el.isLP
        ? await getLPTokenPrice(networkID, provider, stakeToken)
        : await getTokenPrice(networkID, provider, stakeToken);
      const isStarted = Number(await poolContract.startTime()) < new Date().getTime() / 1000;
      const rewardToken = await poolContract.rewardToken();
      const rewardTokenContract = new ethers.Contract(rewardToken, erc20, provider);
      const rewardTokenDecimals = Number(await rewardTokenContract.decimals());
      const rewardPerTime = Number(ethers.utils.formatUnits(await poolContract.rewardPerTime(), rewardTokenDecimals));
      const rewardTokenPrice = await getTokenPrice(networkID, provider, rewardToken);
      const rewardPerYear = rewardPerTime * SECONDS_PER_YEAR * rewardTokenPrice;
      const totalStaked = Number(
        ethers.utils.formatUnits(await stakeTokenContract.balanceOf(el.address), stakeTokenDecimals),
      );
      const totalValue = totalStaked > 0 ? totalStaked * stakeTokenPrice : 0;
      // const apy = totalValue > 0 && isStarted ? (rewardPerYear / (totalValue / 3)) * 100 : 0;
      const apy = totalValue > 0 ? (rewardPerYear / (totalValue / 3)) * 100 : 0;
      const userInfo = userAddress ? await poolContract.userInfo(userAddress) : null;
      const stakedBalance = userAddress ? ethers.utils.formatUnits(userInfo.amount, stakeTokenDecimals) : 0;
      const pendingReward = userAddress
        ? Number(ethers.utils.formatUnits(await poolContract.pendingReward(userAddress), rewardTokenDecimals))
        : 0;
      const remainedReward = Number(
        ethers.utils.formatUnits(await rewardTokenContract.balanceOf(el.address), rewardTokenDecimals),
      );
      const allowance = userAddress
        ? Number(
            ethers.utils.formatUnits(await stakeTokenContract.allowance(userAddress, el.address), stakeTokenDecimals),
          )
        : 0;
      return {
        ...el,
        decimals: stakeTokenDecimals,
        stakeToken: stakeToken,
        rewardToken: rewardToken,
        apy: apy,
        tvl: totalStaked,
        stakedBalance: stakedBalance,
        pendingReward: pendingReward,
        allowance: allowance,
        remainedReward: remainedReward,
      };
    }),
  );
  return poolDetails;
}

export async function tokenApprove(
  networkID: NetworkID,
  provider: StaticJsonRpcProvider,
  tokenAddress: string,
  targetAddress: string,
) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, dai_abi, provider.getSigner());
    const tx = await tokenContract.approve(targetAddress, "0xffffffffffffffffffffffffffffffffffff");
    await tx.wait();
    return true;
  } catch (ex) {
    return false;
  }
}

export async function stakeToken(
  networkID: NetworkID,
  provider: StaticJsonRpcProvider,
  address: string,
  amount: string,
  decimals: number,
) {
  try {
    const poolContract = new ethers.Contract(address, poolAbi, provider.getSigner());
    const tx = await poolContract.deposit(ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
    return true;
  } catch (ex) {
    return false;
  }
}

export async function withdrawToken(
  networkID: NetworkID,
  provider: StaticJsonRpcProvider,
  address: string,
  amount: string,
  decimals: number,
) {
  try {
    const poolContract = new ethers.Contract(address, poolAbi, provider.getSigner());
    const tx = await poolContract.withdraw(ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
    return true;
  } catch (ex) {
    return false;
  }
}
