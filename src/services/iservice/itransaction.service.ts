import { CreateCardTransactionDTO } from '../../dtos/request-dtos/create-card-transaction.dto';
import { CardTransactionResponseDTO } from '../../dtos/response-dtos/card-transaction-response.dto';
import { CreateVirtualAccountTransactionDTO } from '../../dtos/request-dtos/create-virtual-account-transaction.dto';
import { VirtualAccountTransactionResponseDTO} from '../../dtos/response-dtos/virtual-account-transaction.response.dto';

export interface ITransactionService {
    createCardTransaction(data: CreateCardTransactionDTO): Promise<CardTransactionResponseDTO>;

    createVirtualAccountTransaction(data: CreateVirtualAccountTransactionDTO): Promise<VirtualAccountTransactionResponseDTO>;

    settleCardTransaction(reference: string, cardNumber: string): Promise<CardTransactionResponseDTO>;

    listAllCardTransactions(): Promise<CardTransactionResponseDTO[]>;

    listAllVirtualAccountTransactions(): Promise<VirtualAccountTransactionResponseDTO[]>;
}