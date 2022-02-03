import React from "react";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import "./nft.scss";
import { useWeb3Context } from "../../hooks";

function Presale() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );
  return (
    <Paper className={`ohm-card`} id="nft-card">
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <div className="card-header">
            <Typography variant="h5">NFTS</Typography>
          </div>
          <div className="data-row">
            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">Connect your wallet to buy NFTS</Typography>
              </div>
            ) : (
              <Typography variant="h5">Soon</Typography>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Presale;
