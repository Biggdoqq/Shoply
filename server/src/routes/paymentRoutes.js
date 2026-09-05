import express from 'express';
import khqrccService from '../services/khqrccService.js';

const router = express.Router();

/**
 * @route POST /api/payments/create-khqr
 * @desc Generate dynamic KHQR & ABA Mobile Pay link for an order
 */
router.post('/create-khqr', async (req, res) => {
  try {
    const { orderNumber, amount, currency = 'USD', returnUrl } = req.body;

    if (!orderNumber || amount === undefined) {
      return res.status(400).json({ error: 'orderNumber and amount are required' });
    }

    const session = await khqrccService.createPayment({
      orderNumber,
      amount,
      currency,
      returnUrl,
    });

    res.json(session);
  } catch (error) {
    console.error('Error creating KHQR session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/payments/status/:orderNumber
 * @desc Check real-time payment status of an order
 */
router.get('/status/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const status = await khqrccService.checkPaymentStatus(orderNumber);
    res.json(status);
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/payments/khqrcc/webhook
 * @desc Public Webhook receiver for KHQRPay instant payment notifications
 */
router.post('/khqrcc/webhook', async (req, res) => {
  try {
    console.log('Received KHQRPay Webhook Payload:', req.body);
    const result = await khqrccService.handleWebhook(req.body, req.headers);
    res.json(result);
  } catch (error) {
    console.error('KHQRPay Webhook processing error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route POST /api/payments/simulate-confirm
 * @desc Test/Sandbox simulation to mark an order as confirmed
 */
router.post('/simulate-confirm', async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber is required' });
    }
    const order = await khqrccService.confirmOrderPayment(orderNumber, {
      source: 'SIMULATED_TEST',
      proofUrl: 'SIMULATED_TEST_CONFIRMED',
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, orderNumber: order.orderNumber, status: order.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/payments/confirm
 * @desc Confirm payment from frontend / modal callback
 */
router.post('/confirm', async (req, res) => {
  try {
    const { orderNumber, proofUrl } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber is required' });
    }
    const order = await khqrccService.confirmOrderPayment(orderNumber, {
      source: 'FRONTEND_CHECKOUT',
      proofUrl: proofUrl || 'KHQRPAY_AUTO_CONFIRMED',
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, orderNumber: order.orderNumber, status: order.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
