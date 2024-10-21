export class CardTransactionResponseDTO {
    id: string;
    value: number;
    description: string;
    cardNumberLast4: string;
    cardHolderName: string;
    expirationDate: string;
    currency: string;
    status: string;
    fee: number;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
    transactionType: string = 'card';
}