require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                        details: { yul: false },
                    },
                }

            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                        details: { yul: false },
                    },
                }

            }
        ],
    },
    defaultNetwork: "Calibration",
    networks: {
        Calibration: {
            chainId: 314159,
            url: "https://api.calibration.node.glif.io/rpc/v1",
            allowUnlimitedContractSize: true,
            blockGasLimit: 339_477_658,
            accounts: [PRIVATE_KEY],
        },
        FilecoinMainnet: {
            chainId: 314,
            url: "https://api.node.glif.io",
            accounts: [PRIVATE_KEY],
        },
        polygon_mumbai: {
            chainId: 80001,
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [PRIVATE_KEY],
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}
