// payouts.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';
import { Merchant } from './merchant.entity';
import { Transaction } from './transaction.entity';

@Entity('payouts')
export class Payout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    payout_amount: number;

    @Column('uuid')
    merchant_id: string;

    @Column('varchar', { length: 255 })
    payout_reference: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Merchant, (merchant) => merchant.payouts)
    merchant: Merchant;

    @OneToMany(() => Transaction, (transaction) => transaction.payout)
    transactions: Transaction[];
}