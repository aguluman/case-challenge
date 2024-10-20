import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { Payout } from '../entities/payouts.entity';
import { Merchant } from '../entities/merchant.entity';
import { CardTransaction } from '../entities/card-transaction.entity';
import { VirtualAccountTransaction } from '../entities/virtual-account-transaction.entity';
import { TransactionStatus } from '../enums/transaction.status';
import { PayoutRequestDTO } from '../dtos/request-dtos/payout.request.dto';
import { PayoutResponseDto } from '../dtos/response-dtos/payout.response.dto';
import { generateUniqueReference } from '../utils/generate-unique-reference';

@injectable()
export class PayoutRepository {
    constructor(
        @inject('PayoutRepository')
        private payoutRepo: Repository<Payout>,
        @inject('MerchantRepository')
        private merchantRepo: Repository<Merchant>,
        @inject('CardTransactionRepository')
        private cardTransactionRepo: Repository<CardTransaction>,
        @inject('VirtualAccountTransactionRepository')
        private virtualAccountTransactionRepo: Repository<VirtualAccountTransaction>,
    ) {
    }

    async createPayout(data: PayoutRequestDTO): Promise<PayoutResponseDto> {
        const { merchant_id } = data;
        const merchant = await this.merchantRepo.findOne({ where: { id: merchant_id } });

        if (!merchant) {
            throw new Error('Merchant not found');
        }

        const settledCardTransactions = await this.cardTransactionRepo.find({
            where: { merchant: merchant, status: TransactionStatus.SUCCESS },
        });

        const settledVirtualAccountTransactions = await this.virtualAccountTransactionRepo.find({
            where: { merchant: merchant, status: TransactionStatus.SUCCESS },
        });

        const cardTransactionsSum = settledCardTransactions.reduce(
            (total, transaction) => total + (transaction.transaction_value * (1 - 0.03)),
            0,
        );

        const virtualAccountTransactionsSum = settledVirtualAccountTransactions.reduce(
            (total, transaction) => total + (transaction.transaction_value * (1 - 0.05)),
            0,
        );

        const totalPayoutAmount = cardTransactionsSum + virtualAccountTransactionsSum;
        const totalFee = settledCardTransactions.reduce((total, transaction) => total + transaction.fee, 0) +
            settledVirtualAccountTransactions.reduce((total, transaction) => total + transaction.fee, 0);

        const payout = this.payoutRepo.create({
            merchant,
            payout_amount: totalPayoutAmount,
            payout_reference: generateUniqueReference(),
        });

        await this.payoutRepo.save(payout);

        for (const transaction of settledCardTransactions) {
            transaction.payout = payout;
            await this.cardTransactionRepo.save(transaction);
        }

        for (const transaction of settledVirtualAccountTransactions) {
            transaction.payout = payout;
            await this.virtualAccountTransactionRepo.save(transaction);
        }

        return {
            merchantId: merchant.id,
            totalAmount: totalPayoutAmount,
            settledTransactions: settledCardTransactions.length + settledVirtualAccountTransactions.length,
            feeDeducted: totalFee,
            payoutDate: payout.created_at,
        };
    }

    async listPayouts(merchantId: string): Promise<PayoutResponseDto[]> {
        const payouts = await this.payoutRepo.find({
            where: { merchant: { id: merchantId } },
            relations: ['merchant'],
        });

        return payouts.map(payout => ({
            merchantId: payout.merchant.id,
            totalAmount: payout.payout_amount,
            settledTransactions: 0, // This would need to be calculated if required
            feeDeducted: 0, // This would need to be calculated if required
            payoutDate: payout.created_at,
        }));
    }

    async getMerchantBalance(merchantId: string): Promise<{
        availableBalance: number;
        pendingSettlementBalance: number;
    }> {
        const settledCardTransactions = await this.cardTransactionRepo.find({
            where: { merchant: { id: merchantId }, status: TransactionStatus.SUCCESS },
        });

        const pendingCardTransactions = await this.cardTransactionRepo.find({
            where: { merchant: { id: merchantId }, status: TransactionStatus.PENDING },
        });

        const settledVirtualAccountTransactions = await this.virtualAccountTransactionRepo.find({
            where: { merchant: { id: merchantId }, status: TransactionStatus.SUCCESS },
        });

        const pendingVirtualAccountTransactions = await this.virtualAccountTransactionRepo.find({
            where: { merchant: { id: merchantId }, status: TransactionStatus.PENDING },
        });

        const availableBalance = [...settledCardTransactions, ...settledVirtualAccountTransactions]
            .reduce((total, transaction) => total + transaction.transaction_value, 0);

        const pendingSettlementBalance = [...pendingCardTransactions, ...pendingVirtualAccountTransactions]
            .reduce((total, transaction) => total + transaction.transaction_value, 0);

        return { availableBalance, pendingSettlementBalance };
    }

}