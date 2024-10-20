import { ErrorResponseDTO } from "src/dtos/response-dtos/error.response.dto";

export class HttpException extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }

  toErrorResponseDTO(): ErrorResponseDTO {
    return new ErrorResponseDTO(this.status, this.message, this.details);
  }
}