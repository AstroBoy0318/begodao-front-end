import { useCallback, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as PresaleIcon } from "../../assets/icons/presale.svg";
import { ReactComponent as RoadMapIcon } from "../../assets/icons/road-map.svg";
import { ReactComponent as NFTIcon } from "../../assets/icons/nft-icon.svg";
import { ReactComponent as UpArrow } from "../../assets/icons/up-arrow.svg";
import { ReactComponent as FarmIcon } from "../../assets/icons/farm-tractor.svg";
import { ReactComponent as UsdcIcon } from "../../assets/icons/usdc.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import Button from "@material-ui/core/Button";
import { OrderContext } from "../../context/OrderContext";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds, order, setOrder } = useBonds();
  const { chainID } = useWeb3Context();
  const changeOrder = () => {
    toggleValue();
  };
  const { bondOrder, toggleValue } = useContext(OrderContext);

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("roadmap") >= 0 && page === "roadmap") {
      return true;
    }
    if (currentPath.indexOf("presale") >= 0 && page === "presale") {
      return true;
    }
    if (currentPath.indexOf("nft") >= 0 && page === "nft") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if (currentPath.indexOf("farms") >= 0 && page === "farms") {
      return true;
    }
    if (currentPath.indexOf("dividends") >= 0 && page === "dividends") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://app.begodao.com" target="_blank">
              <img src="favicon.png" alt="icon" width={64} />
              <h2>Begoiko Dao</h2>
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://ftmscan.com/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="presale-nav"
                to="/presale"
                isActive={(match, location) => {
                  return checkPage(match, location, "presale");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={PresaleIcon} viewBox="0 0 28 28" />
                  Presale
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="roadmap-nav"
                to="/roadmap"
                isActive={(match, location) => {
                  return checkPage(match, location, "roadmap");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={RoadMapIcon} viewBox="0 0 122.88 120.98" />
                  RoadMap
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={DashboardIcon} />
                  Dashboard
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={StakeIcon} />
                  Stake
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="farms-nav"
                to="/farms"
                isActive={(match, location) => {
                  return checkPage(match, location, "farms");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={FarmIcon} viewBox="0 0 122.88 95.45" />
                  Farms
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="divends-nav"
                to="/dividends"
                isActive={(match, location) => {
                  return checkPage(match, location, "dividends");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={UsdcIcon} viewBox="0 0 2000 2000" />
                  Dividends
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="nft-nav"
                to="/nfts"
                isActive={(match, location) => {
                  return checkPage(match, location, "nft");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={NFTIcon} viewBox="0 0 29 28" />
                  NFTS
                </Typography>
              </Link>

              {/*<Link
                component={NavLink}
                id="33-together-nav"
                to="/33-together"
                isActive={(match, location) => {
                  return checkPage(match, location, "33-together");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={PoolTogetherIcon} />
                  3,3 Together
                </Typography>
              </Link>*/}

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  Bonds
                  <Button onClick={changeOrder}>
                    {bondOrder === "asc" ? (
                      <SvgIcon color="primary" component={UpArrow} viewBox="0 0 330 330" />
                    ) : (
                      <SvgIcon color="primary" className="rotate-x-180" component={UpArrow} viewBox="0 0 330 330" />
                    )}
                  </Button>
                </Typography>
              </Link>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  {/*<Typography variant="body2">Open Bonds</Typography>*/}
                  {bonds.map((bond, i) => (
                    <Link
                      component={NavLink}
                      to={`/bonds/${bond.name}`}
                      key={i}
                      className={`bond ${bond.isAvailable[chainID] ? "" : "sold-out-bond"}`}
                    >
                      {/*{!bond.bondDiscount ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : (
                        <Typography variant="body2">
                          {bond.displayName}
                          <span className="bond-pair-roi">
                            {bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%
                          </span>
                        </Typography>
                      }*/}
                      {
                        <Typography variant="body2">
                          {bond.displayName}
                          <span className="bond-pair-roi">
                            {bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%
                          </span>
                        </Typography>
                      }
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
