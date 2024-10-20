import { Payout } from '../../entities/payouts.entity';


export interface IPayoutRepository {
    create(data: Partial<Payout>): Payout;

    save(payout: Payout): Promise<Payout>;

    findOne(options: any): Promise<Payout | null>;

    findAll(options: any): Promise<Payout[]>;
}