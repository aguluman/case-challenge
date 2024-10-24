import { inject, injectable } from 'tsyringe';
import { CreateCardTransactionDTO } from '../dtos/request-dtos/create-card-transaction.dto';
import { CreateVirtualAccountTransactionDTO } from '../dtos/request-dtos/create-virtual-account-transaction.dto';
import { CardTransactionResponseDTO } from '../dtos/response-dtos/card-transaction-response.dto';
import { VirtualAccountTransactionResponseDTO } from 'src/dtos/response-dtos/virtual-account-transaction.response.dto';
import { ITransactionRepository } from '../repositories/irepository/itransaction.repository';
import { ITransactionService } from './iservice/itransaction.service';
import { generateUniqueReference } from '../utils/generate-unique-reference';
import { TransactionStatus } from '../enums/transaction.status';
import { IMerchantRepository } from 'src/repositories/irepository/imerchant.repository';
import { TransactionType } from '../enums/transaction.type';

@injectable()
export class TransactionService implements ITransactionService {
    constructor(
        @inject('TransactionRepository') private readonly transactionRepo: ITransactionRepository,
        @inject('MerchantRepository') private readonly merchantRepo: IMerchantRepository,
    ) {
    }

    async createCardTransaction(data: CreateCardTransactionDTO): Promise<CardTransactionResponseDTO> {
        const {
            value,
            cardNumber,
            description,
            cardHolderName,
            expirationDate,
            cvv,
            currency,
            merchant_id,
            ...otherDetails
        } = data;
        const lastFourDigits = cardNumber.slice(-4);
        const fee = value * 0.03;

        // Fetch the Merchant entity
        const merchant = await this.merchantRepo.findMerchantId(merchant_id);
        if (!merchant) {
            throw new Error('Merchant not found');
        }

        const transaction = await this.transactionRepo.createCardTransaction({
            ...otherDetails,
            transaction_value: value,
            card_number_last4: lastFourDigits,
            transaction_desc: description,
            cardholder_name: cardHolderName,
            card_expiration_date: expirationDate,
            currency: currency,
            cvv: cvv,
            status: TransactionStatus.PENDING, // Set as pending,
            fee,
            merchant_id,
            merchant,
            transaction_type: TransactionType.Card,
            reference: generateUniqueReference(),
        });
        return {
            id: transaction.id,
            value: transaction.transaction_value,
            description: transaction.transaction_desc,
            cardNumberLast4: transaction.card_number_last4,
            cardHolderName: transaction.cardholder_name,
            expirationDate: transaction.card_expiration_date,
            currency: transaction.currency,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: TransactionType.Card,
        };
    }

    async createVirtualAccountTransaction(data: CreateVirtualAccountTransactionDTO): Promise<VirtualAccountTransactionResponseDTO> {
        const {
            value,
            description,
            accountName,
            accountNumber,
            bankCode,
            currency,
            merchant_id,
            ...otherDetails
        } = data;
        const fee = value * 0.05;

        // Fetch the Merchant entity
        const merchant = await this.merchantRepo.findMerchantId(merchant_id);
        if (!merchant) {
            throw new Error('Merchant not found');
        }

        const transaction = await this.transactionRepo.createVirtualAccountTransaction({
            ...otherDetails,
            transaction_value: value,
            transaction_desc: description,
            account_name: accountName,
            account_number: accountNumber,
            bank_code: bankCode,
            status: TransactionStatus.SUCCESS, // Set as success,
            fee,
            currency: currency,
            merchant_id,
            merchant,
            transaction_type: TransactionType.VirtualAccount,
            reference: generateUniqueReference(),
        });

        return {
            id: transaction.id,
            value: transaction.transaction_value,
            description: transaction.transaction_desc,
            accountName: transaction.account_name,
            accountNumber: transaction.account_number,
            bankCode: transaction.bank_code,
            currency: transaction.currency,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: TransactionType.VirtualAccount,
        };
    }

    async settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransactionResponseDTO> {
        const transaction = await this.transactionRepo.settleCardTransaction(reference, cardNumber);

        return {
            id: transaction.id,
            value: transaction.transaction_value,
            description: transaction.transaction_desc,
            cardNumberLast4: transaction.card_number_last4,
            cardHolderName: transaction.cardholder_name,
            expirationDate: transaction.card_expiration_date,
            currency: transaction.currency,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: TransactionType.Card,
        };
    }

    async listAllCardTransactions(): Promise<CardTransactionResponseDTO[]> {
        const transactions = await this.transactionRepo.listAllCardTransactions();

        return transactions.map(transaction => ({
            id: transaction.id,
            value: transaction.transaction_value,
            description: transaction.transaction_desc,
            cardNumberLast4: transaction.card_number_last4,
            cardHolderName: transaction.cardholder_name,
            expirationDate: transaction.card_expiration_date,
            currency: transaction.currency,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: TransactionType.Card,
        }));
    }

    async listAllVirtualAccountTransactions(): Promise<VirtualAccountTransactionResponseDTO[]> {
        const transactions = await this.transactionRepo.listAllVirtualAccountTransactions();

        return transactions.map(transaction => ({
            id: transaction.id,
            value: transaction.transaction_value,
            description: transaction.transaction_desc,
            accountName: transaction.account_name,
            accountNumber: transaction.account_number,
            bankCode: transaction.bank_code,
            currency: transaction.currency,
            status: transaction.status,
            fee: transaction.fee,
            reference: transaction.reference,
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: TransactionType.VirtualAccount,
        }));
    }
}