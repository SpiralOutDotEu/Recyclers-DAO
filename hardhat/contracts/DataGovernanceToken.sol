// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Snapshot} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract DataGovernanceToken is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    AccessControl,
    Pausable,
    ERC20Permit,
    ERC20Votes,
    ERC721Holder
{
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    // Sales settings
    uint256 public tokenPriceInEther = 10 ether;
    address public paymentReceiver;
    // Submission and validation settings
    uint256 public submitMinimum;
    uint256 public validateMinimum;
    // Table settings
    uint256 public _tableId;
    string private constant _TABLE_PREFIX = "recyclers_dao_table";
    // Storage of submissions
    mapping(uint256 submissionId => address submitter) public submissions;
    // Mapping to track the staked balances of users
    mapping(address staker => uint256 amount) public stakedBalances;
    // Counter
    uint256 public counter = 1;
    // Events

    event DataSubmission(uint256 submissionId, address submitter);
    event DataApproval(uint256 submissionId, address submitter, address validator,string comment);
    event DataRejection(uint256 submissionId, address submitter, address validator, string reason);

    constructor() ERC20("Recyclers DAO Token", "ReDAO") ERC20Permit("Recyclers DAO Token") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SNAPSHOT_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _mint(msg.sender, 10000 ether);

        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key," // Notice the trailing comma
                "imagecid text," //  the cid that the image is stored
                "material text," // e.g. paper, plastic, metal, aluminum, mixed
                "state text," // 'New' or 'Waste'
                "brand text," // the brand of the product
                "barcode text," // the barcode of product
                "submittimestamp text," // the block timestamp that has been submitted
                "submitter text," // the address of the submitter
                "validator text," // the address of the validator
                "validationtimestamp text," // the block timestamp that has been checked by validator
                "vote int", // 1 if validator approves data, 0 if not
                _TABLE_PREFIX
            )
        );
    }

    function purchaseTokens() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(tokenPriceInEther > 0, "Sale not set");

        uint256 tokenAmount = (msg.value * (10 ** uint256(decimals()))) / tokenPriceInEther;
        require(tokenAmount > 0, "Insufficient Payment");

        _mint(msg.sender, tokenAmount);
        payable(paymentReceiver).transfer(msg.value);
    }

    function setSalesSettings(address _receiver, uint256 _tokenPriceInEther) public onlyRole(ADMIN_ROLE) {
        paymentReceiver = _receiver;
        tokenPriceInEther = _tokenPriceInEther * 10 ** decimals();
    }

    function setLimits(uint256 _submitMinimum, uint256 _validateMinimum) public onlyRole(ADMIN_ROLE) {
        submitMinimum = _submitMinimum * 10 ** decimals();
        validateMinimum = _validateMinimum * 10 ** decimals();
    }

    // Return the table name
    function getTable() public view returns (string memory) {
        return SQLHelpers.toNameFromId(_TABLE_PREFIX, _tableId);
    }

    function submitData(
        string memory imageCid,
        string memory material,
        string memory state,
        string memory brand,
        string memory barcode
    ) public {
        require(stakedBalances[msg.sender] >= submitMinimum, "Staked < SubmissionMin");

        // Store to table
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "imagecid,material,state,brand,barcode,submittimestamp,submitter",
                string.concat(
                    SQLHelpers.quote(imageCid),
                    ",",
                    SQLHelpers.quote(material),
                    ",",
                    SQLHelpers.quote(state),
                    ",",
                    SQLHelpers.quote(brand),
                    ",",
                    SQLHelpers.quote(barcode),
                    ",",
                    // solhint-disable-next-line not-rely-on-time
                    SQLHelpers.quote(Strings.toString(uint256(block.timestamp))), // Convert to a string
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)) // Wrap strings in single quotes
                )
            )
        );

        // Store reference to contract
        submissions[counter] = msg.sender;
      
        // Emit event
        emit DataSubmission(counter, msg.sender);
          counter += 1;
    }

    function validateData(uint256 submissionId, bool vote, string calldata comment) public {
        require(stakedBalances[msg.sender] >= validateMinimum, "Staked < validateMinimum");
        // Set values to update
        string memory setters = string.concat(
            "validator=",
            SQLHelpers.quote(Strings.toHexString(msg.sender)),
            ",",
            "validationtimestamp=",
            SQLHelpers.quote(Strings.toString(uint256(block.timestamp))),
            ",",
            "vote=",
            vote ? "1" : "0"
        );
        // Only update the row with the matching `id`
        string memory filters = string.concat("id=", Strings.toString(submissionId));
        /*  Under the hood, SQL helpers formulates:
        *  UPDATE {prefix}_{chainId}_{tableId} SET val=<myVal> WHERE id=<id>
        */
        TablelandDeployments.get().mutate(
            address(this), _tableId, SQLHelpers.toUpdate(_TABLE_PREFIX, _tableId, setters, filters)
        );
        if (vote) {
            _mint(submissions[submissionId], 0.01 ether);
            delete submissions[submissionId];
            _mint(msg.sender, 0.01 ether);
            emit DataApproval(submissionId, submissions[submissionId], msg.sender, comment);

        } else {
            stakedBalances[submissions[submissionId]] -= 0.01 ether;
            stakedBalances[msg.sender] -= 0.01 ether;
            emit DataRejection(submissionId, submissions[submissionId], msg.sender, comment);
        }
    }

    // Function to stake tokens
    function stakeTokens(uint256 _amount) external {
        require(_amount > 0, "Stake more than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Update the staked balance of the user
        stakedBalances[msg.sender] += _amount;

        // Transfer tokens from the user to the contract
        transfer(address(this), _amount);
    }

    // Function to get the staked balance of a user
    function getStakedBalance(address _user) external view returns (uint256) {
        return stakedBalances[_user];
    }

    // Function to decrease staked tokens
    function decreaseStake(uint256 _amount) external {
        require(_amount > 0, "Decrease more than 0");
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");

        // Update the staked balance of the user
        stakedBalances[msg.sender] -= _amount;

        // Transfer tokens from the contract back to the user
        _transfer(address(this), msg.sender, _amount);
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Snapshot)
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
