export class CreateTransactionDto {
    value: number;
    description: string;
    card_number?: string; // Card-specific fields
    cardholder_name?: string;
    expiration_date?: string;
    cvv?: string;
    account_name?: string;  // Virtual Account-specific fields
    account_number?: string;
    bank_code?: string;
    currency: string;
}
