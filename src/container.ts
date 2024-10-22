import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { PayoutRepository } from './repositories/payout.repository';
import { MerchantRepository } from './repositories/merchant.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { PayoutService } from './services/payout.service';
import { TransactionService } from './services/transaction.service';
import { IPayoutRepository } from './repositories/irepository/ipayout.repository';
import { IMerchantRepository } from './repositories/irepository/imerchant.repository';
import { ITransactionRepository } from './repositories/irepository/itransaction.repository';
import { IPayoutService } from './services/iservice/ipayout.service';
import { ITransactionService } from './services/iservice/itransaction.service';
import { HabariDataSource } from './config/orm.config';
import { Payout } from './entities/payouts.entity';
import { Merchant } from './entities/merchant.entity';
import { CardTransaction } from './entities/card-transaction.entity';
import { VirtualAccountTransaction } from './entities/virtual-account-transaction.entity';

// Register repositories
container.register<IPayoutRepository>('PayoutRepository', {
  useClass: PayoutRepository,
});
container.register<IMerchantRepository>('MerchantRepository', {
  useClass: MerchantRepository,
});
container.register<ITransactionRepository>('TransactionRepository', {
  useClass: TransactionRepository,
});

// Register services
container.register<IPayoutService>('PayoutService', {
  useClass: PayoutService,
});
container.register<ITransactionService>('TransactionService', {
  useClass: TransactionService,
});

// Register TypeORM repositories
container.register<Repository<Payout>>('TypeORMPayoutRepository', {
    useFactory: (_) => HabariDataSource.getRepository(Payout),
});
container.register<Repository<Merchant>>('TypeORMMerchantRepository', {
    useFactory: (_) => HabariDataSource.getRepository(Merchant),
});
container.register<Repository<CardTransaction>>('CardTransactionRepository', {
    useFactory: (_) => HabariDataSource.getRepository(CardTransaction),
});
container.register<Repository<VirtualAccountTransaction>>('VirtualAccountTransactionRepository', {
    useFactory: (_) => HabariDataSource.getRepository(VirtualAccountTransaction),
});