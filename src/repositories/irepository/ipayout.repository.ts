import { Payout } from '../../entities/payouts.entity';

export interface IPayoutRepository {
    createPayout(data: Partial<Payout>): Promise<Payout>;

    findOnePayoutForOneMerchant(payoutId: string,  merchantId: string): Promise<Payout | null>;

    findAllPayoutForOneMerchants(merchantId: string): Promise<Payout[]>;
}
