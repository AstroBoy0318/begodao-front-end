import { BigNumber, ethers } from "ethers";
import { addresses, API_URL } from "../constants";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sPIPv2 } from "../abi/sOhmv2.json";
import { abi as Bego } from "../abi/Bego.json";
import { abi as ERC20 } from "../abi/IERC20.json";
import { setAll, getMarketPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { allBonds } from "src/helpers/AllBonds";
import { getTokenPrice, getLPTokenPrice } from "src/helpers/GetPrice";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }
    const begoMainContract = new ethers.Contract(addresses[networkID].BEGO_ADDRESS as string, Bego, provider);
    const stakingBalance = await begoMainContract.balanceOf(addresses[networkID].STAKING_ADDRESS as string);
    const decimals = await begoMainContract.decimals();
    const stakingTVL = parseFloat(ethers.utils.formatUnits(stakingBalance, decimals).toString()) * marketPrice;
    let totalSupply = await begoMainContract.totalSupply();
    totalSupply = parseFloat(ethers.utils.formatUnits(totalSupply, decimals).toString());
    const marketCap = marketPrice * totalSupply;
    const circSupply = totalSupply - stakingTVL;
    let treasuryMarketValue = 0;
    let currentTreasuryValue: ITreasuryValue = { timestamp: new Date().getTime() / 1000 };
    for (let i = 0; i < allBonds.length; i++) {
      const tokenContract = new ethers.Contract(
        allBonds[i]["networkAddrs"][networkID].reserveAddress as string,
        ERC20,
        provider,
      );
      console.log(tokenContract);
      let treasuryBalance = await tokenContract.balanceOf(addresses[networkID].TREASURY_ADDRESS as string);
      const daiDecimals = await tokenContract.decimals();
      treasuryBalance = ethers.utils.formatUnits(treasuryBalance, daiDecimals);
      let tokenPrice = 0;
      if (allBonds[i].name.endsWith("lp")) {
        tokenPrice = await getLPTokenPrice(networkID, provider, allBonds[i]["networkAddrs"][networkID].reserveAddress);
      } else {
        tokenPrice = await getTokenPrice(networkID, provider, allBonds[i]["networkAddrs"][networkID].reserveAddress);
      }
      treasuryMarketValue += treasuryBalance * tokenPrice;
      currentTreasuryValue[`value${i + 1}` as keyof ITreasuryValue] = treasuryBalance * tokenPrice;
    }
    currentTreasuryValue.totalvalue = treasuryMarketValue;
    // const currentBlock = parseFloat(graphData.data._meta.block.number);

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        treasuryMarketValue,
      };
    }

    const currentBlock = await provider.getBlockNumber();

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2,
      provider,
    );
    const sohmMainContract = new ethers.Contract(addresses[networkID].SBEGO_ADDRESS as string, sPIPv2, provider);

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await sohmMainContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // Current index
    const currentIndex = await stakingContract.index();

    // Dashboard data
    let dashboardData = await dispatch(loadDashboardDetails()).unwrap();
    dashboardData.totalDeposited.splice(0, 0, { amount: stakingTVL, timestamp: new Date().getTime() / 1000 });
    dashboardData.treasuryValue.splice(0, 0, currentTreasuryValue);

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
      dashboardData,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice / Math.pow(10, 9);
  } catch (e) {
    marketPrice = await getTokenPrice(networkID, provider, addresses[networkID].BEGO_ADDRESS);
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly dashboardData?: object;
}
interface ITreasuryValue {
  timestamp: number;
  value1?: number;
  value2?: number;
  value3?: number;
  value4?: number;
  value5?: number;
  value6?: number;
  value7?: number;
  value8?: number;
  value9?: number;
  value10?: number;
  totalvalue?: number;
}

export const loadDashboardDetails = createAsyncThunk("app/loadDashboardDetails", async () => {
  const depositedResult = await fetch(`${API_URL}/getTotalDeposited`);
  const depositedData = await depositedResult.json();
  const treasuryValueResult = await fetch(`${API_URL}/getTreasuryValue`);
  const treasuryValueData = await treasuryValueResult.json();
  return { totalDeposited: depositedData, treasuryValue: treasuryValueData };
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
