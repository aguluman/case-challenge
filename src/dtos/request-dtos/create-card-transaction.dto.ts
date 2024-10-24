import { TransactionType } from '../../enums/transaction.type';

export class CreateCardTransactionDTO {
    value: number;
    description: string;
    cardNumber: string; // the last 4 digits will be stored
    cardHolderName: string;
    expirationDate: string; // formatted as 'MM/YY'
    cvv: string;
    currency: string;
    merchant_id: string;
    transactionType: TransactionType.Card; // Default transaction type
}
