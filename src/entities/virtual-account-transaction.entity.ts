import {
    Entity,
    Column
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('virtual_account_transactions')
export class VirtualAccountTransaction extends Transaction {
    @Column('varchar', { length: 255 })
    account_name: string;

    @Column('varchar', { length: 10 })
    account_number: string;

    @Column('varchar', { length: 255 })
    bank_code: string;
}