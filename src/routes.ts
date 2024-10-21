import express from 'express';
import { container } from 'tsyringe';
import { PayoutController } from './controllers/payout.controller';
import { TransactionController } from './controllers/transaction.controller';

const router = express.Router();
const transactionController = container.resolve(TransactionController);
const payoutController = container.resolve(PayoutController);

// Transaction routes
/**
 * @swagger
 * /api/transactions/card:
 *   post:
 *     summary: Create a card transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCardTransactionDTO'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardTransactionResponseDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.post('/transactions/card', async (req, res) => {
    try {
        await transactionController.createCardTransaction(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * /api/transactions/virtual-account:
 *   post:
 *     summary: Create a virtual account transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVirtualAccountTransactionDTO'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VirtualAccountTransactionResponseDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.post('/transactions/virtual-account', async (req, res) => {
    try {
        await transactionController.createVirtualAccountTransaction(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * api/transactions/settle-card:
 *   post:
 *     summary: Settle a card transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SettleCardTransactionDTO'
 *     responses:
 *       200:
 *         description: Transaction settled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardTransactionResponseDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.post('/transactions/settle-card', async (req, res) => {
    try {
        await transactionController.settleCardTransaction(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * /api/get-transactions/card:
 *   get:
 *     summary: List all card transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of card transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardTransactionResponseDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.get('/get-transactions/card', async (req, res) => {
    try {
        await transactionController.listAllCardTransactions(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * /api/get-transactions/virtual-account:
 *   get:
 *     summary: List all virtual account transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of virtual account transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VirtualAccountTransactionResponseDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.get('/get-transactions/virtual-account', async (req, res) => {
    try {
        await transactionController.listAllVirtualAccountTransactions(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Payout routes
/**
 * @swagger
 * /api/payouts:
 *   post:
 *     summary: Create a payout
 *     tags: [Payouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayoutRequestDTO'
 *     responses:
 *       201:
 *         description: Payout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PayoutResponseDto'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.post('/payouts', async (req, res) => {
    try {
        await payoutController.createPayout(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * /api/get-payouts/{merchantId}:
 *   get:
 *     summary: List payouts for a merchant
 *     tags: [Payouts]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of payouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PayoutResponseDto'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.get('/get-payouts/:merchantId', async (req, res) => {
    try {
        await payoutController.listPayouts(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

/**
 * @swagger
 * /api/get-balance/{merchantId}:
 *   get:
 *     summary: Get merchant balance
 *     tags: [Payouts]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchant balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance: { type: 'number', example: 1000 }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseDTO'
 */
router.get('/get-balance/:merchantId', async (req, res) => {
    try {
        await payoutController.getMerchantBalance(req, res);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export default router;
