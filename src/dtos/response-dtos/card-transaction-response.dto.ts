export class CardTransactionResponseDTO {
    id: string;
    value: number;
    cardNumberLast4: string;
    status: string;
    fee: number;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
}