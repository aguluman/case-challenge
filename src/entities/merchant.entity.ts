import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Payout } from './payouts.entity';

@Entity('merchants')
export class Merchant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    bank_account_number: string;

    @Column({ type: 'varchar', length: 255 })
    bank_code: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.merchant)
    transactions: Transaction[];

    @OneToMany(() => Payout, (payout) => payout.merchant)
    payouts: Payout[];
}