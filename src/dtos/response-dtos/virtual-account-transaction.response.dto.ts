export class VirtualAccountTransactionResponseDTO {
    id: string;
    value: number;
    description: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    currency: string;
    status: string;
    fee: number;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
    transactionType: string = 'virtual_account';
}