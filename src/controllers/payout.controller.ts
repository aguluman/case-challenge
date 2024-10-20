import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { PayoutRequestDTO } from '../dtos/request-dtos/payout.request.dto';
import { ErrorResponseDTO } from '../dtos/response-dtos/error.response.dto';
import { IPayoutService } from '../services/iservice/ipayout.service';

@injectable()
export class PayoutController {
    constructor(
        @inject('PayoutService') private payoutService: IPayoutService,
    ) {}

    async createPayout(req: Request, res: Response): Promise<Response> {
        try {
            const data: PayoutRequestDTO = req.body;
            const result = await this.payoutService.createPayout(data);
            return res.status(201).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async listPayouts(req: Request, res: Response): Promise<Response> {
        try {
            const { merchantId } = req.params;
            const result = await this.payoutService.listPayouts(merchantId);
            return res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }

    async getMerchantBalance(req: Request, res: Response): Promise<Response> {
        try {
            const { merchantId } = req.params;
            const result =
                await this.payoutService.getMerchantBalance(merchantId);
            return res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            const errorResponse = new ErrorResponseDTO(500, err.message);
            return res.status(500).json(errorResponse);
        }
    }
}
