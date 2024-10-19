import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';
import {TransactionStatus} from '../enums/transaction.status';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transaction_ref: string;

    @Column({type: 'decimal'})
    value: number;

    @Column()
    description: string;

    @Column({nullable: true})  // Card only
    card_last_four?: string;

    @Column({nullable: true})  // Card only
    cardholder_name?: string;

    @Column({nullable: true, type: 'date'})  // Card only
    expiration_date?: Date;

    @Column({nullable: true})  // Card only
    cvv?: string;

    @Column({type: 'decimal'})
    fee: number;

    @Column({type: 'varchar', default: 'pending'})
    status: TransactionStatus;

    @Column()
    currency: string;

    @CreateDateColumn()
    created_at: Date;
}
