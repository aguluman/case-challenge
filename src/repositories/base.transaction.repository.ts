import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

export class BaseTransactionRepository {
    constructor(private readonly transactionRepo: Repository<Transaction>) {}

    async saveTransaction(transaction: Transaction): Promise<Transaction> {
        return this.transactionRepo.save(transaction);
    }
}