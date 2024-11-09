import { ValidChainId } from "../multi-chain/MultiChainSelectOptions";

export const contracts: Record<ValidChainId, {
    USDCAddress: `0x${string}`;
    sablierLinearV2LockUpAddress: `0x${string}`;
}> = {
    //OPEN CAMPUS
    41923: {
        USDCAddress: "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342",
        sablierLinearV2LockUpAddress: "0x6874D9b968Fc5438C596776AEa48944B3155F6E6"
    },
    //BASE 
    8453: {
        USDCAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        sablierLinearV2LockUpAddress: "0x4CB16D4153123A74Bc724d161050959754f378D8"
    },
    //ARBITRUM 
    42161: {
        USDCAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        sablierLinearV2LockUpAddress: "0x05a323a4C936fed6D02134c5f0877215CD186b51"
    },
    //MORPH 
    2818: {
        USDCAddress: "0x1199E23C0baE9710cCd9F645FA57794e5D469D06 ",
        sablierLinearV2LockUpAddress: "0xAC19F4181E58efb7094e0cb4e1BB18c79F6AAdf4"
    }
};