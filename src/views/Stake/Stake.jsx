import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import {
  getOhmTokenImage,
  getTokenImage,
  getWarmupDate,
  trim,
  getWarmupDeposit,
  getWarmupRebase,
  formatWithString,
} from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sbego");
const ohmImg = getOhmTokenImage(16, 16);

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const pipBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sPIPBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const [warmupEndDate, setWarmupEndDate] = useState("");
  const [warmupDeposit, setWarmupDeposit] = useState(0);
  const [warmupReward, setWarmupReward] = useState(0);
  const [warmupRebase, setWarmupRebase] = useState(0);

  useEffect(() => {
    if (currentBlock) {
      getWarmupDate(chainID, provider, address, currentBlock).then(re => {
        setWarmupEndDate(re);
      });
      getWarmupRebase(chainID, provider, address).then(re => {
        setWarmupRebase(re);
      });
      getWarmupDeposit(chainID, provider, address).then(re => {
        setWarmupDeposit(re.deposit);
        setWarmupReward(re.reward);
      });
    }
  }, [connected, provider, chainID, address, currentBlock]);

  const setMax = () => {
    if (view === 0) {
      setQuantity(pipBalance);
    } else {
      setQuantity(sPIPBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (action !== "unlocking") {
      if (isNaN(quantity) || quantity === 0 || quantity === "") {
        // eslint-disable-next-line no-alert
        return dispatch(error("Please enter a value!"));
      }

      // 1st catch if quantity > balance
      let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
      if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(pipBalance, "gwei"))) {
        return dispatch(error("You cannot stake more than your BEGO balance."));
      }

      if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sPIPBalance, "gwei"))) {
        return dispatch(error("You cannot unstake more than your sBEGO balance."));
      }
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "bego") return stakeAllowance > 0;
      if (token === "sBEGO") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sPIPBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY =
    stakingAPY > 1000000
      ? formatWithString(stakingAPY)
      : new Intl.NumberFormat("en-US").format(trim(stakingAPY * 100, 1));
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />

                {address && oldSohmBalance > 0.01 && (
                  <Link
                    className="migrate-sohm-button"
                    style={{ textDecoration: "none" }}
                    href="https://docs.begoikodao.finance/using-the-website/migrate"
                    aria-label="migrate-sohm"
                    target="_blank"
                  >
                    <NewReleases viewBox="0 0 24 24" />
                    <Typography>Migrate sPIP!</Typography>
                  </Link>
                )}
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        APY
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? <>{trimmedStakingAPY}%</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        Total Value Deposited
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="h5" color="textSecondary">
                        Current Index
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? <>{trim(currentIndex, 1)} BEGO</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area" style={{ marginTop: 0 }}>
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake BEGO</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area" marginTop={0}>
                    {/*{warmupEndDate && (*/}
                    {/*  <Box className="stake-action-area" display="flex" alignItems="center" marginTop={0}>*/}
                    {/*    <Typography> You can't claim until {warmupEndDate}.</Typography>*/}
                    {/*  </Box>*/}
                    {/*)}*/}
                    {warmupRebase > 0 && (
                      <Box className="stake-action-area" display="flex" alignItems="center" marginTop={0}>
                        <Typography>* You can't claim until after {warmupRebase} rebase(s) *</Typography>
                      </Box>
                    )}
                    {warmupRebase <= 0 && !isAppLoading && warmupReward > 0 && (
                      <Box className="stake-action-area" display="flex" alignItems="center" marginTop={1}>
                        <Button
                          className="claim-button"
                          variant="outlined"
                          size="small"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "unlocking")}
                          onClick={() => {
                            onChangeStake("unlocking");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "unlocking", "Unblock Rewards")}
                        </Button>
                      </Box>
                    )}
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(1)} />
                    </Tabs>

                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("bego") && view === 0) || (!hasAllowance("sBEGO") && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  First time staking <b>BEGO</b>?
                                  <br />
                                  Please approve Begoiko Dao to use your <b>BEGO</b> for staking.
                                </>
                              ) : (
                                <>
                                  First time unstaking <b>sBEGO</b>?
                                  <br />
                                  Please approve Begoiko Dao to use your <b>sBEGO</b> for unstaking.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="ohm-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit">
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("bego") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "staking")}
                            onClick={() => {
                              onChangeStake("stake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake BEGO")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("bego");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("sBEGO") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", "Unstake sBEGO")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("sBEGO");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">Your Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(pipBalance, 4)} BEGO</>}
                      </Typography>
                    </div>
                    {warmupEndDate && (
                      <div className="data-row">
                        <Typography variant="body1">Your Warmup Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(warmupDeposit, 4)} BEGO</>}
                        </Typography>
                      </div>
                    )}
                    {warmupEndDate && (
                      <div className="data-row">
                        <Typography variant="body1">Your Warmup Reward</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(warmupReward, 4)} sBEGO</>}
                        </Typography>
                      </div>
                    )}
                    <div className="data-row">
                      <Typography variant="body1">Your Staked Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sBEGO</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">Next Reward Amount</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sBEGO</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">Next Reward Yield</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">ROI (5-Day Rate)</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>

      {/*<ExternalStakePool />*/}
    </div>
  );
}

export default Stake;
