import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";
import { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { getPoolsDetail, stakeToken, tokenApprove, withdrawToken } from "../../helpers/Pools";
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { trim } from "../../helpers";
import "./divends.scss";
import { formatDecimal, getTokenBalance } from "../../helpers/Farms";

export default function Divends() {
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const [stakeValue, setStakeValue] = useState({});
  const [withdrawValue, setWithdrawValue] = useState({});
  const [pending, setPending] = useState(false);

  const stakeHandler = async (id, decimals) => {
    setPending(true);
    if (await stakeToken(chainID, provider, poolConfig[id].address, stakeValue[id], decimals)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const claimHandler = async id => {
    setPending(true);
    if (await stakeToken(chainID, provider, poolConfig[id].address, 0, 18)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const withdrawHandler = async (id, decimals) => {
    setPending(true);
    if (await withdrawToken(chainID, provider, poolConfig[id].address, withdrawValue[id], decimals)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const [poolConfig, setPoolConfig] = useState([]);

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
    oldStakeValue[id] = formatDecimal(value, 10);
    setStakeValue(oldStakeValue);
  };

  const setStakeMax = async (token, idx) => {
    const bal = await getTokenBalance(provider, poolConfig[idx].stakeToken, address);
    changeStakeValue(idx, bal);
  };

  const changeWithdrawValue = (id, value) => {
    let oldWithdrawValue = JSON.parse(JSON.stringify(withdrawValue));
    oldWithdrawValue[id] = value;
    setWithdrawValue(oldWithdrawValue);
  };

  const approve = async idx => {
    setPending(true);
    if (await tokenApprove(chainID, provider, poolConfig[idx].stakeToken, poolConfig[idx].address)) {
      updateFarmConfig();
    }
    setPending(false);
  };

  const updateFarmConfig = () => {
    getPoolsDetail(chainID, provider, address).then(re => {
      setPoolConfig(re);
    });
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
              <Typography>{`${el.stake} for ${el.reward}`}</Typography>
            </Box>
          </TableCell>
          <TableCell align="left">{el.apy === 0 ? <Skeleton width="80px" /> : trim(el.apy, 1) + "%"}</TableCell>
          <TableCell align="left">{el.tvl.toFixed(2)}</TableCell>
          <TableCell align="left">{el.remainedReward.toFixed(4)}</TableCell>
          <TableCell align="left">
            {el.stakedBalance === 0 ? <Skeleton width="80px" /> : el.stakedBalance.toFixed(2)}
          </TableCell>
          <TableCell align="left">
            {el.pendingReward === 0 ? <Skeleton width="80px" /> : el.pendingReward.toFixed(4)}
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
                  value={stakeValue[idx]}
                  onChange={e => changeStakeValue(idx, e.target.value)}
                  labelWidth={0}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="text" onClick={() => setStakeMax(el.stakeToken, idx)} color="inherit">
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => stakeHandler(idx, el.decimals)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Stake</Typography>
                </Button>
              </Box>
            </TableCell>
            <TableCell colSpan={2}>
              <Box display="flex" justifyContent="center">
                <OutlinedInput
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={withdrawValue[idx]}
                  onChange={e => changeWithdrawValue(idx, e.target.value)}
                  labelWidth={0}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="text" onClick={() => changeWithdrawValue(idx, el.stakedBalance)} color="inherit">
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => withdrawHandler(idx, el.decimals)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Withdraw</Typography>
                </Button>
              </Box>
            </TableCell>
            <TableCell colSpan={2}>
              <Box display="flex" justifyContent="center">
                <Button
                  disabled={pending}
                  variant="outlined"
                  color="secondary"
                  onClick={() => claimHandler(idx)}
                  className="stake-lp-button"
                >
                  <Typography variant="body1">Claim</Typography>
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Zoom in={true}>
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        <Paper className={`ohm-card divends-container secondary ${isSmallScreen && "mobile"}`}>
          <Box display="flex" flexDirection="column" alignItems="center" gridGap="20px">
            <img src="favicon.png" width={250} />
            <Typography variant="h6" color="primary">
              You can get rewards by staking tokens.
            </Typography>
          </Box>
        </Paper>
        <Paper className={`ohm-card divends-container secondary ${isSmallScreen && "mobile"}`}>
          <div className="card-content">
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="left">APY</TableCell>
                    <TableCell align="left">TVL</TableCell>
                    <TableCell align="left">Remained</TableCell>
                    <TableCell align="left">Staked</TableCell>
                    <TableCell align="left">Reward</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{poolConfig.map((el, idx) => renderFarmRow(el, idx))}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      </Box>
    </Zoom>
  );
}
