const { ethers } = require("hardhat");

const main = async () => {
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");

  const [deployer, firstAcc] = await ethers.getSigners();
  const multiSigWallet = await MultiSigWallet.deploy(
    [deployer.address, firstAcc.address],
    2
  );
  await multiSigWallet.deployed();
  console.log(`Contract Address: ${multiSigWallet.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1);
    console.log(err);
  });
