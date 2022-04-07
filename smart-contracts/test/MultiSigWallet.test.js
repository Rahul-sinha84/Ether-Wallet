const chai = require("./setupChai");
const { ethers, waffle } = require("hardhat");
const expect = chai.expect;
const { BigNumber } = ethers;

describe("Multi-Signature Wallet", () => {
  let contract,
    deployer,
    recepient,
    anotherAccount,
    amountSender,
    arr,
    provider = waffle.provider;
  const minNumCnfrm = 2;
  before(async () => {
    [deployer, recepient, anotherAccount, amountSender] =
      await ethers.getSigners();
    arr = [deployer.address, recepient.address];
    const Contract = await ethers.getContractFactory("MultiSigWallet");
    contract = await Contract.deploy(arr, minNumCnfrm);
    await contract.deployed();
  });
  it("Contract deployed successfully", async () => {
    const contractAddress = await contract.address;
    expect(contractAddress).to.be.not.equal(0x0);
    expect(contractAddress).to.be.not.equal(null);
    expect(contractAddress).to.be.not.equal(undefined);
    expect(contractAddress).to.be.not.equal("");
  });
  it("Checking Given inputs", async () => {
    const owners = await contract.getOwners();
    const _minNumCnfrm = await contract.minNumberOfConfimation();
    expect(_minNumCnfrm).to.be.equal(minNumCnfrm);
    owners.forEach((val, ind) => {
      expect(val).to.be.equal(arr[ind]);
    });
  });
  it("Submitting a transaction", async () => {
    const to = anotherAccount.address;
    const amount = 5000;
    const tx = await contract.submitTransaction(to, amount);
    await tx.wait();
    const transaction = await contract.getTransaction(0);
    const _to = transaction[0],
      _amount = transaction[1],
      _isExecuted = transaction[2],
      _confirmations = transaction[3];
    expect(_to).to.be.equal(to);
    expect(_amount).to.be.equal(amount);
    expect(_isExecuted).to.be.equal(false);
    expect(_confirmations).to.be.equal(0);
    // await contract.executeTransaction(0);
    expect(contract.executeTransaction(0)).to.eventually.be.rejectedWith(
      "Not have enough confirmations yet !!"
    );
  });
  it("Confirming transaction", async () => {
    // giving confirmation
    await expect(contract.connect(deployer).confirmTransaction(0)).to.eventually
      .be.fulfilled;
    await expect(contract.connect(recepient).confirmTransaction(0)).to
      .eventually.be.fulfilled;
    await expect(
      contract.connect(anotherAccount).confirmTransaction(0),
      "Non-Owner account cannot confirm transaction"
    ).to.eventually.be.rejected;
    await expect(contract.confirmTransaction(0), "Should not confirm again !!")
      .to.eventually.be.rejected;
    await expect(
      contract.executeTransaction(0),
      "Should not execute if enough funds are not available !!"
    ).to.eventually.be.rejected;
  });
  it("Revoking transaction", async () => {
    //revoking the confirmation
    await expect(contract.connect(deployer).revokeTransaction(0)).to.eventually
      .be.fulfilled;
    await expect(
      contract.connect(deployer).revokeTransaction(0),
      "Should not revoked if already revoked !!"
    ).to.eventually.be.rejected;
    await expect(
      contract.executeTransaction(0),
      "Should not be executed if enough confirmations are not there !!"
    ).to.eventually.be.rejected;
    //again giving confirmation
    await expect(contract.connect(deployer).confirmTransaction(0)).to.eventually
      .be.fulfilled;
  });
  it("Deposit amount", async () => {
    const amount = 10000;
    await expect(
      amountSender.sendTransaction({
        to: contract.address,
        value: amount,
      })
    ).to.eventually.be.fulfilled;
    const _amount = await contract.contractBalance();
    expect(_amount).to.be.equal(amount);
  });
  it("Executing transaction", async () => {
    let prevBalance = await provider.getBalance(anotherAccount.address);
    await expect(contract.executeTransaction(0)).to.eventually.be.fulfilled;
    let newBalance = await provider.getBalance(anotherAccount.address);
    expect(newBalance).to.be.equal(BigNumber.from(prevBalance).add(5000));
    const [_, __, _isExecuted, _minNumCnfrm] = await contract.getTransaction(0);
    expect(_isExecuted).to.be.equal(true);
    expect(_minNumCnfrm).to.be.equal(minNumCnfrm);
  });
});
