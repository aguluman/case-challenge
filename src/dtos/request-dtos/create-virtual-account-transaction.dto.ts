import { TransactionType } from '../../enums/transaction.type';

export class CreateVirtualAccountTransactionDTO {
    value: number;
    description: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    currency: string;
    merchant_id: string;
    transactionType: TransactionType.VirtualAccount; // Default transaction type
}
