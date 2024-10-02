import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'

interface ChainSelectorProps {
    selectedChain: ValidChainId | 'all';
    onChainSelect: (chain: ValidChainId | 'all') => void;
}

export function ChainSelector({ selectedChain, onChainSelect }: ChainSelectorProps) {
    return (
        <Select value={selectedChain.toString()} onValueChange={(value) => onChainSelect(value as ValidChainId | 'all')}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                {Object.entries(chainInfo).map(([id, info]) => (
                    <SelectItem key={id} value={id}>
                        <div className="flex items-center">
                            <Image src={info.logoUrl} alt={info.name} width={20} height={20} className="mr-2" />
                            {info.name}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}