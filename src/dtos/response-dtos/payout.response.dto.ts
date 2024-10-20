export class PayoutResponseDto {
    merchantId: string;
    totalAmount: number; //payout after fees
    settledTransactions: number; //number of transactions settled
    feeDeducted: number; //fee deducted from the total amount
    payoutDate: Date;
}
