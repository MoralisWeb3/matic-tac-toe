import React, { createContext, useContext } from "react";
import Moralis from 'moralis';

const initial = Moralis.User.current();
const userData = initial && initial.attributes;
export const UserContext = createContext([userData, () => {}]);
export const useUserContext = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const value = React.useState(userData);
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
