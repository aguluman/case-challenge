//Unit Test for TransactionService
import 'reflect-metadata';
import { TransactionService } from '../src/services/transaction.service';
import { ITransactionRepository } from '../src/repositories/irepository/itransaction.repository';
import { IMerchantRepository } from '../src/repositories/irepository/imerchant.repository';
import { CreateCardTransactionDTO } from '../src/dtos/request-dtos/create-card-transaction.dto';
import { CreateVirtualAccountTransactionDTO } from '../src/dtos/request-dtos/create-virtual-account-transaction.dto';
import { CardTransactionResponseDTO } from '../src/dtos/response-dtos/card-transaction-response.dto';
import {
    VirtualAccountTransactionResponseDTO,
} from '../src/dtos/response-dtos/virtual-account-transaction.response.dto';
import { Merchant } from '../src/entities/merchant.entity';
import { TransactionStatus } from '../src/enums/transaction.status';
import { CardTransaction } from '../src/entities/card-transaction.entity';
import { VirtualAccountTransaction } from '../src/entities/virtual-account-transaction.entity';


jest.mock('../src/utils/generate-unique-reference', () => ({
    generateUniqueReference: jest.fn().mockReturnValue('ref123'),
}));
describe('TransactionService-TestSuite', () => {
    let transactionService: TransactionService;
    let transactionRepo: jest.Mocked<ITransactionRepository>;
    let merchantRepo: jest.Mocked<IMerchantRepository>;

    beforeEach(() => {
        transactionRepo = {
            createCardTransaction: jest.fn(),
            createVirtualAccountTransaction: jest.fn(),
            settleCardTransaction: jest.fn(),
            listAllCardTransactions: jest.fn(),
            listAllVirtualAccountTransactions: jest.fn(),
        } as any;

        merchantRepo = {
            findMerchantId: jest.fn(),
        } as any;

        transactionService = new TransactionService(transactionRepo, merchantRepo);
    });


    it('should create a card transaction', async () => {
        const data: CreateCardTransactionDTO = {
            value: 100,
            cardNumber: '1234567812345678',
            description: 'Test transaction',
            cardHolderName: 'John Doe',
            expirationDate: '12/23',
            cvv: '123',
            currency: 'NGN',
            merchant_id: 'merchant123',
            transactionType: 'card',
        };
        const merchant: Merchant = {
            id: 'merchant123',
            name: 'Test Merchant',
            email: 'test@example.com',
            bank_account_number: '1234567890',
            bank_code: '001',
            created_at: new Date(),
            updated_at: new Date(),
            transactions: [],
            payouts: [],
        };
        const transaction: CardTransaction = {
            id: 'transaction123',
            transaction_value: 100,
            fee: 3,
            transaction_desc: 'Test transaction',
            card_number_last4: '5678',
            cardholder_name: 'John Doe',
            card_expiration_date: '12/23',
            currency: 'NGN',
            cvv: '123',
            status: TransactionStatus.PENDING,
            created_at: new Date(),
            updated_at: new Date(),
            merchant_id: 'merchant123',
            reference: 'ref123',
            merchant: merchant,
            payout: null,
            transaction_type: 'card',
        };

        merchantRepo.findMerchantId.mockResolvedValue(merchant);
        transactionRepo.createCardTransaction.mockResolvedValue(transaction);

        const result: CardTransactionResponseDTO = await transactionService.createCardTransaction(data);

        expect(result).toEqual({
            id: 'transaction123',
            value: 100,
            description: 'Test transaction',
            cardNumberLast4: '5678',
            cardHolderName: 'John Doe',
            expirationDate: '12/23',
            currency: 'NGN',
            status: TransactionStatus.PENDING,
            fee: 3,
            reference: 'ref123',
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: 'card',
        });
        expect(merchantRepo.findMerchantId).toHaveBeenCalledWith('merchant123');
        expect(transactionRepo.createCardTransaction).toHaveBeenCalledWith(expect.objectContaining({
            transaction_value: 100,
            card_number_last4: '5678',
            transaction_desc: 'Test transaction',
            cardholder_name: 'John Doe',
            card_expiration_date: '12/23',
            currency: 'NGN',
            status: TransactionStatus.PENDING,
            fee: 3,
            merchant_id: 'merchant123',
            reference: 'ref123',
            transaction_type: 'card',
        }));
    });

    it('should create a virtual account transaction', async () => {
        const data: CreateVirtualAccountTransactionDTO = {
            value: 200,
            description: 'Test virtual account transaction',
            accountName: 'John Doe',
            accountNumber: '1234567890',
            bankCode: '001',
            currency: 'NGN',
            merchant_id: 'merchant123',
            transactionType: 'virtual_account',
        };
        const merchant: Merchant = {
            id: 'merchant123',
            name: 'Test Merchant',
            email: 'test@example.com',
            bank_account_number: '1234567890',
            bank_code: '001',
            created_at: new Date(),
            updated_at: new Date(),
            transactions: [],
            payouts: [],
        };
        const transaction: VirtualAccountTransaction = {
            id: 'transaction123',
            transaction_value: 200,
            fee: 10,
            transaction_desc: 'Test virtual account transaction',
            account_name: 'John Doe',
            account_number: '1234567890',
            bank_code: '001',
            currency: 'NGN',
            status: TransactionStatus.SUCCESS,
            created_at: new Date(),
            updated_at: new Date(),
            merchant_id: merchant.id,
            reference: 'ref123',
            merchant: merchant,
            payout: null,
            transaction_type: 'virtual_account',
        };

        merchantRepo.findMerchantId.mockResolvedValue(merchant);
        transactionRepo.createVirtualAccountTransaction.mockResolvedValue(transaction);

        const result: VirtualAccountTransactionResponseDTO = await transactionService.createVirtualAccountTransaction(data);

        expect(result).toEqual({
            id: 'transaction123',
            value: 200,
            description: 'Test virtual account transaction',
            accountName: 'John Doe',
            accountNumber: '1234567890',
            bankCode: '001',
            currency: 'NGN',
            status: TransactionStatus.SUCCESS,
            fee: 10,
            reference: 'ref123',
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: 'virtual_account',
        });
        expect(merchantRepo.findMerchantId).toHaveBeenCalledWith('merchant123');
        expect(transactionRepo.createVirtualAccountTransaction).toHaveBeenCalledWith(expect.objectContaining({
            transaction_value: 200,
            transaction_desc: 'Test virtual account transaction',
            account_name: 'John Doe',
            account_number: '1234567890',
            bank_code: '001',
            currency: 'NGN',
            status: TransactionStatus.SUCCESS,
            fee: 10,
            merchant_id: 'merchant123',
            reference: 'ref123',
            transaction_type: 'virtual_account',
        }));
    });


    it('should settle a card transaction', async () => {
        const reference = 'ref123';
        const cardNumber = '1234';
        const transaction: CardTransaction = {
            id: 'transaction123',
            transaction_value: 100,
            fee: 3,
            transaction_desc: 'Test transaction',
            card_number_last4: '5678',
            cardholder_name: 'John Doe',
            card_expiration_date: '12/23',
            currency: 'NGN',
            cvv: '123',
            status: TransactionStatus.SUCCESS,
            created_at: new Date(),
            updated_at: new Date(),
            merchant_id: 'merchant123',
            reference: 'ref123',
            merchant: null,
            payout: null,
            transaction_type: 'card',
        };

        transactionRepo.settleCardTransaction.mockResolvedValue(transaction);

        const result: CardTransactionResponseDTO = await transactionService.settleCardTransaction(reference, cardNumber);

        expect(result).toEqual({
            id: 'transaction123',
            value: 100,
            description: 'Test transaction',
            cardNumberLast4: '5678',
            cardHolderName: 'John Doe',
            expirationDate: '12/23',
            currency: 'NGN',
            status: TransactionStatus.SUCCESS,
            fee: 3,
            reference: 'ref123',
            createdAt: transaction.created_at,
            updatedAt: transaction.updated_at,
            transactionType: 'card',
        });
        expect(transactionRepo.settleCardTransaction).toHaveBeenCalledWith(reference, cardNumber);
    });

    it('should list all card transactions', async () => {
        const transactions: CardTransaction[] = [
            {
                id: 'transaction123',
                transaction_value: 100,
                fee: 3,
                transaction_desc: 'Test transaction',
                card_number_last4: '5678',
                cardholder_name: 'John Doe',
                card_expiration_date: '12/23',
                currency: 'NGN',
                cvv: '123',
                status: TransactionStatus.SUCCESS,
                created_at: new Date(),
                updated_at: new Date(),
                merchant_id: 'merchant123',
                reference: 'ref123',
                merchant: null,
                payout: null,
                transaction_type: 'card',
            },
        ];

        transactionRepo.listAllCardTransactions.mockResolvedValue(transactions);

        const result: CardTransactionResponseDTO[] = await transactionService.listAllCardTransactions();

        expect(result).toEqual(transactions.map(transaction => ({
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
            transactionType: transaction.transaction_type,
        })));
        expect(transactionRepo.listAllCardTransactions).toHaveBeenCalled();
    });

    it('should list all virtual account transactions', async () => {
        const transactions: VirtualAccountTransaction[] = [
            {
                id: 'transaction123',
                transaction_value: 200,
                fee: 10,
                transaction_desc: 'Test virtual account transaction',
                account_name: 'John Doe',
                account_number: '1234567890',
                bank_code: '001',
                currency: 'NGN',
                status: TransactionStatus.SUCCESS,
                created_at: new Date(),
                updated_at: new Date(),
                merchant_id: 'merchant123',
                reference: 'ref123',
                merchant: null,
                payout: null,
                transaction_type: 'virtual_account',
            },
        ];

        transactionRepo.listAllVirtualAccountTransactions.mockResolvedValue(transactions);

        const result: VirtualAccountTransactionResponseDTO[] = await transactionService.listAllVirtualAccountTransactions();

        expect(result).toEqual(transactions.map(transaction => ({
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
            transactionType: transaction.transaction_type,
        })));
        expect(transactionRepo.listAllVirtualAccountTransactions).toHaveBeenCalled();
    });
});