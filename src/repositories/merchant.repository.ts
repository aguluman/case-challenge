import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { IMerchantRepository } from './irepository/imerchant.repository';

@injectable()
export class MerchantRepository implements IMerchantRepository {
    constructor(
        @inject('MerchantRepository')
        private readonly merchantRepo: Repository<Merchant>,
    ) {}

    async findById(id: string): Promise<Merchant | null> {
        return await this.merchantRepo.findOne({ where: { id } });
    }

    async findAll(): Promise<Merchant[]> {
        return await this.merchantRepo.find();
    }
}
