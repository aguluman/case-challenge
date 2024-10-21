export class CreateVirtualAccountTransactionDTO {
    value: number;
    description: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    currency: string;
    merchant_id: string
    transactionType: string = 'virtual_account'; // Default transaction type
}