const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("SablierV2NFTDescriptorModule", (m) => {
  const contract = m.contract("SablierV2NFTDescriptor");
  
  
  return { contract };
});

module.exports = TokenModule;