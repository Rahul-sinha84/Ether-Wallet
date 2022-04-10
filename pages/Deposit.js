import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setLoad } from "../redux/actions";

const Deposit = ({ state, setLoad }) => {
  const [amount, setAmount] = useState("");
  const { contractInstance, currentAccount } = state;
  const [contractAddress, setContractAddress] = useState("");
  const { load } = state;
  useEffect(() => {
    (async () => {
      const _contracAddress = await contractInstance.address;
      setContractAddress(_contracAddress);
    })();
  }, [contractInstance]);
  const deposit = async () => {
    if (!amount || amount < 0) return alert("Enter valid Amount !!");
    if (!contractInstance) return alert("Contract not connected yet !!");
    try {
      const tx = await contractInstance.deposit({
        from: currentAccount,
        value: amount,
      });
      await tx.wait();
      setLoad(!load);
      setAmount("");
    } catch (err) {
      alert("Transaction cannot be mined !!");
      console.log(err);
    }
  };
  return (
    <div className="deposit">
      <div className="deposit__container">
        <div className="deposit__container--input">
          <input
            className="deposit__input"
            type="number"
            placeholder="Enter Amount in Wei"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={deposit} className="deposit__btn">
            Deposit
          </button>
        </div>
        <div className="deposit__container--info">
          <div className="deposit__container--info__text">
            You can Deposit Amount by yourself to this address:{" "}
            <b>{contractAddress}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps, { setLoad })(Deposit);
