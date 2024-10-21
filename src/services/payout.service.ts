import { inject, injectable } from 'tsyringe';
import { PayoutRequestDTO } from '../dtos/request-dtos/payout.request.dto';
import { PayoutResponseDto } from '../dtos/response-dtos/payout.response.dto';
import { IMerchantRepository } from '../repositories/irepository/imerchant.repository';
import { IPayoutRepository } from '../repositories/irepository/ipayout.repository';
import { ITransactionRepository } from '../repositories/irepository/itransaction.repository';
import { generateUniqueReference } from '../utils/generate-unique-reference';
import { IPayoutService } from './iservice/ipayout.service';

@injectable()
export class PayoutService implements IPayoutService {
    constructor(
        @inject('PayoutRepository')
        private readonly payoutRepo: IPayoutRepository,
        @inject('MerchantRepository')
        private readonly merchantRepo: IMerchantRepository,
        @inject('TransactionRepository')
        private readonly transactionRepo: ITransactionRepository,
    ) {}

    async createPayout(data: PayoutRequestDTO): Promise<PayoutResponseDto> {
        const { merchant_id } = data;
        const merchant = await this.merchantRepo.findById(merchant_id);

        if (!merchant) {
            throw new Error('Merchant not found');
        }

        const settledTransactions =
            await this.transactionRepo.findSettledTransactionsByMerchant(
                merchant_id,
            );
        const totalPayoutAmount = settledTransactions.reduce(
            (total, transaction) => total + transaction.transaction_value,
            0,
        );
        const totalFee = settledTransactions.reduce(
            (total, transaction) => total + transaction.fee,
            0,
        );

        const payout = this.payoutRepo.create({
            merchant_id: merchant_id,
            payout_amount: totalPayoutAmount - totalFee,
            payout_reference: generateUniqueReference(),
        });

        await this.payoutRepo.save(payout);
        await this.transactionRepo.updateTransactionsWithPayout(
            settledTransactions,
            payout.id,
        );

        return {
            merchantId: merchant.id,
            totalAmount: totalPayoutAmount - totalFee,
            settledTransactions: settledTransactions.length,
            feeDeducted: totalFee,
            payoutDate: payout.created_at,
        };
    }

    async listPayouts(merchantId: string): Promise<PayoutResponseDto[]> {
        const payouts = await this.payoutRepo.findAll({
            where: { merchant_id: merchantId },
        });

        return payouts.map((payout) => {
            const settledTransactions = payout.transactions.length;

            const feeDeducted = payout.transactions.reduce(
                (total, transaction) => total + transaction.fee,
                0,
            );

            return {
                merchantId: payout.merchant_id,
                totalAmount: payout.payout_amount,
                settledTransactions,
                feeDeducted,
                payoutDate: payout.created_at,
            };
        });
    }

    async getMerchantBalance(
        merchantId: string,
    ): Promise<{ availableBalance: number; pendingSettlementBalance: number }> {
        const { availableBalance, pendingSettlementBalance } =
            await this.transactionRepo.getMerchantBalance(merchantId);
        return { availableBalance, pendingSettlementBalance };
    }
}
