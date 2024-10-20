import { PayoutRequestDTO } from '../../dtos/request-dtos/payout.request.dto';
import { PayoutResponseDto } from '../../dtos/response-dtos/payout.response.dto';

export interface IPayoutService {
    createPayout(data: PayoutRequestDTO): Promise<PayoutResponseDto>;

    listPayouts(merchantId: string): Promise<PayoutResponseDto[]>;

    getMerchantBalance(merchantId: string): Promise<{ availableBalance: number; pendingSettlementBalance: number; }>;
}