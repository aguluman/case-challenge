import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CardTransaction } from '../entities/card-transaction.entity';
import { VirtualAccountTransaction } from '../entities/virtual-account-transaction.entity';
import { Merchant } from '../entities/merchant.entity';
import { Transaction } from '../entities/transaction.entity';
import { Payout } from '../entities/payouts.entity';

dotenv.config();
export const HabariDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [CardTransaction, VirtualAccountTransaction, Merchant, Payout, Transaction],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: true, // For dev: true, //For production: false
});

HabariDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });
