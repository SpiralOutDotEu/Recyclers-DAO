const { ethers } = require("hardhat")

require("hardhat-deploy")
require("hardhat-deploy-ethers")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { get } = deployments;

    const token = await get("DataGovernanceToken")
    const tokenContract = await ethers.getContractAt("DataGovernanceToken", token.address)

    const stakeTx = await tokenContract.stakeTokens(ethers.utils.parseEther("100"))
    await stakeTx.wait();
    console.log("stake Tx!", stakeTx)

    // Submit sample data
    const submitDataTx = await tokenContract.submitData(
        "QmRLh5zSRpL3Lu5qMP38g5MwEF2Wgow8inuLpeqYGguYwL",
        "plastic",
        "waste",
        "fanta",
        "5000112632125"
    );
    await submitDataTx.wait();
    console.log("submitted data!", submitDataTx)

    
}
module.exports.tags = ['Action'];
module.exports.dependencies = ['Token'];