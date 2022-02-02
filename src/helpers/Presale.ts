import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import { abi as presale_abi } from "../abi/Presale.json";
import { ethers } from "ethers";
import { addresses } from "../constants";

export async function isPresaleOpen(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presale_abi, provider);
  const isOpened = await presaleContract.openIdo();
  return isOpened;
}
