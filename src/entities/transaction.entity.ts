import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction.status';
import { TransactionType } from '../enums/transaction.type';
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
    merchant: Merchant | null;

    @ManyToOne(() => Payout, (payout) => payout.transactions)
    payout: Payout | null;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    transaction_type: TransactionType;

    // Fields specific to CardTransaction
    @Column('varchar', { length: 4, nullable: true })
    card_number_last4?: string;

    @Column('varchar', { length: 255, nullable: true })
    cardholder_name?: string;

    @Column('varchar', { length: 5, nullable: true })
    card_expiration_date?: string;

    @Column('varchar', { length: 3, nullable: true })
    cvv?: string;

    // Fields specific to VirtualAccountTransaction
    @Column('varchar', { length: 255, nullable: true })
    account_name?: string;

    @Column('varchar', { length: 10, nullable: true })
    account_number?: string;

    @Column('varchar', { length: 255, nullable: true })
    bank_code?: string;
}
