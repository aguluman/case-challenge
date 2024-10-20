import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction.status';
import { Merchant } from './merchant.entity';
import { Payout } from './payouts.entity';

@Entity('virtual_account_transactions')
export class VirtualAccountTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    transaction_value: number;

    @Column('text')
    transaction_desc: string;

    @Column('varchar', { length: 255 })
    account_name: string;

    @Column('varchar', { length: 10 })
    account_number: string;

    @Column('varchar', { length: 3 })
    bank_code: string;

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

    @Index({ unique: true }) // Ensures uniqueness
    @Column('varchar', { length: 255 })
    reference: string;

    @Column('uuid')
    merchant_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(
        () => Merchant,
        (merchant) => merchant.virtual_account_transactions,
    )
    merchant: Merchant;

    @ManyToOne(() => Payout, (payout) => payout.virtual_account_transactions)
    payout: Payout;
}
