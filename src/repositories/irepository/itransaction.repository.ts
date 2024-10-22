import { VirtualAccountTransaction } from 'src/entities/virtual-account-transaction.entity';
import { CardTransaction } from '../../entities/card-transaction.entity';
import { Transaction } from '../../entities/transaction.entity';

export interface ITransactionRepository {
    createCardTransaction(data: Partial<CardTransaction>): Promise<CardTransaction>;

    createVirtualAccountTransaction(data: Partial<VirtualAccountTransaction>): Promise<VirtualAccountTransaction>;

    settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransaction>;

    listAllCardTransactions(): Promise<CardTransaction[]>;

    listAllVirtualAccountTransactions(): Promise<VirtualAccountTransaction[]>;

    findSettledTransactionsByMerchant(merchant_id: string): Promise<Transaction[]>;

    updateTransactionsWithPayout(transactions: Transaction[], payoutId: string): Promise<void>;

    getMerchantBalance(merchantId: string): Promise<{ availableBalance: number; pendingSettlementBalance: number; }>;
}
