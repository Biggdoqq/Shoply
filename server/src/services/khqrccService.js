import crypto from 'crypto';
import prisma from '../prisma.js';
import telegramBot from './telegramBot.js';

class KHQRPayService {
  /**
   * Retrieve KHQRPay settings from process.env or database
   */
  async getConfig() {
    try {
      const enabled = await prisma.setting.findUnique({ where: { key: 'khqrcc_enabled' } });
      const profileId = await prisma.setting.findUnique({ where: { key: 'khqrcc_profile_id' } });
      const secretKey = await prisma.setting.findUnique({ where: { key: 'khqrcc_secret_key' } });
      const customEndpoint = await prisma.setting.findUnique({ where: { key: 'khqrcc_endpoint' } });
      const khqrAccount = await prisma.setting.findUnique({ where: { key: 'khqr_account' } });
      const khqrName = await prisma.setting.findUnique({ where: { key: 'khqr_name' } });

      // Prioritize process.env for maximum security
      const envSecret = process.env.KHQRPAY_SECRET_KEY?.trim();
      const envProfile = process.env.KHQRPAY_PROFILE_ID?.trim();
      const envEndpoint = process.env.KHQRPAY_ENDPOINT?.trim();
      const envEnabled = process.env.KHQRPAY_ENABLED !== undefined
        ? process.env.KHQRPAY_ENABLED === 'true'
        : undefined;

      const isEnabled = envEnabled !== undefined ? envEnabled : enabled?.value === 'true';

      return {
        enabled: isEnabled,
        profileId: envProfile || profileId?.value?.trim() || '',
        secretKey: envSecret || secretKey?.value?.trim() || '',
        endpoint: envEndpoint || customEndpoint?.value?.trim() || '',
        accountNumber: khqrAccount?.value || '001 568 992',
        accountName: khqrName?.value || 'SHOPLY STORE (ABA BANK)',
        isSecretFromEnv: !!envSecret,
      };
    } catch (err) {
      console.error('Error fetching KHQRPay config:', err);
      const envSecret = process.env.KHQRPAY_SECRET_KEY?.trim() || '';
      const envProfile = process.env.KHQRPAY_PROFILE_ID?.trim() || '';
      return {
        enabled: process.env.KHQRPAY_ENABLED === 'true',
        profileId: envProfile,
        secretKey: envSecret,
        endpoint: process.env.KHQRPAY_ENDPOINT?.trim() || '',
        accountNumber: '001 568 992',
        accountName: 'SHOPLY STORE (ABA BANK)',
        isSecretFromEnv: !!envSecret,
      };
    }
  }

  /**
   * Official KHQRPay requestv2 SHA1 hash formula:
   * sha1(secret + transaction_id + amount + success_url + remark)
   */
  generateRequestHash(transactionId, amount, successUrl, remark, secretKey) {
    const raw = `${secretKey || ''}${transactionId}${amount}${successUrl}${remark}`;
    return crypto.createHash('sha1').update(raw).digest('hex');
  }

  generateHash(transactionId, amount, secretKey) {
    const raw = `${secretKey || ''}${transactionId}${Number(amount).toFixed(2)}`;
    return crypto.createHash('sha1').update(raw).digest('hex');
  }

  /**
   * Official Callback hash formula from docs:
   * sha256(secret + req_time + transaction_id + amount + "SUCCESS")
   */
  verifyCallbackHash(body, secretKey) {
    const { transaction_id, amount, req_time, hash } = body;
    if (!hash || !secretKey) return true;

    const formattedAmount = amount !== undefined ? Number(amount).toFixed(2) : '';
    const rawSha256 = `${secretKey}${req_time || ''}${transaction_id || ''}${formattedAmount}SUCCESS`;
    const expectedSha256 = crypto.createHash('sha256').update(rawSha256).digest('hex');

    // Also support fallback sha1
    const rawSha1 = `${secretKey}${transaction_id || ''}${formattedAmount}`;
    const expectedSha1 = crypto.createHash('sha1').update(rawSha1).digest('hex');

    const givenHash = String(hash).toLowerCase();
    return givenHash === expectedSha256.toLowerCase() || givenHash === expectedSha1.toLowerCase();
  }

