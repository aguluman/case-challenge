import { injectable, inject } from 'tsyringe';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { IMerchantRepository } from './irepository/imerchant.repository';

@injectable()
export class MerchantRepository implements IMerchantRepository {
    constructor(
        @inject('MerchantRepository')
        private merchantRepo: Repository<Merchant>,
    ) {}

    async findById(id: string): Promise<Merchant | null> {
        return this.merchantRepo.findOne({ where: { id } });
    }

    async findAll(): Promise<Merchant[]> {
        return this.merchantRepo.find();
    }
}