import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Payout } from '../entities/payouts.entity';
import { IPayoutRepository } from './irepository/ipayout.repository';

@injectable()
export class PayoutRepository implements IPayoutRepository {
    constructor(
        @inject('TypeORMPayoutRepository')
        private readonly payoutRepo: Repository<Payout>) {}

    async createPayout(data: Partial<Payout>): Promise<Payout> {
        const createPayout = this.payoutRepo.create(data);
        return this.payoutRepo.save(createPayout);
    }


    findOnePayoutForOneMerchant(payoutId: string,  merchantId: string): Promise<Payout | null> {
        return this.payoutRepo.findOne({
            where: { id: payoutId, merchant_id: merchantId },
            relations: ['card_transactions', 'virtual_account_transactions'],
        });
    }

    findAllPayoutForOneMerchants(merchantId: string): Promise<Payout[]> {
        return this.payoutRepo.find({
            where: { merchant_id: merchantId },
            relations: ['card_transactions', 'virtual_account_transactions'],
        });
    }
}
