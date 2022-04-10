import {
  IS_OWNER_OR_NOT,
  ACCOUNT_CHANGED,
  CONTRACT_INSTANCE,
  METAMASK_CONNECT_FUNCTION,
  IS_METAMASK_CONNECTED,
  SET_IS_METAMASK_CONNECTED,
  CONTRACT_BALANCE,
  LOAD,
  MIN_CONFIRMATIONS,
} from "./types";

export const changeAccount = (payload) => {
  return {
    type: ACCOUNT_CHANGED,
    payload,
  };
};

export const isOwnerOrNot = (payload) => {
  return {
    type: IS_OWNER_OR_NOT,
    payload,
  };
};

export const changeContractInstance = (payload) => {
  return {
    type: CONTRACT_INSTANCE,
    payload,
  };
};

export const metamaskConnectFunction = (payload) => {
  return {
    type: METAMASK_CONNECT_FUNCTION,
    payload,
  };
};

export const metamaskStatus = (payload) => {
  return {
    type: IS_METAMASK_CONNECTED,
    payload,
  };
};

export const metamaskStatusFunction = (payload) => {
  return {
    type: SET_IS_METAMASK_CONNECTED,
    payload,
  };
};

export const contractBalance = (payload) => {
  return {
    type: CONTRACT_BALANCE,
    payload,
  };
};

export const setLoad = (payload) => {
  return {
    type: LOAD,
    payload,
  };
};

export const setMinConfirmation = (payload) => ({
  type: MIN_CONFIRMATIONS,
  payload,
});
