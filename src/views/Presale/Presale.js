import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import "./presale.scss";
import { useWeb3Context } from "../../hooks";
import { isPresaleOpen } from "../../helpers/Presale";

function Presale() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  let modalButton = [];
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const getState = async () => {
      if (provider) {
        setIsOpened(isPresaleOpen(chainID, provider));
      }
    };
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
                <Typography variant="h6">Connect your wallet to buy BEGO</Typography>
              </div>
            ) : (
              <div>{isOpened ? <div>1111</div> : <Typography variant="h6">Presale is not opened yet.</Typography>}</div>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Presale;
