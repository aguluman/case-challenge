import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CardTransaction } from './card-transaction.entity';
import { VirtualAccountTransaction } from './virtual-account-transaction.entity';
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

    // Relations to Card and Virtual Account Transactions
    @OneToMany(() => CardTransaction, (cardTransaction) => cardTransaction.merchant)
    card_transactions: CardTransaction[];

    @OneToMany(() => VirtualAccountTransaction, (virtualAccountTransaction) => virtualAccountTransaction.merchant)
    virtual_account_transactions: VirtualAccountTransaction[];

    // Relation to Payouts
    @OneToMany(() => Payout, (payout) => payout.merchant)
    payouts: Payout[];
}
