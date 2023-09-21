const { loadFixture, mine } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")
const { DealRequestStruct, PROPOSAL_DESCRIPTION } = require("../../helper-hardhat-config");

describe("Data DAO System", function () {
    async function deployDataDAOFixture() {
        // TODO: refactor to use deployment scripts. see https://github.com/wighawag/tutorial-hardhat-deploy
        // Use some users
        const [owner, user1, user2] = await ethers.getSigners()
        // Deploy the token
        const Token = await ethers.getContractFactory("DataGovernanceToken")
        const token = await Token.deploy()
        // Deploy the timeLock
        const timeLockMinDelay = 1
        const proposers = []
        const executors = []
        const admin = owner.address
        const TimeLock = await ethers.getContractFactory("TimeLock")
        const timeLock = await TimeLock.deploy(timeLockMinDelay, proposers, executors, admin)
        // Deploy the governor with token & timeLock addresses and some basic params
        const votingDelay = 5
        const votingPeriod = 100
        const quorumPercentage = 1
        const Governor = await ethers.getContractFactory("GovernorContract")
        const governor = await Governor.deploy(
            token.address,
            timeLock.address,
            votingDelay,
            votingPeriod,
            quorumPercentage
        )
        // Set Roles in TimeLock
        const proposerRole = await timeLock.PROPOSER_ROLE()
        const executorRole = await timeLock.EXECUTOR_ROLE()
        const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
        // Governor contract can propose
        await timeLock.grantRole(proposerRole, governor.address)
        // Anyone can execute
        await timeLock.grantRole(executorRole, ethers.constants.AddressZero)
        // Renounce ownership of timeLock and let only governor to rule it
        await timeLock.revokeRole(adminRole, owner.address)
        //  Deploy the DaoDealClient
        const DaoDealClient = await ethers.getContractFactory("DaoDealClient")
        const daoDealClient = await DaoDealClient.deploy()
        // Transfer ownership to timeLock
        await daoDealClient.transferOwnership(timeLock.address)
        // return a fixture to use in tests
        return {
            token,
            governor,
            timeLock,
            daoDealClient,
            votingDelay,
            votingPeriod,
            quorumPercentage,
            timeLockMinDelay,
            owner,
            user1,
            user2
        }
    }

    it("Should deploy a set of data token, governor, timeLock and deal Client", async function () {
        const { token, governor, timeLock, daoDealClient, owner } = await loadFixture(
            deployDataDAOFixture
        )
        const ownerBalance = await token.balanceOf(owner.address)
        const governorToken = await governor.token()
        const proposerRole = await timeLock.PROPOSER_ROLE()
        const executorRole = await timeLock.EXECUTOR_ROLE()
        const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
        // Deployer should have the initial token balance
        expect(await token.totalSupply()).to.equal(ownerBalance)
        // Governor should be ruled by token
        expect(governorToken).to.equal(token.address)
        // Governor has the proposer role in timeLock
        expect(await timeLock.hasRole(proposerRole, governor.address)).to.equal(true)
        // Execution role to timeLock is the zero address (anyone can execute a passed proposal)
        expect(await timeLock.hasRole(executorRole, ethers.constants.AddressZero)).to.equal(true)
        // Deployer is not timeLock admin
        expect(await timeLock.hasRole(adminRole, owner.address)).to.equal(false)
        // Owner of daoDealClient is timeLock
        expect(await daoDealClient.owner()).to.equal(timeLock.address)
    })
    it("Proposal, Voting, and Execution Test of a filecoin deal (Happy Path)", async function () {
        // Create a proposal, vote on it, wait for voting period, execute proposal, and verify results
        const { token, daoDealClient, governor, votingDelay, votingPeriod, timeLockMinDelay, owner } = await loadFixture(deployDataDAOFixture);
        // Owner delegates voting power to itself
        await token.delegate(owner.address);
        // Owner voting power is equal to it's token balance
        expect(await token.getVotes(owner.address)).to.equal(await token.balanceOf(owner.address));
        // Prepare the proposal
        const functionToCall = "makeDealProposal";
        const args = [DealRequestStruct];
        const encodedFunctionCall = daoDealClient.interface.encodeFunctionData(functionToCall, args);
        // Make the proposal
        const proposeTx = await governor.propose(
            [daoDealClient.address],
            [0],
            [encodedFunctionCall],
            PROPOSAL_DESCRIPTION
        )
        // Assert the proposal
        const proposeReceipt = await proposeTx.wait();
        const proposalId = proposeReceipt.events[0].args.proposalId;
        const proposalEvent = proposeReceipt.events[0].event;
        const proposalDescriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
        var proposalState = await governor.state(proposalId)
        expect(proposalEvent).to.equal("ProposalCreated")
        expect(proposalId).to.equal(await governor.hashProposal(
            [daoDealClient.address],
            [0],
            [encodedFunctionCall],
            proposalDescriptionHash
        ));
        // The Proposal State is an enum data type, defined in the IGovernor contract.
        // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
        expect(proposalState).to.equal(0);
        // Pass time until voting delay pass over
        await mine(votingDelay + 1);
        // Proposal should be active
        proposalState = await governor.state(proposalId)
        expect(proposalState).to.equal(1);
        // Vote for it
        await governor.castVote(proposalId, 1);
        // Check vote
        expect(await governor.hasVoted(proposalId, owner.address))
        // Pass time until voting period ends
        await mine(votingPeriod + 1)
        // Expect proposal to be succeeded
        proposalState = await governor.state(proposalId)
        expect(proposalState).to.equal(4);
        // Queue the proposal
        await governor.queue([
            daoDealClient.address],
            [0],
            [encodedFunctionCall],
            proposalDescriptionHash
        );
        // Expect proposal to be queued 
        proposalState = await governor.state(proposalId)
        expect(proposalState).to.equal(5);
        // Pass time until timeLock min delay ends
        await mine(timeLockMinDelay + 1)
        // Execute the proposal
        await governor.execute([
            daoDealClient.address],
            [0],
            [encodedFunctionCall],
            proposalDescriptionHash
        );
        // Expect proposal to be executed
        proposalState = await governor.state(proposalId)
        expect(proposalState).to.equal(7);
    });
    it("Users can purchase tokens on a predefined price set by admin role", async function () {
        const { token, owner, user1 } = await loadFixture(
            deployDataDAOFixture
        )
        const priceInEther = 10;
        await token.connect(owner).setSalesSettings(owner.address, priceInEther)
        await token.connect(user1).purchaseTokens({ value: ethers.utils.parseEther("21.45") })
        const user1Balance = await token.balanceOf(user1.address)
        expect(user1Balance).to.equal(ethers.utils.parseEther("2.145"))
    })
    it("Users can stake and unstake tokens", async function () {
        const { token, owner, user1 } = await loadFixture(
            deployDataDAOFixture
        )
        const priceInEther = 10;
        await token.connect(owner).setSalesSettings(owner.address, priceInEther)
        await token.connect(user1).purchaseTokens({ value: ethers.utils.parseEther("100") })
        // Stake
        await token.connect(user1).stakeTokens(ethers.utils.parseEther("1"))
        // Expect user balance to be reduced
        var user1Balance = await token.balanceOf(user1.address)
        expect(user1Balance).to.equal(ethers.utils.parseEther("9"))
        // Expect contract balance to be increased
        var contractBalance = await token.balanceOf(token.address)
        expect(contractBalance).to.equal(ethers.utils.parseEther("1"))
        // Expect stakedBalance to monitor the stakes
        var user1StakeBalance = await token.getStakedBalance(user1.address)
        expect(user1StakeBalance).to.equal(ethers.utils.parseEther("1"))

        // Decrease Stake
        await token.connect(user1).decreaseStake(ethers.utils.parseEther("0.5"))
        // Expect user balance to be increased
        user1Balance = await token.balanceOf(user1.address)
        expect(user1Balance).to.equal(ethers.utils.parseEther("9.5"))
        // Expect contract balance to be decreased
        contractBalance = await token.balanceOf(token.address)
        expect(contractBalance).to.equal(ethers.utils.parseEther("0.5"))
        // Expect stakedBalance to monitor the stakes
        user1StakeBalance = await token.getStakedBalance(user1.address)
        expect(user1StakeBalance).to.equal(ethers.utils.parseEther("0.5"))

    })
    it("Users with Stake amount over submit minimum can submit an image with data", async function () {
        const { token, owner, user1: submitter, user2: validator } = await loadFixture(
            deployDataDAOFixture
        )
        const priceInEther = 1;
        await token.connect(owner).setSalesSettings(owner.address, priceInEther);
        const submitMinimum = "10";
        const validateMinimum = "100";
        await token.connect(owner).setLimits(submitMinimum, validateMinimum);
        await token.connect(submitter).purchaseTokens({ value: ethers.utils.parseEther(submitMinimum) })
        await token.connect(submitter).stakeTokens(ethers.utils.parseEther(submitMinimum))


        
    })
})
