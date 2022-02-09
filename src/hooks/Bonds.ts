import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import allBonds from "src/helpers/AllBonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";
import { OrderContext } from "../context/OrderContext";

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

const initialBondArray = allBonds;
// Slaps together bond data within the account & bonding states
function useBonds() {
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);
  const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);
  const { bondOrder, toggleValue } = useContext(OrderContext);

  useEffect(() => {
    console.log("bondState", bondState, "accountBondsState", accountBondsState);
    let bondDetails: IAllBondData[];
    bondDetails = allBonds
      .flatMap(bond => {
        if (bondState[bond.name] && bondState[bond.name].bondDiscount !== undefined) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        if (accountBondsState[bond.name]) {
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      });

    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      if (bondOrder === "desc")
        return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
      else return a["bondDiscount"] < b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
    });

    setBonds(mostProfitableBonds);
  }, [bondState, accountBondsState, bondLoading, bondOrder]);

  // Debug Log:
  return { bonds, loading: bondLoading };
}

export default useBonds;
