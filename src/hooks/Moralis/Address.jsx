import Moralis from "moralis";
import React, { createContext, useContext } from "react";

const initial = window.ethereum?.selectedAddress ?? "";

console.log(Moralis.Web3)

export const AddressContext = createContext([initial, () => {}]);
export const useAddressContext = () => useContext(AddressContext);
export const AddressProvider = ({ children }) => {
  const value = React.useState(window.ethereum?.selectedAddress ?? "");
  React.useEffect(() => {
    const [address, setAddress] = value
    setTimeout(() => {
      if (address !== window.ethereum?.selectedAddress) {
        setAddress(window.ethereum?.selectedAddress);
      }
    }, 100);
    return Moralis.Web3.onAccountsChanged(([v]) => {
      setAddress(v);
    });
  }, []);
  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
