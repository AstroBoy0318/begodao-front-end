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
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import BondLogo from "../../components/BondLogo";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/BEGO-DAI.svg";
import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim } from "../../helpers";
import TabPanel from "../../components/TabPanel";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const [view, setView] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const ohmLusdReserveBalance = useSelector(state => {
    return state.account && state.account.bonds?.ohm_lusd_lp?.balance;
  });

  const stakeHandler = () => {};
  const changeView = (event, newView) => {
    setView(newView);
  };

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

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  // useEffect(() => {
  //   // don't load ANY details until wallet is Checked
  //   if (walletChecked) {
  //     loadLusdData();
  //   }
  // }, [walletChecked]);

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
            <Tab label="Farms" {...a11yProps(0)} />
            <Tab label="Pools" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={view} index={0} className="stake-tab-panel">
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="left">APY</TableCell>
                    <TableCell align="left">TVD</TableCell>
                    <TableCell align="left">Deposit Fee</TableCell>
                    <TableCell align="left">Balance</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        <BondLogo bond={{ bondIconSvg: OhmLusdImg, isLP: true }}></BondLogo>
                        <Typography>BEGO-DAI</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      235%
                      {/*{isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : lusdData.apy === 0 ? (
                        "Coming Soon"
                      ) : (
                        trim(lusdData.apy, 1) + "%"
                      )}*/}
                    </TableCell>
                    <TableCell align="left">
                      $0
                      {/*{isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : (
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(lusdData.tvl)
                      )}*/}
                    </TableCell>
                    <TableCell align="left">
                      0
                      {/*{isLusdLoading ? <Skeleton width="80px" /> : (trim(ohmLusdReserveBalance, 2) || 0) + " SLP"}*/}
                    </TableCell>
                    <TableCell align="left">4%</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="space-around">
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Stake</Typography>
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Withdraw</Typography>
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Claim</Typography>
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
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
                    <TableCell align="left">TVD</TableCell>
                    <TableCell align="left">Deposit Fee</TableCell>
                    <TableCell align="left">Balance</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        <BondLogo bond={{ bondIconSvg: DaiImg, isLP: true }}></BondLogo>
                        <Typography>DAI</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      235%
                      {/*{isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : lusdData.apy === 0 ? (
                        "Coming Soon"
                      ) : (
                        trim(lusdData.apy, 1) + "%"
                      )}*/}
                    </TableCell>
                    <TableCell align="left">
                      $0
                      {/*{isLusdLoading ? (
                        <Skeleton width="80px" />
                      ) : (
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(lusdData.tvl)
                      )}*/}
                    </TableCell>
                    <TableCell align="left">
                      0
                      {/*{isLusdLoading ? <Skeleton width="80px" /> : (trim(ohmLusdReserveBalance, 2) || 0) + " SLP"}*/}
                    </TableCell>
                    <TableCell align="left">4%</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="space-around">
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Stake</Typography>
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Withdraw</Typography>
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={stakeHandler} className="stake-lp-button">
                          <Typography variant="body1">Claim</Typography>
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </div>
      </Paper>
    </Zoom>
  );
}
