import {
    Entity,
    Column
}  from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('card_transactions')
export class CardTransaction extends Transaction {
    @Column('varchar', { length: 4 })
    card_number_last4: string;

    @Column('varchar', { length: 255 })
    cardholder_name: string;

    @Column('varchar', { length: 5 })
    card_expiration_date: string;

    @Column('varchar', { length: 3 })
    cvv: string;
}