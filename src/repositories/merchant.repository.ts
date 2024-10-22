import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { IMerchantRepository } from './irepository/imerchant.repository';

@injectable()
export class MerchantRepository implements IMerchantRepository {
    constructor(
        @inject('TypeORMMerchantRepository')
        private readonly merchantRepo: Repository<Merchant>,
    ) {}

    findMerchantId(id: string): Promise<Merchant | null> {
        return this.merchantRepo.findOne({ where: { id } });
    }

    findAll(): Promise<Merchant[]> {
        return this.merchantRepo.find();
    }
}
