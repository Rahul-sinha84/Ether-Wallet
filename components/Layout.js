import React, { useState, useEffect } from "react";
import {
  checkMetamaskStatus,
  connectMetamask,
  firstFunc,
} from "./configureMetamask";
import Header from "./Header";
import { connect } from "react-redux";
import {
  changeAccount,
  isOwnerOrNot,
  changeContractInstance,
  contractBalance,
  metamaskConnectFunction,
  metamaskStatus,
  metamaskStatusFunction,
  setMinConfirmation,
} from "../redux/actions";

const Layout = ({
  children,
  changeAccount,
  isOwnerOrNot,
  changeContractInstance,
  contractBalance,
  metamaskConnectFunction,
  metamaskStatus,
  metamaskStatusFunction,
  setMinConfirmation,
  state,
}) => {
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [contractInstance, setContractInstance] = useState();
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNetworkId, setCurrentNetworkId] = useState("");
  const [owners, setOwners] = useState([]);

  const { load } = state;

  useEffect(() => {
    firstFunc(
      setContractInstance,
      setCurrentAccount,
      setCurrentNetworkId,
      setMetamaskConnected
    );
    checkMetamaskStatus(
      setMetamaskConnected,
      setCurrentAccount,
      setCurrentNetworkId
    );
    metamaskConnectFunction(connectMetamask);
    metamaskStatusFunction(setMetamaskConnected);
  }, []);

  //only for metamaskStatus
  useEffect(() => {
    metamaskStatus(metamaskConnected);
  }, [metamaskConnected]);

  //only for changing account
  useEffect(() => {
    changeAccount(currentAccount === undefined ? "" : currentAccount);
    isOwnerOrNot(checkOwner());
  }, [currentAccount, owners]);

  // for updating the change when metamask configuration changes !!
  useEffect(() => {
    // function to update the values of state
    getContractData();
    // for listening of events
    //    listenToEvents(contract);
  }, [currentAccount, contractInstance, load]);

  const getContractData = async () => {
    if (!contractInstance) return;
    const _owners = await contractInstance.getOwners();
    setOwners(_owners);
    changeContractInstance(contractInstance);
    const _contractBalance = await contractInstance.contractBalance();
    contractBalance(_contractBalance.toNumber());
    const _minConfirmation = await contractInstance.minNumberOfConfimation();
    setMinConfirmation(_minConfirmation.toNumber());
  };

  const checkOwner = () => {
    if (!owners.length) return false;
    let flag =
      owners.find((val) => +currentAccount === +val) === undefined
        ? false
        : true;

    return flag;
  };
  return (
    <div>
      <Header />
      {!metamaskConnected ? (
        <>
          <div className="index__not-connected-msg">
            Please Connect Metamask to Continue !!
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { state };
};

export default connect(mapStateToProps, {
  changeAccount,
  isOwnerOrNot,
  changeContractInstance,
  contractBalance,
  metamaskConnectFunction,
  metamaskStatus,
  metamaskStatusFunction,
  setMinConfirmation,
})(Layout);
