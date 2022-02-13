import React, { useEffect, useState } from "react";
import { Button, Grid, InputAdornment, OutlinedInput, Paper, Typography } from "@material-ui/core";
import "./presale.scss";
import { useWeb3Context } from "../../hooks";
import {
  isPresaleOpen,
  getPurchased,
  getPrice,
  getDaiApproval,
  daiApprove,
  doPurchase,
  getDaiBalance,
  getMaxAmount,
  getClaimedAmount,
  getClaimable,
  doClaim,
  getTimeToClaim,
  getClaimInterval,
  getMaxSupply,
  getTotalSold,
  getSaleTime,
  getTotalRaised,
} from "../../helpers/Presale";

function Presale() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  let modalButton = [];
  const [isOpened, setIsOpened] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(false);
  const [price, setPrice] = useState(0);
  const [approval, setApproval] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const [claimable, setClaimable] = useState(false);
  const [timeToClaim, setTimeToClaim] = useState(0);
  const [nextClaimDate, setNextClaimDate] = useState("");
  const [claimInterval, setClaimInterval] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [saleTime, setSaleTime] = useState({});
  const [saleDiscount, setSaleDiscount] = useState("");
  const [totalRaised, setTotalRaised] = useState(0);
  const getState = async () => {
    if (provider && connected && address) {
      isPresaleOpen(chainID, provider, address).then(re => {
        setIsOpened(re);
      });
      getPurchased(chainID, provider, address).then(re => {
        setPurchasedAmount(re);
      });
      getPrice(chainID, provider, address).then(re => {
        setPrice(re);
      });
      getDaiApproval(chainID, provider, address).then(re => {
        setApproval(re);
      });
      getDaiBalance(chainID, provider, address).then(re => {
        setDaiBalance(re);
      });
      getMaxAmount(chainID, provider, address).then(re => {
        setMaxAmount(re);
      });
      getClaimedAmount(chainID, provider, address).then(re => {
        setClaimedAmount(re);
      });
      getClaimable(chainID, provider).then(re => {
        setClaimable(re);
      });
      getMaxSupply(chainID, provider).then(re => {
        setMaxSupply(re);
      });
      getTotalSold(chainID, provider).then(re => {
        setTotalSold(re);
      });
      getTotalRaised(chainID, provider).then(re => {
        setTotalRaised(re);
      });
      const _timeToClaim = await getTimeToClaim(chainID, provider, address);
      setTimeToClaim(_timeToClaim);
      getClaimInterval(chainID, provider).then(re => {
        setClaimInterval(re);
      });
      const nextClaim = new Date(new Date().getTime() + _timeToClaim * 1000);
      setNextClaimDate(nextClaim.toLocaleString());
    }
  };
  const [pending, setPending] = useState(false);
  const handlePurchase = () => {
    setPending(true);
    if (Number(approval) > 0) {
      if (quantity === 0) {
        setPending(false);
        return;
      } else if (quantity > maxAmount) {
        setPending(false);
        setQuantity(maxAmount);
        return;
      }
      doPurchase(chainID, provider, quantity).then(async re => {
        if (re) {
          getState();
        }
        setPending(false);
      });
    } else {
      daiApprove(chainID, provider).then(async re => {
        if (re) {
          getState();
        }
        setPending(false);
      });
    }
  };
  const setMax = () => {
    setQuantity(maxAmount);
  };
  const handleClaim = () => {
    setPending(true);
    doClaim(chainID, provider).then(re => {
      if (re) {
        getState();
      }
      setPending(false);
    });
  };

  useEffect(() => {
    getState();
    getSaleTime(chainID, provider, address).then(re => {
      setSaleTime(re);
    });
  }, [provider, address, connected, chainID]);

  const getFormatedTimeString = time => {
    let val = time;
    let re = "";
    if (val >= 86400) {
      re = re.concat(Math.floor(val / 86400)).concat("Day(s) ");
      val = val % 86400;
    }
    if (val >= 3600) {
      re = re.concat(Math.floor(val / 3600)).concat("Hour(s) ");
      val = val % 3600;
    }
    if (val >= 60) {
      re = re.concat(Math.floor(val / 60)).concat("Minute(s) ");
      val = val % 60;
    }
    re = re.concat(val).concat("second(s)");
    return re;
  };

  setInterval(() => {
    if (saleTime.startTime) {
      const now = Math.floor(new Date().getTime() / 1000);
      if (saleTime.startTime + saleTime.privateSale > now) {
        const remainedTime = saleTime.startTime + saleTime.privateSale - now;
        setSaleDiscount(`Private sale ends in ${getFormatedTimeString(remainedTime)}.`);
      } else if (saleTime.startTime + saleTime.privateSale + saleTime.publicSale > now) {
        const remainedTime = saleTime.startTime + saleTime.privateSale + saleTime.publicSale - now;
        setSaleDiscount(`Public sale ends in ${getFormatedTimeString(remainedTime)}.`);
      } else if (saleTime.startTime > 0) setSaleDiscount("Presale is finished.");
    }
  }, 1000);

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );
  return (
    <Paper className={`ohm-card`} id="presale-card">
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div class="header">
            <div>
              <Typography variant="h5">Max Supply</Typography>
              <Typography variant="h6">{maxSupply.toLocaleString()}</Typography>
            </div>
            <div>
              <Typography variant="h5">Total Raised(dai)</Typography>
              <Typography variant="h6">{totalRaised.toLocaleString()}</Typography>
            </div>
            <div>
              <Typography variant="h5">Total Sold</Typography>
              <Typography variant="h6">{totalSold.toLocaleString()}</Typography>
            </div>
          </div>
          <div className="data-row">
            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">Connect your wallet to buy or claim BEGO</Typography>
              </div>
            ) : (
              <div>
                {isOpened ? (
                  Number(purchasedAmount) > 0 && maxAmount === 0 ? (
                    <Typography variant="h6" align="center">
                      You can't purchase anymore.
                    </Typography>
                  ) : (
                    <div className="purchase-card">
                      <div className="purchase-input-area">
                        {approval > 0 && (
                          <OutlinedInput
                            id="amount-input"
                            type="number"
                            placeholder="Enter an amount"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            labelWidth={0}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button variant="text" onClick={setMax} color="inherit">
                                  Max
                                </Button>
                              </InputAdornment>
                            }
                          />
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          className="purchase-button"
                          onClick={handlePurchase}
                          key={1}
                          disabled={pending}
                        >
                          {approval > 0 ? "Purchase Bego" : "Approve"}
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  claimable && (
                    <div className="purchase-card">
                      <Button
                        variant="contained"
                        onClick={handleClaim}
                        color="primary"
                        disabled={pending || timeToClaim > 0}
                      >
                        {timeToClaim > 0 ? `Next claim time is ${nextClaimDate}` : "Claim"}
                      </Button>
                      <Typography variant="h6">Your claimable amount is {purchasedAmount - claimedAmount}.</Typography>
                    </div>
                  )
                )}
                <div>
                  <Typography variant="h6" align="center">
                    Bego price: {price} Dai.
                  </Typography>
                  <Typography variant="h6" align="center">
                    Your dai balance: {daiBalance.toLocaleString(undefined, { maximumFractionDigits: 3 })} Dai
                  </Typography>
                  <Typography variant="h6" align="center">
                    {Number(purchasedAmount) > 0 && `You have purchased ${purchasedAmount} Bego.`}
                  </Typography>
                  <Typography variant="h6" align="center">
                    {saleDiscount}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Presale;
