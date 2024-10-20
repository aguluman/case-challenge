export class ErrorResponseDTO {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: any,
    ) {}
}
