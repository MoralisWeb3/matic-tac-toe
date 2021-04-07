import "./config";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AlertDisplay } from "./components/Alert";
import { MainLayout } from "./components/Layout";
import { Providers } from "./context";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <Providers>
    <BrowserRouter>
      <MainLayout>
        <App />
        <AlertDisplay />
      </MainLayout>
    </BrowserRouter>
  </Providers>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
