import Moralis from "moralis";
import React, { createContext, useContext } from "react";
import { getCurrentAddress } from "../../utils"

const initial = getCurrentAddress();

export const AddressContext = createContext([initial, () => {}]);
export const useAddressContext = () => useContext(AddressContext);
export const AddressProvider = ({ children }) => {
  const value = React.useState(getCurrentAddress());
  React.useEffect(() => {
    const [address, setAddress] = value;
    setTimeout(() => {
      if (address !== getCurrentAddress()) {
        setAddress(getCurrentAddress());
      }
    }, 100);
    return Moralis.Web3.onAccountsChanged(([v]) => {
      setAddress((v ?? "").toLowerCase());
    });
  }, []);
  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
