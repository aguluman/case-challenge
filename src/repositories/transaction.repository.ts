import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { CardTransaction } from '../entities/card-transaction.entity';
import { VirtualAccountTransaction } from '../entities/virtual-account-transaction.entity';
import { Merchant } from '../entities/merchant.entity';
import { CreateCardTransactionDTO } from '../dtos/request-dtos/create-card-transaction.dto';
import { CreateVirtualAccountTransactionDTO } from '../dtos/request-dtos/create-virtual-account-transaction.dto';
import { TransactionStatus } from '../enums/transaction.status';
import { generateUniqueReference } from '../utils/generate-unique-reference';


@injectable()
export class TransactionRepository {
    constructor(
        @inject('CardTransactionRepository')
        private cardTransactionRepo: Repository<CardTransaction>,
        @inject('VirtualAccountTransactionRepository')
        private virtualAccountRepo: Repository<VirtualAccountTransaction>,
        @inject('MerchantRepository')
        private merchantRepo: Repository<Merchant>,
    ) {
    }

    async createCardTransaction(data: CreateCardTransactionDTO): Promise<CardTransaction> {
        const { value, cardNumber, ...otherDetails } = data;
        const lastFourDigits = cardNumber.slice(-4);

        const transaction = this.cardTransactionRepo.create({
            ...otherDetails,
            transaction_value: value,
            card_number_last4: lastFourDigits,
            status: TransactionStatus.PENDING,  // Set as pending
            fee: value * 0.03, // Apply 3% fee
            reference: generateUniqueReference(),
        });

        return this.cardTransactionRepo.save(transaction);
    }

    async createVirtualAccountTransaction(data: CreateVirtualAccountTransactionDTO): Promise<VirtualAccountTransaction> {
        const { value, ...otherDetails } = data;

        const transaction = this.virtualAccountRepo.create({
            ...otherDetails,
            transaction_value: value,
            status: TransactionStatus.SUCCESS,  // Set as success immediately
            fee: value * 0.05, // Apply 5% fee
            reference: generateUniqueReference(),
        });

        return this.virtualAccountRepo.save(transaction);
    }

    async settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransaction> {
        const transaction = await this.cardTransactionRepo.findOneBy({ reference, card_number_last4: cardNumber });
        if (transaction) {
            transaction.status = TransactionStatus.SUCCESS;  // Update status to success
            return this.cardTransactionRepo.save(transaction);
        }
        throw new Error('Transaction not found');
    }

    async listAllCardTransactions(): Promise<CardTransaction[]> {
        return this.cardTransactionRepo.find();
    }

    async listAllVirtualAccountTransactions(): Promise<VirtualAccountTransaction[]> {
        return this.virtualAccountRepo.find();
    }
}