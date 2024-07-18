require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 10,
    },
  },
  networks: {
    sepolia: {
      url: 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    opencampus: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      sepolia: "abc",
      opencampus:"abc"
    },
    customChains: [
      {
        network: "opencampus",
        chainId: 656476,
        urls: {
          apiURL: "	https://opencampus-codex.blockscout.com/api",
          browserURL: "	https://opencampus-codex.blockscout.com/",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

