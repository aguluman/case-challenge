import { Request, Response } from 'express';
import { ErrorResponseDTO } from '../dtos/response-dtos/error.response.dto';
import { inject, injectable } from 'tsyringe';
import { CreateCardTransactionDTO } from '../dtos/request-dtos/create-card-transaction.dto';
import { CreateVirtualAccountTransactionDTO } from '../dtos/request-dtos/create-virtual-account-transaction.dto';
import { ITransactionService } from '../services/iservice/itransaction.service';

@injectable()
export class TransactionController {
    constructor(
        @inject('TransactionService')
        private readonly transactionService: ITransactionService,
    ) {}

    async createCardTransaction(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const data: CreateCardTransactionDTO = req.body;
            const result =
                await this.transactionService.createCardTransaction(data);
            return res.status(201).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async createVirtualAccountTransaction(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const data: CreateVirtualAccountTransactionDTO = req.body;
            const result =
                await this.transactionService.createVirtualAccountTransaction(
                    data,
                );
            return res.status(201).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async settleCardTransaction(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const { reference, cardNumber } = req.body;
            const result = await this.transactionService.settleCardTransaction(
                reference,
                cardNumber,
            );
            return res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async listAllCardTransactions(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const result =
                await this.transactionService.listAllCardTransactions();
            return res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async listAllVirtualAccountTransactions(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const result =
                await this.transactionService.listAllVirtualAccountTransactions();
            return res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }
}
