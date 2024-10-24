import { Transaction } from '../../entities/transaction.entity';

export interface ITransactionRepository {


    createCardTransaction(data: Partial<Transaction>): Promise<Transaction>;

    createVirtualAccountTransaction(data: Partial<Transaction>): Promise<Transaction>;

    settleCardTransaction(reference: string, cardNumber: string): Promise<Transaction>;

    listAllCardTransactions(): Promise<Transaction[]>;

    listAllVirtualAccountTransactions(): Promise<Transaction[]>;

    findSettledTransactions(merchant_id: string): Promise<Transaction[]>;

    updateTransactionsWithPayout(transactions: Transaction[], payoutId: string): Promise<void>;

    getMerchantBalance(merchantId: string): Promise<{ availableBalance: number; pendingSettlementBalance: number; }>;
}
