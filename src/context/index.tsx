import React from "react";
import { AlertProvider } from "../components/Alert";
import { AllowancesProvider } from "./Allowance";
import { BetAmountProvider } from "./Bet";
import { PendingTxsProvider } from "./PendingTx";
import { SelectedTokenProvider, TokenListProvider } from "./Token";
import { TokenBalancesProvider } from "./TokenBalance";
import { AddressProvider, ChainProvider, UserProvider } from "../hooks/Moralis";

export const Providers = ({ children }) => {
  return (
    <AlertProvider>
      <PendingTxsProvider>
        <AllowancesProvider>
          <TokenBalancesProvider>
            <BetAmountProvider>
              <SelectedTokenProvider>
                <TokenListProvider>
                  <ChainProvider>
                    <AddressProvider>
                      <UserProvider>{children}</UserProvider>
                    </AddressProvider>
                  </ChainProvider>
                </TokenListProvider>
              </SelectedTokenProvider>
            </BetAmountProvider>
          </TokenBalancesProvider>
        </AllowancesProvider>
      </PendingTxsProvider>
    </AlertProvider>
  );
};
