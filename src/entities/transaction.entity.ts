import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction.status';
import { Merchant } from './merchant.entity';
import { Payout } from './payouts.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    transaction_value: number;

    @Column('text')
    transaction_desc: string;

    @Column('varchar', { length: 3 })
    currency: string;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.INACTIVE,
    })
    status: TransactionStatus;

    @Column('decimal', { precision: 5, scale: 2 })
    fee: number;

    @Index({ unique: true })
    @Column('varchar', { length: 255 })
    reference: string;

    @Column('uuid')
    merchant_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Merchant, (merchant) => merchant.transactions)
    merchant: Merchant;

    @ManyToOne(() => Payout, (payout) => payout.transactions)
    payout: Payout;

    @Column('varchar', { length: 50 })
    transaction_type: string; // To differentiate between card and virtual account transactions
}