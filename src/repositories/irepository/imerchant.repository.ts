import { Merchant } from '../../entities/merchant.entity';

export interface IMerchantRepository {
    findMerchantId(id: string): Promise<Merchant | null>;

    findAll(): Promise<Merchant[]>;
}
