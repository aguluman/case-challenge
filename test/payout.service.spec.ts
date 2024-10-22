//Unit Test for PayoutService
import 'reflect-metadata';
import { PayoutService } from '../src/services/payout.service';
import { IMerchantRepository } from '../src/repositories/irepository/imerchant.repository';
import { IPayoutRepository } from '../src/repositories/irepository/ipayout.repository';
import { ITransactionRepository } from '../src/repositories/irepository/itransaction.repository';
import { PayoutRequestDTO } from '../src/dtos/request-dtos/payout.request.dto';
import { PayoutResponseDto } from '../src/dtos/response-dtos/payout.response.dto';
import { Payout } from '../src/entities/payouts.entity';
import { Merchant } from '../src/entities/merchant.entity';
import { Transaction } from '../src/entities/transaction.entity';
import { TransactionStatus } from '../src/enums/transaction.status';

describe('PayoutService-TestSuite', () => {
    let payoutService: PayoutService;
    let payoutRepo: jest.Mocked<IPayoutRepository>;
    let merchantRepo: jest.Mocked<IMerchantRepository>;
    let transactionRepo: jest.Mocked<ITransactionRepository>;

    beforeEach(() => {
        payoutRepo = {
            createPayout: jest.fn(),
            findAllPayoutForOneMerchants: jest.fn(),
        } as any;

        merchantRepo = {
            findMerchantId: jest.fn(),
        } as any;

        transactionRepo = {
            findSettledTransactionsByMerchant: jest.fn(),
            updateTransactionsWithPayout: jest.fn(),
            getMerchantBalance: jest.fn(),
        } as any;

        payoutService = new PayoutService(payoutRepo, merchantRepo, transactionRepo);
    });

    it('should create a payout', async () => {
        const payoutRequest: PayoutRequestDTO = { merchant_id: '123' };
        const merchant: Merchant = {
            id: '123',
            name: 'Test Merchant',
            email: 'test@example.com',
            bank_account_number: '1234567890',
            bank_code: '012345678',
            created_at: new Date(),
            updated_at: new Date(),
            transactions: [],
            payouts: [],
        };
        const transactions: Transaction[] = [
            {
                id: '561b8fe6-b732-4ed8-bf88-f142e6fec9ae',
                transaction_value: 1000,
                fee: 100,
                transaction_desc: 'Payment for barbing hair',
                currency: 'NGN',
                status: TransactionStatus.SUCCESS,
                created_at: new Date(),
                updated_at: new Date(),
                merchant_id: merchant.id,
                reference: '1234-asdf-1234-z3r',
                merchant: merchant,
                payout: null,
                transaction_type: 'card',
            },
            {
                id: '198264a7-5507-42dc-911e-5b7fbb299de7',
                transaction_value: 2000,
                fee: 200,
                transaction_desc: 'Payment for pizza',
                currency: 'NGN',
                status: TransactionStatus.SUCCESS,
                created_at: new Date(),
                updated_at: new Date(),
                merchant_id: merchant.id,
                reference: '1234-asdf-1234-z3r',
                merchant: merchant,
                payout: null,
                transaction_type: 'virtual_account',
            },
        ];
        const payout: Payout = {
            id: '3a40a1bf-abaf-4d2b-a8b6-be7a40ca753c',
            payout_amount: 2700,
            merchant_id: merchant.id,
            payout_reference: 'ref123',
            transactions,
            created_at: new Date(),
            updated_at: new Date(),
            merchant: merchant,
        };

        merchantRepo.findMerchantId.mockResolvedValue(merchant);
        transactionRepo.findSettledTransactionsByMerchant.mockResolvedValue(transactions);
        payoutRepo.createPayout.mockResolvedValue(payout);

        const result: PayoutResponseDto = await payoutService.createPayout(payoutRequest);

        expect(result).toEqual({
            merchantId: merchant.id,
            totalAmount: 2700,
            settledTransactions: 2,
            feesDeducted: 300,
            payoutDate: payout.created_at,
        });
        expect(merchantRepo.findMerchantId).toHaveBeenCalledWith('123');
        expect(transactionRepo.findSettledTransactionsByMerchant).toHaveBeenCalledWith('123');
        expect(payoutRepo.createPayout).toHaveBeenCalled();
        expect(transactionRepo.updateTransactionsWithPayout).toHaveBeenCalledWith(transactions, '3a40a1bf-abaf-4d2b-a8b6-be7a40ca753c');
    });

    it('should list payouts for a merchant', async () => {
        const merchantId = '123';
        const payouts: Payout[] = [
            {
                id: '3a40a1bf-abaf-4d2b-a8b6-be7a40ca753c',
                merchant_id: '123',
                payout_amount: 2700,
                payout_reference: 'ref123',
                transactions: [
                    {
                        id: '561b8fe6-b732-4ed8-bf88-f142e6fec9ae',
                        transaction_value: 1000,
                        fee: 10,
                        transaction_desc: 'Payment for barbing hair',
                        currency: 'NGN',
                        status: TransactionStatus.SUCCESS,
                        created_at: new Date(),
                        updated_at: new Date(),
                        merchant_id: '123',
                        reference: '1234-asdf-1234-z3r',
                        merchant: {
                            id: '123',
                            name: 'Test Merchant',
                            email: 'test@example.com',
                            bank_account_number: '1234567890',
                            bank_code: '012345678',
                            created_at: new Date(),
                            updated_at: new Date(),
                            transactions: [],
                            payouts: [],
                        },
                        payout: null,
                        transaction_type: 'card',
                    },
                    {
                        id: '198264a7-5507-42dc-911e-5b7fbb299de7',
                        transaction_value: 2000,
                        fee: 20,
                        transaction_desc: 'Payment for pizza',
                        currency: 'NGN',
                        status: TransactionStatus.SUCCESS,
                        created_at: new Date(),
                        updated_at: new Date(),
                        merchant_id: '123',
                        reference: '1234-asdf-1234-z3r',
                        merchant: {
                            id: '123',
                            name: 'Test Merchant',
                            email: 'test@example.com',
                            bank_account_number: '1234567890',
                            bank_code: '012345678',
                            created_at: new Date(),
                            updated_at: new Date(),
                            transactions: [],
                            payouts: [],
                        },
                        payout: null,
                        transaction_type: 'virtual_account',
                    },
                ],
                created_at: new Date(),
                updated_at: new Date(),
                merchant: {
                    id: '123',
                    name: 'Test Merchant',
                    email: 'test@example.com',
                    bank_account_number: '1234567890',
                    bank_code: '012345678',
                    created_at: new Date(),
                    updated_at: new Date(),
                    transactions: [],
                    payouts: [],
                },
            },
        ];

        payoutRepo.findAllPayoutForOneMerchants.mockResolvedValue(payouts);

        const result: PayoutResponseDto[] = await payoutService.listPayouts(merchantId);

        expect(result).toEqual([
            {
                merchantId: '123',
                totalAmount: 2700,
                settledTransactions: 2,
                feesDeducted: 30,
                payoutDate: payouts[0].created_at,
            },
        ]);
        expect(payoutRepo.findAllPayoutForOneMerchants).toHaveBeenCalledWith(merchantId);
    });

    it('should get merchant balance', async () => {
        const merchantId = '123';
        const balance = { availableBalance: 1000, pendingSettlementBalance: 500 };

        transactionRepo.getMerchantBalance.mockResolvedValue(balance);

        const result = await payoutService.getMerchantBalance(merchantId);

        expect(result).toEqual(balance);
        expect(transactionRepo.getMerchantBalance).toHaveBeenCalledWith(merchantId);
    });
});