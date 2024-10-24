import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../enums/transaction.status';
import { ITransactionRepository } from './irepository/itransaction.repository';
import { Payout } from '../entities/payouts.entity';

@injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @inject('CardTransactionRepository')
        private readonly cardTransactionRepo: Repository<Transaction>,
        @inject('VirtualAccountTransactionRepository')
        private readonly virtualAccountRepo: Repository<Transaction>,
        @inject('UpdateTransactionRepository')
        private readonly updateTransactionRepo: Repository<Transaction>,
    ) {
    }

    async createCardTransaction(
        data: Partial<Transaction>,
    ): Promise<Transaction> {
        const transaction = this.cardTransactionRepo.create(data);
        return this.cardTransactionRepo.save(transaction);
    }

    async createVirtualAccountTransaction(
        data: Partial<Transaction>,
    ): Promise<Transaction> {
        const transaction = this.virtualAccountRepo.create(data);
        return this.virtualAccountRepo.save(transaction);
    }

    async settleCardTransaction(
        reference: string,
        cardNumber: string,
    ): Promise<Transaction> {
        const transaction = await this.cardTransactionRepo.findOneBy({
            reference,
            card_number_last4: cardNumber,
        });
        if (transaction) {
            transaction.status = TransactionStatus.SUCCESS;
            return this.cardTransactionRepo.save(transaction);
        }
        throw new Error('Transaction not found');
    }

    async findSettledTransactions(
        merchant_id: string,
    ): Promise<Transaction[]> {
        const [cardTransactions, virtualAccountTransactions] = await Promise.all([
            this.cardTransactionRepo.find({
                where: { merchant_id, status: TransactionStatus.SUCCESS },
            }),
            this.virtualAccountRepo.find({
                where: { merchant_id, status: TransactionStatus.SUCCESS },
            }),
        ]);

        return [...cardTransactions, ...virtualAccountTransactions];
    }

    async updateTransactionsWithPayout(
        transactions: Transaction[],
        payoutId: string,
    ): Promise<void> {
        for (const transaction of transactions) {
            if (!transaction.payout) {
                transaction.payout = new Payout();
            }
            transaction.payout.id = payoutId;
            await this.updateTransactionRepo.save(transaction);
        }
    }

    async getMerchantBalance(
        merchant_id: string,
    ): Promise<{ availableBalance: number; pendingSettlementBalance: number }> {
        const cardTransactions = await this.cardTransactionRepo.find({
            where: { merchant_id },
        });

        const virtualAccountTransactions = await this.virtualAccountRepo.find({
            where: { merchant_id },
        });

        let availableBalance = 0;
        let pendingSettlementBalance = 0;

        const allTransactions = [...cardTransactions, ...virtualAccountTransactions];

        for (const transaction of allTransactions) {
            const transactionValue = Number(transaction.transaction_value);
            if (transaction.status === TransactionStatus.SUCCESS) {
                availableBalance += transactionValue;
            } else if (transaction.status === TransactionStatus.PENDING) {
                pendingSettlementBalance += transactionValue;
            }
        }

        return { availableBalance, pendingSettlementBalance }; //create a db entity for merchant balance.
    }

    async listAllCardTransactions(): Promise<Transaction[]> {
        return this.cardTransactionRepo.find();
    }

    async listAllVirtualAccountTransactions(): Promise<Transaction[]> {
        return this.virtualAccountRepo.find();
    }
}