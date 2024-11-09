import Image from 'next/image';

export type ValidChainId = 42161 | 8453 | 41923 | 2818;

export const chainInfo: Record<ValidChainId, {
    name: string;
    logoUrl: string;
}> = {
    42161: {
        name: "Arbitrum",
        logoUrl: "/arbitrum-logo.png" // Replace with actual Arbitrum logo URL
    },
    8453: {
        name: "Base",
        logoUrl: "/base-logo.png" // Replace with actual Base logo URL
    },
    41923: {
        name: "EDU Chain",
        logoUrl: "https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg"
    },
    2818: {
        name: "Morph",
        logoUrl: "/morph-logo.png"
    }

};

export const getChainOptions = () => {
    return Object.entries(chainInfo).map(([chainId, info]) => ({
        value: chainId,
        label: info.name,
        icon: (
            <Image
                src={info.logoUrl}
                alt={`${info.name} logo`}
                width={24}
                height={24}
                className="w-6 h-6 mr-2"
            />
        )
    }));
};