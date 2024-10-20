import { inject, injectable } from 'tsyringe';
import { CreateCardTransactionDTO } from '../dtos/request-dtos/create-card-transaction.dto';
import { CreateVirtualAccountTransactionDTO } from '../dtos/request-dtos/create-virtual-account-transaction.dto';
import { CardTransactionResponseDTO } from '../dtos/response-dtos/card-transaction-response.dto';
import { VirtualAccountTransactionResponseDTO } from 'src/dtos/response-dtos/virtual-account-transaction.response.dto';
import { ITransactionRepository } from '../repositories/irepository/itransaction.repository';
import { ITransactionService } from './iservice/itransaction.service';
import { generateUniqueReference } from '../utils/generate-unique-reference';
import { TransactionStatus } from '../enums/transaction.status';
@injectable()
export class TransactionService implements ITransactionService {
    constructor(
        @inject('TransactionRepository') private transactionRepo: ITransactionRepository,
    ) {}

    async createCardTransaction(data: CreateCardTransactionDTO): Promise<CardTransactionResponseDTO> {
        const { value, cardNumber, ...otherDetails } = data;
        const lastFourDigits = cardNumber.slice(-4);
        const fee = value * 0.03;

        const transaction = await this.transactionRepo.createCardTransaction({
            ...otherDetails,
            transaction_value: value,
            card_number_last4: lastFourDigits,
            status: TransactionStatus.PENDING, // Set as pending,
            fee,
            reference: generateUniqueReference(),
        });

        return {
            id: transaction.id,
            value: transaction.transaction_value,
            cardNumberLast4: transaction.card_number_last4,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
        };
    }

    async createVirtualAccountTransaction(data: CreateVirtualAccountTransactionDTO): Promise<VirtualAccountTransactionResponseDTO> {
        const { value, ...otherDetails } = data;
        const fee = value * 0.05;

        const transaction =
            await this.transactionRepo.createVirtualAccountTransaction({
                ...otherDetails,
                transaction_value: value,
                status: TransactionStatus.SUCCESS, // Set as success,
                fee,
                reference: generateUniqueReference(),
            });

        return {
            id: transaction.id,
            value: transaction.transaction_value,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
        };
    }

    async settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransactionResponseDTO> {
        const transaction = await this.transactionRepo.settleCardTransaction(reference, cardNumber);

        return {
            id: transaction.id,
            value: transaction.transaction_value,
            cardNumberLast4: transaction.card_number_last4,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
        };
    }

    async listAllCardTransactions(): Promise<CardTransactionResponseDTO[]> {
        const transactions = await this.transactionRepo.listAllCardTransactions();

        return transactions.map(transaction => ({
            id: transaction.id,
            value: transaction.transaction_value,
            cardNumberLast4: transaction.card_number_last4,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
        }));
    }

    async listAllVirtualAccountTransactions(): Promise<VirtualAccountTransactionResponseDTO[]> {
        const transactions = await this.transactionRepo.listAllVirtualAccountTransactions();

        return transactions.map(transaction => ({
            id: transaction.id,
            value: transaction.transaction_value,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
        }));
    }
}