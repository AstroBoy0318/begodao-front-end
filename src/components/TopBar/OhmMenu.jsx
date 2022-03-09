import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";

import "./ohmmenu.scss";
import { dai, ohm_dai } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import PIPImg from "src/assets/tokens/token_PIP.svg";
import SPIPImg from "src/assets/tokens/token_sPIP.svg";
import xPIPImg from "src/assets/tokens/token_sPIP.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sPIP logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "OHM") {

    // } ? PIPImg : SPIPImg;
    switch (tokenSymbol) {
      case "BEGO":
        tokenPath = PIPImg;
        break;
      case "xBEGO":
        tokenPath = xPIPImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      default:
        tokenPath = SPIPImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SBEGO_ADDRESS = addresses[networkID].SBEGO_ADDRESS;
  const BEGO_ADDRESS = addresses[networkID].BEGO_ADDRESS;
  const xBEGO_ADDRESS = addresses[networkID].XBEGO_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkID);
  const ohm_daiAddress = ohm_dai.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>BEGO</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://spookyswap.finance/swap?inputCurrency=${daiAddress}&outputCurrency=${BEGO_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on Spooky Swap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("BEGO", BEGO_ADDRESS)}>
                        <img src="bego.png" width={25} alt="bego-icon" />
                        <Typography variant="body1">BEGO</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("sBEGO", SBEGO_ADDRESS)}>
                        <img src="sbego.png" width={25} alt="bego-icon" />
                        <Typography variant="body1">sBEGO</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("xBEGO", xBEGO_ADDRESS)}>
                        <img src="sbego.png" width={25} alt="bego-icon" />
                        <Typography variant="body1">xBEGO</Typography>
                      </Button>
                    </Box>
                  </Box>
                ) : null}

                <Divider color="secondary" />
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default OhmMenu;
