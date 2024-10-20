import { VirtualAccountTransaction } from 'src/entities/virtual-account-transaction.entity';
import { CardTransaction } from '../../entities/card-transaction.entity';

export interface ITransactionRepository {
    createCardTransaction(data: Partial<CardTransaction>): Promise<CardTransaction>;

    createVirtualAccountTransaction(data: Partial<VirtualAccountTransaction>): Promise<VirtualAccountTransaction>;

    settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransaction>;

    listAllCardTransactions(): Promise<CardTransaction[]>;

    listAllVirtualAccountTransactions(): Promise<VirtualAccountTransaction[]>;

    findSettledTransactionsByMerchant(merchantId: string): Promise<CardTransaction[]>;

    updateTransactionsWithPayout(transactions: CardTransaction[], payoutId: string): Promise<void>;

    getMerchantBalance(merchantId: string): Promise<{ availableBalance: number; pendingSettlementBalance: number; }>;
}