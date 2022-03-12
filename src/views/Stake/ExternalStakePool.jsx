import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Paper,
  Typography,
  Button,
  SvgIcon,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Zoom,
  Tab,
  Tabs,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import BondLogo from "../../components/BondLogo";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/BEGO-DAI.svg";
import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { formatCurrency, formatWithString, trim } from "../../helpers";
import TabPanel from "../../components/TabPanel";
import {
  compound,
  formatDecimal,
  getFarmsDetail,
  getTokenBalance,
  stakeToken,
  tokenApprove,
  withdrawToken,
} from "../../helpers/Farms";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ExternalStakePool(param) {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const [view, setView] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [stakeValue, setStakeValue] = useState({});
  const [withdrawValue, setWithdrawValue] = useState({});
  const [pending, setPending] = useState(false);

  const ohmLusdReserveBalance = useSelector(state => {
    return state.account && state.account.bonds?.ohm_lusd_lp?.balance;
  });

  const stakeHandler = async (id, decimals) => {
    setPending(true);
    if (await stakeToken(chainID, provider, id, stakeValue[id], decimals)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const claimHandler = async id => {
    setPending(true);
    if (await stakeToken(chainID, provider, id, 0, 18)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const withdrawHandler = async (id, decimals) => {
    setPending(true);
    if (await withdrawToken(chainID, provider, id, withdrawValue[id], decimals)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const changeView = (event, newView) => {
    setView(newView);
  };

  const [farmConfig, setFarmConfig] = useState([]);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (provider && connected) {
      updateFarmConfig();
    }
  }, [provider, connected, address]);

  const changeStakeValue = (id, value) => {
    let oldStakeValue = JSON.parse(JSON.stringify(stakeValue));
    // oldStakeValue[id] = formatDecimal(value, 10);
    oldStakeValue[id] = value;
    setStakeValue(oldStakeValue);
  };

  const setStakeMax = async (id, token, idx) => {
    const bal = await getTokenBalance(provider, farmConfig[idx].token, address);
    changeStakeValue(id, bal.toString());
  };

  const changeWithdrawValue = (id, value) => {
    let oldWithdrawValue = JSON.parse(JSON.stringify(withdrawValue));
    oldWithdrawValue[id] = value;
    setWithdrawValue(oldWithdrawValue);
  };

  const approve = async idx => {
    setPending(true);
    if (await tokenApprove(chainID, provider, farmConfig[idx].token)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const compoundHandler = async id => {
    setPending(true);
    if (await compound(chainID, provider, id, address)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const updateFarmConfig = () => {
    getFarmsDetail(chainID, provider, address).then(re => {
      setFarmConfig(re);
      console.log("farms", re);
    });
    const updateInfo = param.updateInfo;
    updateInfo();
  };

  const renderFarmRow = (el, idx) => {
    return (
      <>
        <TableRow className="bordered-row">
          <TableCell>
            <Box className="ohm-pairs">
              <Box minWidth={64} display="flex" justifyContent="center">
                <img src={`tokens/${el.image}`} />
              </Box>
              <Typography>{el.name}</Typography>
            </Box>
          </TableCell>
          <TableCell align="left">
            {el.apy === 0 ? <Skeleton width="80px" /> : formatWithString(el.apy) + "%"}
          </TableCell>
          <TableCell align="left">
            {`${el.toShowUsd ? formatCurrency(el.tvl, 3) : formatDecimal(el.tvl, 10)}`}
          </TableCell>
          <TableCell align="left">{el.depositFee / 100}%</TableCell>
          <TableCell align="left">
            {el.stakedBalance === 0 ? (
              <Skeleton width="80px" />
            ) : Number(el.stakedBalance) > 0.000001 ? (
              formatDecimal(Number(el.stakedBalance), 10)
            ) : (
              el.stakedBalance
            )}
          </TableCell>
          <TableCell align="left">
            {el.pendingReward === 0 ? (
              <Skeleton width="80px" />
            ) : Number(el.pendingReward) > 0.000001 ? (
              formatDecimal(Number(el.pendingReward), 10)
            ) : (
              el.pendingReward
            )}
          </TableCell>
          <TableCell align="left">
            {el.allocPoint === 0 ? <Skeleton width="80px" /> : `${el.allocPoint / 100}x`}
          </TableCell>
        </TableRow>
        {el.allowance === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              <Box display="flex" justifyContent="center">
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => approve(idx)}
                  className="approve-button"
                >
                  <Typography variant="body1">Approve</Typography>
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={2}>
              <Box display="flex" justifyContent="center">
                <OutlinedInput
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={stakeValue[el.id]}
                  onChange={e => changeStakeValue(el.id, e.target.value)}
                  labelWidth={0}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="text" onClick={() => setStakeMax(el.id, el.token, idx)} color="inherit">
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => stakeHandler(el.id, el.decimals)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Deposit</Typography>
                </Button>
              </Box>
            </TableCell>
            <TableCell colSpan={2}>
              <Box display="flex" justifyContent="center">
                <OutlinedInput
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={withdrawValue[el.id]}
                  onChange={e => changeWithdrawValue(el.id, e.target.value)}
                  labelWidth={0}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        variant="text"
                        onClick={() => changeWithdrawValue(el.id, el.stakedBalance)}
                        color="inherit"
                      >
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => withdrawHandler(el.id, el.decimals)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Withdraw</Typography>
                </Button>
              </Box>
            </TableCell>
            <TableCell colSpan={3}>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gridGap="10px">
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => claimHandler(el.id)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Claim Rewards</Typography>
                </Button>
                {el.canCompound && (
                  <Button
                    disabled={pending}
                    variant="outlined"
                    color="secondary"
                    onClick={() => compoundHandler(el.id)}
                    className="stake-lp-button"
                  >
                    <Typography variant="body1">Compound</Typography>
                  </Button>
                )}
              </Box>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Zoom in={true}>
      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-content">
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
            <Tab label="LPs" {...a11yProps(0)} />
            <Tab label="Pools" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={view} index={0} className="stake-tab-panel">
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="left">APY</TableCell>
                    <TableCell align="left">TVL</TableCell>
                    <TableCell align="left">Deposit Fee</TableCell>
                    <TableCell align="left">Staked</TableCell>
                    <TableCell align="left">Rewards</TableCell>
                    <TableCell align="left">Multipler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {farmConfig
                    // .filter(el => el.isLP)
                    .map((el, idx) => el.isLP && renderFarmRow(el, idx))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={view} index={1} className="stake-tab-panel">
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="left">APY</TableCell>
                    <TableCell align="left">TVL</TableCell>
                    <TableCell align="left">Deposit Fee</TableCell>
                    <TableCell align="left">Staked</TableCell>
                    <TableCell align="left">Rewards</TableCell>
                    <TableCell align="left">Multipler</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {farmConfig
                    // .filter(el => el.isLP)
                    .map((el, idx) => !el.isLP && renderFarmRow(el, idx))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </div>
      </Paper>
    </Zoom>
  );
}
