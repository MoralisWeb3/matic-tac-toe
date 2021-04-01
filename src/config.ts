import Moralis from "moralis";

Moralis.initialize(process.env.REACT_APP_MORALIS_APP_ID);
Moralis.serverURL = process.env.REACT_APP_MORALIS_URL;
