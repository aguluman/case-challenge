import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { CardTransaction } from '../entities/card-transaction.entity';
import { VirtualAccountTransaction } from '../entities/virtual-account-transaction.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../enums/transaction.status';
import { ITransactionRepository } from './irepository/itransaction.repository';
import { Payout } from '../entities/payouts.entity';
import { BaseTransactionRepository } from './base.transaction.repository';
@injectable()
export class TransactionRepository extends BaseTransactionRepository implements ITransactionRepository {
    constructor(
        @inject('CardTransactionRepository')
        private readonly cardTransactionRepo: Repository<CardTransaction>,
        @inject('VirtualAccountTransactionRepository')
        private readonly virtualAccountRepo: Repository<VirtualAccountTransaction>,
        @inject('CoreTransactionRepository')
            transactionRepo: Repository<Transaction>,
    ) {
        super(transactionRepo);
    }

    async createCardTransaction(
        data: Partial<CardTransaction>,
    ): Promise<CardTransaction> {
        const transaction = this.cardTransactionRepo.create(data);
        await this.saveTransaction(transaction);
        return this.cardTransactionRepo.save(transaction);
    }

    async createVirtualAccountTransaction(
        data: Partial<VirtualAccountTransaction>,
    ): Promise<VirtualAccountTransaction> {
        const transaction = this.virtualAccountRepo.create(data);
        await this.saveTransaction(transaction);
        return this.virtualAccountRepo.save(transaction);
    }

    async settleCardTransaction(
        reference: string,
        cardNumber: string,
    ): Promise<CardTransaction> {
        const transaction = await this.cardTransactionRepo.findOneBy({
            reference,
            card_number_last4: cardNumber,
        });
        if (transaction) {
            transaction.status = TransactionStatus.SUCCESS;
            await this.saveTransaction(transaction); // Save to base transaction table
            return this.cardTransactionRepo.save(transaction);
        }
        throw new Error('Transaction not found');
    }

    async findSettledTransactionsByMerchant(
        merchant_id: string,
    ): Promise<CardTransaction[]> {
        return await this.cardTransactionRepo.find({
            where: { merchant_id, status: TransactionStatus.SUCCESS },
        });
    }

    async updateTransactionsWithPayout(
        transactions: CardTransaction[],
        payoutId: string,
    ): Promise<void> {
        for (const transaction of transactions) {
            if (!transaction.payout) {
                transaction.payout = new Payout(); // Initialize the payout property if undefined
            }
            transaction.payout.id = payoutId;
            await this.saveTransaction(transaction); // Save to base transaction table
            await this.cardTransactionRepo.save(transaction);
        }
    }

    async getMerchantBalance(
        merchant_id: string,
    ): Promise<{ availableBalance: number; pendingSettlementBalance: number }> {
        const transactions = await this.cardTransactionRepo.find({
            where: { merchant_id },
        });

        let availableBalance = 0;
        let pendingSettlementBalance = 0;

        for (const transaction of transactions) {
            if (transaction.status === TransactionStatus.SUCCESS) {
                availableBalance += transaction.transaction_value;
            } else if (transaction.status === TransactionStatus.PENDING) {
                pendingSettlementBalance += transaction.transaction_value;
            }
        }

        return { availableBalance, pendingSettlementBalance };
    }

    async listAllCardTransactions(): Promise<CardTransaction[]> {
        return this.cardTransactionRepo.find();
    }

    async listAllVirtualAccountTransactions(): Promise<VirtualAccountTransaction[]> {
        return this.virtualAccountRepo.find();
    }
}