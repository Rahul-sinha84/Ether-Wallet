// SPDX-License-Identifier: MIT
pragma solidity <=0.8.4;

contract MultiSigWallet {
    address[] private owners;
    uint256 public minNumberOfConfimation;
    mapping(address => bool) private isOwner;

    event SubmitTransaction(
        address _from,
        address _to,
        uint256 txIndex,
        uint256 _value
    );
    event ConfirmTransaction(address _owner, uint256 txIndex);
    event RevokeTransaction(address _owner, uint256 txIndex);
    event Deposit(address _from, uint256 amount, uint256 balance);
    event ExecuteTransaction(
        address _to,
        uint256 amount,
        uint256 txIndex,
        uint256 balance
    );

    struct Transaction {
        address to;
        uint256 amount;
        bool isExecuted;
        uint256 noOfConfirmations;
    }

    Transaction[] public transactions;

    // txIndex => (owner => true or false)
    mapping(uint256 => mapping(address => bool)) private thisOwnerConfirmed;

    constructor(address[] memory _owners, uint256 _minNumberOfConfirmation) {
        require(_owners.length > 0, "Owners required !!");
        require(
            _minNumberOfConfirmation > 0 &&
                _owners.length >= _minNumberOfConfirmation,
            "Minimum number of confirmation should be greater than or equal to the total number of owners !!"
        );
        uint256 n = _owners.length;
        for (uint256 i = 0; i < n; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Valid owner's address required !!");
            require(!isOwner[owner], "Repeated Owners not allowed !!");
            owners.push(owner);
            isOwner[owner] = true;
        }
        minNumberOfConfimation = _minNumberOfConfirmation;
    }

    function deposit() public payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function executeTransaction(uint256 txIndex) public isExecuted(txIndex) {
        Transaction storage _transaction = transactions[txIndex];
        require(
            _transaction.noOfConfirmations >= minNumberOfConfimation,
            "Not have enough confirmations yet !!"
        );
        require(
            _transaction.amount <= address(this).balance,
            "Not enough balance to execute this transaction !!"
        );
        (bool success, ) = payable(_transaction.to).call{
            value: _transaction.amount
        }("");
        require(success, "Transaction failed !!");
        _transaction.isExecuted = true;

        emit ExecuteTransaction(
            _transaction.to,
            _transaction.amount,
            txIndex,
            address(this).balance
        );
    }

    function isConfirmedByOwner(uint256 txIndex, address _address)
        public
        view
        returns (bool)
    {
        return thisOwnerConfirmed[txIndex][_address];
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function transactionsLength() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 txIndex)
        public
        view
        returns (
            address,
            uint256,
            bool,
            uint256
        )
    {
        Transaction memory _transaction = transactions[txIndex];
        return (
            _transaction.to,
            _transaction.amount,
            _transaction.isExecuted,
            _transaction.noOfConfirmations
        );
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function submitTransaction(address _to, uint256 _amount) public {
        uint256 txIndex = transactions.length;
        transactions.push(
            Transaction({
                to: _to,
                amount: _amount,
                isExecuted: false,
                noOfConfirmations: 0
            })
        );
        emit SubmitTransaction(msg.sender, _to, txIndex, _amount);
    }

    function confirmTransaction(uint256 txIndex)
        public
        isExecuted(txIndex)
        onlyOwner
        ownerNotConfirmed(txIndex)
    {
        Transaction storage _transaction = transactions[txIndex];
        _transaction.noOfConfirmations += 1;
        thisOwnerConfirmed[txIndex][msg.sender] = true;
        emit ConfirmTransaction(msg.sender, txIndex);
    }

    function revokeTransaction(uint256 txIndex)
        public
        isExecuted(txIndex)
        onlyOwner
        ownerConfirmed(txIndex)
    {
        Transaction storage _transaction = transactions[txIndex];
        _transaction.noOfConfirmations -= 1;
        thisOwnerConfirmed[txIndex][msg.sender] = false;
        emit RevokeTransaction(msg.sender, txIndex);
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Only Owner required !!");
        _;
    }

    modifier ownerConfirmed(uint256 txIndex) {
        require(txIndex < transactions.length, "Invalid Transaction index !!");
        require(
            thisOwnerConfirmed[txIndex][msg.sender],
            "This owner has not confirmed this transaction !!"
        );
        _;
    }

    modifier ownerNotConfirmed(uint256 txIndex) {
        require(txIndex < transactions.length, "Invalid Transaction index !!");
        require(
            !thisOwnerConfirmed[txIndex][msg.sender],
            "This owner already confirmed this transaction !!"
        );
        _;
    }

    modifier isExecuted(uint256 txIndex) {
        require(txIndex < transactions.length, "Invalid index !!");
        require(
            !transactions[txIndex].isExecuted,
            "Alread Executed Transaction !!"
        );
        _;
    }

    receive() external payable {
        deposit();
    }
}
