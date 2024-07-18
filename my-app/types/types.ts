export type SupportedNetwork = "sepolia" | "mumbai"


export type generateRequestParamatersParams = {
    payeeIdentity: string,
    payerIdentity: string,
    expectedAmount: string,
    feeRecipient?: string,
    tokenAddress?: string,
    dueDate: string | Date | number,
    reason: string,
    expectedFlowRate: string

}

export type WaveInConfirmationData = {
    dueDate: string,
    reason: string,
    payee: string,
    payer: string
    currencyAddress: string,
    expectedAmount: string | number,
    requestId: string,
    expectedFlowRate: string
}


export type WaveInData = {
    dueDate: string,
    reason: string,
    payee: string,
    payer: string
    currencyAddress: string,
    expectedAmount: string | number,
    requestId: string,
    expectedFlowRate: string
    currentBalance: number
}