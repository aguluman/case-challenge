import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for Habari Pay Case-Challenge',
        },
        components: {
            schemas: {
                CreateCardTransactionDTO: {
                    type: 'object',
                    properties: {
                        value: { type: 'number', example: 100 },
                        description: {
                            type: 'string',
                            example: 'Payment for services',
                        },
                        cardNumber: {
                            type: 'string',
                            example: '1234567890123456',
                        },
                        cardHolderName: { type: 'string', example: 'John Doe' },
                        expirationDate: { type: 'string', example: '12/23' },
                        cvv: { type: 'string', example: '123' },
                        currency: { type: 'string', example: 'NGN' },
                    },
                },
                CardTransactionResponseDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        value: { type: 'number', example: 100 },
                        cardNumberLast4: { type: 'string', example: '3456' },
                        status: { type: 'string', example: 'completed' },
                        fee: { type: 'number', example: 2 },
                        reference: {
                            type: 'string',
                            example: 'LMKJ-86e8-8ka4-4na-ib2',
                        },
                        createdAt: {
                            type: 'string',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                CreateVirtualAccountTransactionDTO: {
                    type: 'object',
                    properties: {
                        value: { type: 'number', example: 100 },
                        description: {
                            type: 'string',
                            example: 'Payment for services',
                        },
                        accountName: { type: 'string', example: 'John Doe' },
                        accountNumber: {
                            type: 'string',
                            example: '1234567890',
                        },
                        bankCode: { type: 'string', example: '001' },
                        currency: { type: 'string', example: 'NGN' },
                    },
                },
                VirtualAccountTransactionResponseDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        value: { type: 'number', example: 100 },
                        status: { type: 'string', example: 'completed' },
                        fee: { type: 'number', example: 2 },
                        reference: {
                            type: 'string',
                            example: 'LMKJ-86e8-8ka4-4na-ib2',
                        },
                        createdAt: {
                            type: 'string',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                PayoutRequestDTO: {
                    type: 'object',
                    properties: {
                        merchant_id: { type: 'string', example: 'merchant123' },
                    },
                },
                PayoutResponseDto: {
                    type: 'object',
                    properties: {
                        merchantId: { type: 'string', example: 'merchant123' },
                        totalAmount: { type: 'number', example: 1000 },
                        settledTransactions: { type: 'number', example: 10 },
                        feeDeducted: { type: 'number', example: 50 },
                        payoutDate: {
                            type: 'string',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                ErrorResponseDTO: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: 500 },
                        message: {
                            type: 'string',
                            example: 'Internal server error',
                        },
                        details: { type: 'string', example: null },
                    },
                },
            },
        },
    },
    apis: [
        './src/routes.ts',
        './src/controllers/*.ts',
        './src/dtos/request-dtos/*.ts',
        './src/dtos/response-dtos/*.ts',
    ], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;