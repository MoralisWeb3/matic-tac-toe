import { makeContext } from "./make";

const initialToken = "0xcEDe5E16753Df90A7E209a820a6706f61487104F";
export const {
  Provider: SelectedTokenProvider,
  useContext: useSelectedToken,
} = makeContext("SelectedToken", initialToken);
