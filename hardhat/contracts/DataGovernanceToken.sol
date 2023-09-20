// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Snapshot} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract DataGovernanceToken is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    AccessControl,
    Pausable,
    ERC20Permit,
    ERC20Votes
{
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public tokenPriceInEther = 10 ether;
    address public paymentReceiver;
    // Mapping to track the staked balances of users
    mapping(address => uint256) public stakedBalances;

    constructor() ERC20("PackDataToken", "PDK") ERC20Permit("PackDataToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SNAPSHOT_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _mint(msg.sender, 100 ether);
    }

    function purchaseTokens() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(tokenPriceInEther > 0, "Sale not set");

        uint256 tokenAmount = (msg.value * (10 ** uint256(decimals()))) / tokenPriceInEther;
        require(tokenAmount > 0, "Insufficient Payment");

        _mint(msg.sender, tokenAmount);
        payable(paymentReceiver).transfer(msg.value);
    }

    function setSalesSettings(address _receiver, uint256 _tokenPriceInEther) external onlyRole(ADMIN_ROLE) {
        paymentReceiver = _receiver;
        tokenPriceInEther = _tokenPriceInEther * 10 ** decimals();
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
