import React, { useState } from "react";

const CACHE_KEY = "BOND_ORDER";

const OrderContext = React.createContext({ bondOrder: null, toggleValue: () => {} });

const OrderContextProvider = (x: any) => {
  const [bondOrder, setBondOrder] = useState(() => {
    const val = localStorage.getItem(CACHE_KEY);
    return val ? JSON.parse(val) : "desc";
  });

  const toggleValue = () => {
    setBondOrder((prevState: string) => {
      let newState = "desc";
      if (prevState === "desc") newState = "asc";
      localStorage.setItem(CACHE_KEY, JSON.stringify(prevState));
      return newState;
    });
  };

  return <OrderContext.Provider value={{ bondOrder, toggleValue }}>{x.children}</OrderContext.Provider>;
};

export { OrderContext, OrderContextProvider };
