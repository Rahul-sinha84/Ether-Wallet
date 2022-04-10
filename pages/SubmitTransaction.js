import React, { useState } from "react";
import { connect } from "react-redux";

const SubmitTransaction = ({ state }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { contractInstance, currentAccount } = state;

  const submitTransaction = async () => {
    if (!amount || amount <= 0 || !address)
      return alert("Enter Valid inputs !!");
    if (!contractInstance.address)
      return alert("Contract not connected yet !!");
    try {
      const tx = await contractInstance.submitTransaction(address, amount, {
        from: currentAccount,
      });
      await tx.wait();
      setAddress("");
      setAmount("");
    } catch (err) {
      alert("The Transaction cannot be mined !!");
      console.log(err);
    }
  };

  return (
    <div className="submit-transaction">
      <div className="submit-transaction__container">
        <div className="submit-transaction__heading">Create Transaction</div>
        <div className="submit-transaction__form">
          <input
            className="submit-transaction__input"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="submit-transaction__input"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
        </div>
        <div className="submit-transaction__btn-container">
          <button
            onClick={submitTransaction}
            className="submit-transaction__btn"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(SubmitTransaction);
