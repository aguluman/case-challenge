import { Merchant } from '../../entities/merchant.entity';

export interface IMerchantRepository {
    findById(id: string): Promise<Merchant | null>;

    findAll(): Promise<Merchant[]>;
}