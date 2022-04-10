import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoad } from "../redux/actions";

const Transaction = ({ data, state, ind, setLoad }) => {
  const [approved, setApproved] = useState(true);

  const { to, amount, isExecuted, confirmations } = data;
  const { isOwner, minConfirmation, contractInstance, currentAccount, load } =
    state;
  const confirmationsDisplay = `${confirmations}/${minConfirmation}`;

  useEffect(() => {
    getInfo();
  }, [contractInstance, load, currentAccount]);

  const getInfo = async () => {
    if (!contractInstance.address || !currentAccount) return;
    const isApproved = await contractInstance.isConfirmedByOwner(
      ind,
      currentAccount
    );
    setApproved(isApproved);
  };

  const handleApproval = async () => {
    if (!contractInstance) return;
    try {
      let tx;
      if (approved) {
        tx = await contractInstance.revokeTransaction(ind);
      } else {
        tx = await contractInstance.confirmTransaction(ind);
      }
      await tx.wait();
      setLoad(!load);
    } catch (err) {
      console.log(err);
      alert("Some error occured !!");
    }
  };

  const handleExecution = async () => {
    if (!contractInstance) return alert("Some error occured !!");
    if (confirmations !== minConfirmation)
      return alert("Confirmations are not enough !!");
    try {
      const tx = await contractInstance.executeTransaction(ind);
      await tx.wait();
      setLoad(!load);
    } catch (err) {
      console.log(err);
      alert("Some error occured !!");
    }
  };

  return (
    <div className="transaction">
      <div className="transaction__container">
        <div className="transaction__container--item">
          <div className="transaction__container--item__key">To</div>
          <div className="transaction__container--item__value">{to}</div>
        </div>
        <div className="transaction__container--item">
          <div className="transaction__container--item__key">Amount</div>
          <div className="transaction__container--item__value">{amount}</div>
        </div>
        <div className="transaction__container--item">
          <div className="transaction__container--item__key">Confirmations</div>
          <div className="transaction__container--item__value">
            {confirmationsDisplay}
          </div>
        </div>
        {isOwner && (
          <div className="transaction__container--item">
            <div className="transaction__container--item__key">
              {approved ? "Revoke" : "Approve"}
            </div>
            <div className="transaction__container--item__value">
              <button
                onClick={handleApproval}
                className={`transaction__container--item__value--btn ${
                  approved ? "__cross" : "__tick"
                }`}
              >
                {" "}
                {approved ? "✕" : "✓"}{" "}
              </button>
            </div>
          </div>
        )}
        <div className="transaction__container--item">
          <div className="transaction__container--item__key">Is Executed</div>
          <div className="transaction__container--item__value">
            {`${isExecuted}`}
          </div>
        </div>
        <div className="transaction__container--item">
          <button onClick={handleExecution} disabled={isExecuted}>
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { setLoad })(Transaction);
