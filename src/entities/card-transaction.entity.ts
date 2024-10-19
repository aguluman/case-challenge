import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction.status';
import { Merchant } from './merchant.entity';

@Entity('card_transactions')
export class CardTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    transaction_value: number;

    @Column('text')
    transaction_desc: string;

    @Column('varchar', { length: 4 })
    card_number_last4: string;

    @Column('varchar', { length: 255 })
    cardholder_name: string;

    @Column('varchar', { length: 5 })
    card_expiration_date: string;

    @Column('varchar', { length: 3 })
    cvv: string;

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

    @Column('uuid') // Added to link with a merchant
    merchant_id: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Merchant, (merchant) => merchant.cardTransactions)
    merchant: Merchant;
}
