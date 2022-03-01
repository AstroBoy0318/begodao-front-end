import { Box, Container, Paper, Typography, useMediaQuery } from "@material-ui/core";
import { formatCurrency } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { useState } from "react";
import ExternalStakePool from "../Stake/ExternalStakePool";
import "./farms.scss";

function Farms() {
  const [marketCap, setMarketCap] = useState(1);
  const [marketPrice, setMarketPrice] = useState(1);
  const [maxSupply, setMaxSupply] = useState(1);
  const [circSupply, setCircSupply] = useState(1);
  const [rewardPerSec, setRewardPerSec] = useState(1);
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
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
                    {marketCap && formatCurrency(marketCap, 0)}
                    {!marketCap && <Skeleton type="text" />}
                  </Typography>
                </Box>

                <Box className="metric market" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Circulating Supply(total)
                  </Typography>
                  <Typography variant="h5">
                    {circSupply ? formatCurrency(circSupply, 0) : <Skeleton type="text" />}
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
                  <Typography variant="h5">
                    {maxSupply ? formatCurrency(maxSupply, 0) : <Skeleton type="text" />}
                  </Typography>
                </Box>
                <Box className="metric price" textAlign="center">
                  <Typography variant="h6" color="textSecondary">
                    Reward per Sec
                  </Typography>
                  <Typography variant="h5">
                    {rewardPerSec ? formatCurrency(rewardPerSec, 3) : <Skeleton type="text" />}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
          <div>
            <ExternalStakePool />
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default Farms;
