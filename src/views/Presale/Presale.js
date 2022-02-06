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
  const getState = async () => {
    if (provider && connected && address) {
      setIsOpened(await isPresaleOpen(chainID, provider, address));
      setPurchasedAmount(await getPurchased(chainID, provider, address));
      setPrice(await getPrice(chainID, provider, address));
      setApproval(await getDaiApproval(chainID, provider, address));
      setDaiBalance(await getDaiBalance(chainID, provider, address));
      setMaxAmount(await getMaxAmount(chainID, provider, address));
      setClaimedAmount(await getClaimedAmount(chainID, provider, address));
      setClaimable(await getClaimable(chainID, provider));
      setTimeToClaim(await getTimeToClaim(chainID, provider, address));
      setClaimInterval(await getClaimInterval(chainID, provider));
      const nextClaim = new Date(new Date().getTime() + timeToClaim * 1000);
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
  }, [provider, address, connected, chainID]);

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );
  return (
    <Paper className={`ohm-card`} id="presale-card">
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className="card-header">
            <Typography variant="h5">Buy Bego</Typography>
          </div>
          <div className="data-row">
            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">Connect your wallet to buy pBego or claim BEGO</Typography>
              </div>
            ) : (
              <div>
                {isOpened ? (
                  Number(purchasedAmount) > 0 ? (
                    <Typography variant="h6" align="center">
                      You have already purchased.
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
                      <Typography variant="h6" align="center">
                        {price} dai per 1 pBego.(Your dai balance: {daiBalance})
                      </Typography>
                    </div>
                  )
                ) : claimable ? (
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
                ) : (
                  <Typography variant="h6">
                    {Number(purchasedAmount) === 0
                      ? "Presale is not available now."
                      : `You've already purchased ${purchasedAmount} Bego.`}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Presale;
