require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
    
  ignition: {
    requiredConfirmations: 1
  },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yulDetails: {
            optimizerSteps: "u",
          },
        },
      },
      viaIR: true,

    },
  },
  networks: {
    sepolia: {
      url: 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    opencampus: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    morphTestnet: {
      url: 'https://rpc-quicknode-holesky.morphl2.io',
      accounts: [`${process.env.PRIVATE_KEY}`],
      gasprice: 2000000000
    },
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      sepolia: "abc",
      opencampus: "abc",
      morphTestnet: "abc"
    },
    customChains: [
      {
        network: "opencampus",
        chainId: 656476,
        urls: {
          apiURL: "https://explorer-api-holesky.morphl2.io/api",
          browserURL: "https://explorer-holesky.morphl2.io/",
        },
      },
      {
        network: 'morphTestnet',
        chainId: 2810,
        urls: {
          apiURL: 'https://explorer-api-holesky.morphl2.io/api? ',
          browserURL: 'https://explorer-holesky.morphl2.io/',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
