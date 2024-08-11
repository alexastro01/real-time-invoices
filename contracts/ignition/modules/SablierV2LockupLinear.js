const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("SablierV2LockupLinearModule", (m) => {
  const contract = m.contract("SablierV2LockupLinear", ["0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f","0xC7Ed1d2c781d2391677857007F0784486a97AdD4"]);
  
  
  return { contract };
});

module.exports = TokenModule;