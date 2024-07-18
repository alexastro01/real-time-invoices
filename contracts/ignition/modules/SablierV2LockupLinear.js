const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("SablierV2LockupLinearModule", (m) => {
  const contract = m.contract("SablierV2LockupLinear", ["0xEa64073446E6AFd80574D8a72c8E9af547a43018","0xE18A7cD8433DCa70a1f53B7680DeB567ACEE3751"]);
  
  
  return { contract };
});

module.exports = TokenModule;