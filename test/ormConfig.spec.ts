import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();


const testDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/src/entities/*.js'],
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
});

describe('ORM Configuration', () => {
    it('should initialize the data source successfully', async () => {
        await expect(testDataSource.initialize()).resolves.not.toThrow();
        await testDataSource.destroy();
    });
});