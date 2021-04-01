import "./config";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/Layout";
import { AlertProvider, AlertDisplay } from "./components/Alert";
import { UserProvider, ChainProvider, AddressProvider } from "./hooks/Moralis";
import { AllowancesProvider } from "./context/Allowance";
import { SelectedTokenProvider } from "./context/Token";
import { BetAmountProvider } from "./context/Bet";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <AlertProvider>
    <AllowancesProvider>
      <BetAmountProvider>
        <SelectedTokenProvider>
          <ChainProvider>
            <AddressProvider>
              <UserProvider>
                <BrowserRouter>
                  <MainLayout>
                    <App />
                    <AlertDisplay />
                  </MainLayout>
                </BrowserRouter>
              </UserProvider>
            </AddressProvider>
          </ChainProvider>
        </SelectedTokenProvider>
      </BetAmountProvider>
    </AllowancesProvider>
  </AlertProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
