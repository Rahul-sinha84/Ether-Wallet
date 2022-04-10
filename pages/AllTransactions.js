import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Transaction from "../components/Transaction";

const arr = [
  {
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    amount: 10000,
    isExecuted: false,
    confirmations: 0,
  },
  {
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    amount: 10000,
    isExecuted: false,
    confirmations: 0,
  },
  {
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    amount: 10000,
    isExecuted: false,
    confirmations: 0,
  },
  {
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    amount: 10000,
    isExecuted: false,
    confirmations: 0,
  },
  {
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    amount: 10000,
    isExecuted: false,
    confirmations: 0,
  },
];

const Transactions = ({ state }) => {
  const [transactions, setTransactions] = useState([]);

  const { contractInstance, load } = state;

  useEffect(() => {
    getTransactions();
  }, [contractInstance, load]);

  const getTransactions = async () => {
    if (!contractInstance.address) return;
    const _length = await contractInstance.transactionsLength();
    let _transactions = [];
    for (var i = 0; i < _length.toNumber(); i++) {
      const arr = await contractInstance.getTransaction(i);
      let obj = {
        to: arr[0],
        amount: arr[1].toNumber(),
        isExecuted: arr[2],
        confirmations: arr[3].toNumber(),
      };
      _transactions.push(obj);
    }
    setTransactions(_transactions);
  };

  return (
    <div className="transactions">
      <div className="transactions__container">
        <div className="transactions__container--text">
          All Submitted Transactions
        </div>
        <div className="transactions__container--list">
          {transactions.map((val, ind) => {
            return (
              <div className="transactions__container--list__item" key={ind}>
                <Transaction ind={ind} data={val} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(Transactions);