  /**
   * Generate dynamic payment session (Checkout URL, direct QR, and ABA Pay link)
   */
  async createPayment({ orderNumber, amount, currency = 'USD', returnUrl = '' }) {
    const config = await this.getConfig();
    const formattedAmount = Number(amount).toFixed(2);
    const transactionId = orderNumber;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    let successUrl = returnUrl || `${clientUrl}/order-success/${transactionId}`;

    // When client is running on localhost HTTP, browsers block redirecting an HTTPS iframe to HTTP (mixed content / private network access).
    // Using checkout.khqr.cc/success/ ensures the redirect succeeds without browser error and triggers onLoad to auto-redirect the parent window.
    if (successUrl.startsWith('http://localhost') || successUrl.startsWith('http://127.0.0.1')) {
      successUrl = `https://checkout.khqr.cc/success/?order=${transactionId}`;
    }

    const remark = `Order #${transactionId}`;

    let checkoutUrl = '';
    let directCheckoutUrl = '';
    let remoteSuccess = false;

    if (config.profileId && config.secretKey) {
      const hash = this.generateRequestHash(transactionId, formattedAmount, successUrl, remark, config.secretKey);
      const params = new URLSearchParams({
        transaction_id: transactionId,
        amount: formattedAmount,
        success_url: successUrl,
        remark: remark,
        hash: hash,
      });

      const gatewayBaseUrl = config.endpoint || 'https://khqr.cc/api/payment/requestv2';
      checkoutUrl = `${gatewayBaseUrl.replace(/\/+$/, '')}/${config.profileId}?${params.toString()}`;

      // Resolve redirect destination directly (checkout.khqr.cc)
      try {
        const checkRes = await fetch(checkoutUrl, {
          method: 'GET',
          redirect: 'manual',
          headers: { 'Accept': 'text/html,application/json' },
        });
        const redirectLocation = checkRes.headers.get('location');
        if (redirectLocation) {
          directCheckoutUrl = redirectLocation;
          remoteSuccess = true;
        }
      } catch (e) {
        console.warn('Could not resolve direct checkout location:', e.message);
      }
    }

    // Dynamic QR generation fallback
    const cleanAcc = config.accountNumber.replace(/\s+/g, '');
    const qrString = `KHQR:SHOPLY:${transactionId}:$${formattedAmount}:${cleanAcc}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}&margin=12`;
    const abapayDeeplink = `aba://pay?amount=${formattedAmount}&currency=${currency}&acc=${encodeURIComponent(config.accountNumber)}&tran_id=${transactionId}`;

    return {
      success: true,
      enabled: config.enabled,
      remoteSuccess,
      orderNumber,
      transactionId,
      amount: formattedAmount,
      currency,
      checkoutUrl: directCheckoutUrl || checkoutUrl,
      gatewayUrl: checkoutUrl,
      qrString,
      qrImageUrl,
      abapayDeeplink,
      accountName: config.accountName,
      accountNumber: config.accountNumber,
    };
  }

  /**
   * Check if order payment is confirmed
   */
  async checkPaymentStatus(orderNumber) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber },
          { id: orderNumber }
        ]
      }
    });

    if (!order) {
      return { found: false, status: 'NOT_FOUND', isPaid: false };
    }

    const isPaid = order.status === 'CONFIRMED' || order.status === 'SHIPPED' || order.status === 'DELIVERED';

    return {
      found: true,
      orderNumber: order.orderNumber,
      status: order.status,
      isPaid,
    };
  }

  /**
   * Mark order as paid & notify store manager via Telegram
   */
  async confirmOrderPayment(orderIdOrNumber, details = {}) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderIdOrNumber },
          { orderNumber: orderIdOrNumber }
        ]
      }
    });

    if (!order) return null;

    if (order.status === 'PENDING') {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentProof: details.proofUrl || 'KHQRPAY_AUTO_CONFIRMED',
        }
      });

      // Send telegram alert
      try {
        await telegramBot.sendPaymentConfirmedNotification(updated, details);
      } catch (err) {
        console.error('Failed to send Telegram payment confirmation:', err);
      }

      return updated;
    }

    return order;
  }

  /**
   * Webhook processor for KHQRPay callbacks
   */
  async handleWebhook(body, headers = {}) {
    const transactionId = body.transaction_id || body.order_id || body.tran_id || body.orderNumber;
    const amount = body.amount;
    const status = (body.status || '').toUpperCase();

    if (!transactionId) {
      throw new Error('Missing transaction_id in webhook payload');
    }

    // Verify hash if provided
    const config = await this.getConfig();
    if (config.secretKey && body.hash) {
      const isValid = this.verifyCallbackHash(body, config.secretKey);
      if (!isValid) {
        console.warn(`Webhook signature mismatch for transaction ${transactionId}`);
      }
    }

    const isSuccess = status === 'SUCCESS' || status === 'COMPLETED' || status === 'PAID' || body.paid === true;

    if (isSuccess) {
      const order = await this.confirmOrderPayment(transactionId, {
        source: 'KHQRPAY_WEBHOOK',
        transactionId,
        amount,
        rawBody: body,
      });

      return {
        success: true,
        orderNumber: order?.orderNumber || transactionId,
        status: 'CONFIRMED',
      };
    }

    return {
      success: true,
      message: `Webhook received with status: ${status}`,
    };
  }
}

export default new KHQRPayService();
