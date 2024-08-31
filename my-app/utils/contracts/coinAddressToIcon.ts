type CoinAddress = string;
type IconPath = string;

export const coinAddressToIcon: Record<CoinAddress, IconPath> = {
    // OPEN CAMPUS tUSDC
    "0x8c88F4205D24619cB3F11B3925312Df0d484F4e7": '/usdc.png',
    // BASE SEPOLIA tUSDC
    "0xf6dC757C9F7E5e5eE5787c31f2aBEa4B19001015": '/usdc.png',
    // ARBITRUM SEPOLIA tUSDC
    "0x37ff5b5f37038db083957c415d5b105ee2e27e4f": '/usdc.png',
    // MORPH HOLESKY USDT
    "0x67330f6BC8dcE05816662785A89fb0611F6D149F": '/usdt.png'
};