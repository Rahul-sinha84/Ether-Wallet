import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";

const Header = ({ state }) => {
  const {
    currentAccount,
    isMetamaskConnected,
    changeMetamaskConnected,
    metamaskConnectFunction,
    contractBalance,
  } = state;
  const address = `${currentAccount.substring(
    0,
    5
  )}...${currentAccount.substring(
    currentAccount.length - 4,
    currentAccount.length
  )}`;

  return (
    <>
      <div className="header">
        <div className="header__container">
          <div className="header__container--first">
            <Link href="/Deposit">
              <div className="header__item">Deposit Amount</div>
            </Link>
            <Link href="/SubmitTransaction">
              <div className="header__item">Create Transaction</div>
            </Link>
            <Link href="/AllTransactions">
              <div className="header__item">All Transactions</div>
            </Link>
          </div>
          <div className="header__container--second">
            <div className="header__item">
              {isMetamaskConnected ? (
                <div className="address-container">{address}</div>
              ) : (
                <button
                  className="metamask-connect"
                  onClick={() =>
                    metamaskConnectFunction(changeMetamaskConnected)
                  }
                >
                  Connect Metamask
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="header__stripe">
        <div className="header__stripe--text">
          Contract Balance: <b>{contractBalance}</b>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Header);
