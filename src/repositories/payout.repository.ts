import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Payout } from '../entities/payouts.entity';
import { IPayoutRepository } from './irepository/ipayout.repository';

@injectable()
export class PayoutRepository implements IPayoutRepository {
    constructor(private payoutRepo: Repository<Payout>) {}

    create(data: Partial<Payout>): Payout {
        return this.payoutRepo.create(data);
    }

    save(payout: Payout): Promise<Payout> {
        return this.payoutRepo.save(payout);
    }

    findOne(options: any): Promise<Payout | null> {
        return this.payoutRepo.findOne({
            ...options,
            relations: ['card_transactions', 'virtual_account_transactions'],
        });
    }

    findAll(options: any): Promise<Payout[]> {
        return this.payoutRepo.find({
            ...options,
            relations: ['card_transactions', 'virtual_account_transactions'],
        });
    }
}