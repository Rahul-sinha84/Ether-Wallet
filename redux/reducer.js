import { combineReducers } from "redux";
import {
  ACCOUNT_CHANGED,
  IS_OWNER_OR_NOT,
  CONTRACT_INSTANCE,
  CONTRACT_BALANCE,
  METAMASK_CONNECT_FUNCTION,
  IS_METAMASK_CONNECTED,
  SET_IS_METAMASK_CONNECTED,
  LOAD,
  MIN_CONFIRMATIONS,
} from "./types";

const forCurrentAccount = (state = "", action) => {
  if (action.type === ACCOUNT_CHANGED) {
    return action.payload;
  }
  return state;
};

const forOwnerCheck = (state = false, action) => {
  if (action.type === IS_OWNER_OR_NOT) return action.payload;
  return state;
};

const forContractInstance = (state = {}, action) => {
  if (action.type === CONTRACT_INSTANCE) return action.payload;
  return state;
};

const contractBalance = (state = "", action) => {
  if (action.type === CONTRACT_BALANCE) return action.payload;
  return state;
};
const metamaskConnectFunction = (state = {}, action) => {
  if (action.type === METAMASK_CONNECT_FUNCTION) return action.payload;
  return state;
};
const isMetamaskConnected = (state = false, action) => {
  if (action.type === IS_METAMASK_CONNECTED) return action.payload;
  return state;
};
const changeMetamaskConnected = (state = {}, action) => {
  if (action.type === SET_IS_METAMASK_CONNECTED) return action.payload;
  return state;
};

const load = (state = false, action) => {
  if (action.type === LOAD) return action.payload;
  return state;
};

const minConfirmation = (state = 0, action) => {
  if (action.type === MIN_CONFIRMATIONS) return action.payload;
  return state;
};

export default combineReducers({
  currentAccount: forCurrentAccount,
  isOwner: forOwnerCheck,
  contractInstance: forContractInstance,
  contractBalance,
  metamaskConnectFunction,
  isMetamaskConnected,
  changeMetamaskConnected,
  load,
  minConfirmation,
});
