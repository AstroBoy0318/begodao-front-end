import { Box, Container, Paper, Typography, useMediaQuery } from "@material-ui/core";
import { formatCurrency } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { useState, useEffect } from "react";
import ExternalStakePool from "../Stake/ExternalStakePool";
import "./farms.scss";
import { useWeb3Context } from "../../hooks";
import { getLockedXbego, getRewardPerSec, getXbegoMaxSupply, getXbegoTotalSupply } from "../../helpers/Farms";
import { getTokenPrice } from "../../helpers/GetPrice";
import { addresses } from "../../constants";

function Farms() {
  const [marketCap, setMarketCap] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [circSupply, setCircSupply] = useState(0);
  const [lockedBal, setLockedBal] = useState(0);
  const [rewardPerSec, setRewardPerSec] = useState(0);
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  useEffect(() => {
    if (provider && connected) {
      updateInfo();
    }
  }, [provider, connected, address]);
  const updateInfo = () => {
    getTokenPrice(chainID, provider, addresses[chainID].XBEGO_ADDRESS).then(price => {
      setMarketPrice(price);
      getXbegoTotalSupply(chainID, provider).then(re => {
        setTotalSupply(re);
        setMarketCap(re * price);
      });
    });
    getXbegoMaxSupply(chainID, provider).then(re => {
      setMaxSupply(re);
    });
    getLockedXbego(chainID, provider).then(re => {
      setLockedBal(re);
    });
    getRewardPerSec(chainID, provider).then(re => {
      setRewardPerSec(re);
    });
  };
  return (
    <div id="farm-dashboard" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-around" alignItems="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box className="metric market" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Market Cap
                  </Typography>
                  <Typography variant="h5">
                    {marketCap ? formatCurrency(marketCap, 0) : <Skeleton type="text" />}
                  </Typography>
                </Box>

                <Box className="metric market" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Circulating Supply(total)
                  </Typography>
                  <Typography variant="h5">
                    {totalSupply ? (
                      `${Math.floor(totalSupply - lockedBal)}/${Math.floor(totalSupply)}`
                    ) : (
                      <Skeleton type="text" />
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <Box className="metric price" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    xBEGO Price
                  </Typography>
                  <Typography variant="h5">
                    {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}
                  </Typography>
                </Box>
                <Box className="metric price" textAlign="center"></Box>
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <Box className="metric price" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Max Supply
                  </Typography>
                  <Typography variant="h5">{maxSupply ? Math.floor(maxSupply) : <Skeleton type="text" />}</Typography>
                </Box>
                <Box className="metric price" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Reward per Sec
                  </Typography>
                  <Typography variant="h5">{rewardPerSec ? rewardPerSec : <Skeleton type="text" />}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
          <div>
            <ExternalStakePool updateInfo={updateInfo} />
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default Farms;
