import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
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
    entities: [Merchant, Payout, Transaction],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: true,
});

export async function initializeDB(): Promise<void> {
    HabariDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error('Error during Data Source initialization:', err);
        });
}