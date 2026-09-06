import prisma from '../prisma.js';

const TELEGRAM_TIMEOUT_MS = 10000;

const callTelegramApi = async (token, method, payload) => {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram API returned ${response.status}`);
  }
  return result.result;
};

const toPublicUrl = (value) => {
  if (!value?.startsWith('/')) return value;
  const hostname = process.env.APP_URL
    || process.env.VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_URL;
  if (!hostname) return value;
  const origin = /^https?:\/\//.test(hostname) ? hostname : `https://${hostname}`;
  return new URL(value, origin).toString();
};

class TelegramService {
  constructor() {
    this.chatId = null;
  }

  async getCredentials() {
    // Check DB settings first, fallback to process.env
    try {
      const tokenSetting = await prisma.setting.findUnique({ where: { key: 'telegram_bot_token' } });
      const chatIdSetting = await prisma.setting.findUnique({ where: { key: 'telegram_chat_id' } });

      const token = tokenSetting?.value || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = chatIdSetting?.value || process.env.TELEGRAM_CHAT_ID;

      return { token, chatId };
    } catch (err) {
      return {
        token: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,
      };
    }
  }

  async getClient() {
    const { token, chatId } = await this.getCredentials();
    if (!token) return null;
    return { token, chatId };
  }

  formatMoney(amount) {
    return Number(amount).toFixed(2);
  }

  formatKHR(amount) {
    return (Math.round(amount * 4100)).toLocaleString();
  }

  async sendOrderNotification(order) {
    const client = await this.getClient();
    if (!client || !client.chatId) {
      console.warn('⚠️ Telegram Bot Token or Chat ID is not configured. Order notification skipped.');
      return { success: false, message: 'Telegram bot not configured' };
    }

    const { token, chatId } = client;

    // Parse items
    let items = [];
    try {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) {
      items = [];
    }

    const itemsText = items.map((item, idx) => {
      let variantText = '';
      if (item.selectedVariant) {
        if (typeof item.selectedVariant === 'object') {
          variantText = ` [${Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ')}]`;
        } else {
          variantText = ` [${item.selectedVariant}]`;
        }
      }
      const itemTotal = this.formatMoney(item.price * item.quantity);
      return `<b>${idx + 1}. ${item.name}</b>${variantText}\n   └ ${item.quantity} x $${this.formatMoney(item.price)} = <b>$${itemTotal}</b>`;
    }).join('\n\n');

    // Clean phone number for links
    const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const phoneFormatted = order.customerPhone || 'N/A';
    
    // Telegram handle or phone link
    let contactLinks = `📞 <a href="tel:${cleanPhone}">${phoneFormatted}</a>`;
    if (order.customerTelegram) {
      const tgUsername = order.customerTelegram.replace('@', '');
      contactLinks += ` | 💬 <a href="https://t.me/${tgUsername}">@${tgUsername}</a>`;
    }

    const paymentLabel = order.paymentMethod === 'khqr' 
      ? '📲 KHQR / ABA Bank Transfer' 
      : '💵 Cash on Delivery (COD)';

    const totalKHR = this.formatKHR(order.totalAmount);
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleString('en-GB', { timeZone: 'Asia/Phnom_Penh' });

    const messageHtml = `
🛒 <b>ការបញ្ជាទិញថ្មី / NEW ORDER #${order.orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>អតិថិជន / Customer:</b> ${order.customerName}
📞 <b>ទំនាក់ទំនង / Contact:</b> ${contactLinks}
📍 <b>ទីតាំង / Location:</b> ${order.cityProvince || 'Phnom Penh'}, ${order.address}
💳 <b>ការទូទាត់ / Payment:</b> ${paymentLabel}
${order.notes ? `📝 <b>ចំណាំ / Note:</b> <i>${order.notes}</i>\n` : ''}━━━━━━━━━━━━━━━━━━━━
<b>ទំនិញដែលបានកុម្ម៉ង់ / Ordered Items:</b>

${itemsText}

━━━━━━━━━━━━━━━━━━━━
🚚 <b>ថ្លៃដឹកជញ្ជូន / Delivery:</b> $${this.formatMoney(order.deliveryFee)}
💰 <b>សរុបទាំងអស់ / TOTAL:</b> <b>$${this.formatMoney(order.totalAmount)}</b> (≈ ${totalKHR} ៛)
⏰ <b>កាលបរិច្ឆេទ / Time:</b> ${orderDate}
`;

    try {
      if (order.paymentProof) {
        // If image URL is full URL or local path
        await callTelegramApi(token, 'sendPhoto', {
          chat_id: chatId,
          photo: toPublicUrl(order.paymentProof),
          caption: messageHtml,
          parse_mode: 'HTML',
        });
      } else {
        await callTelegramApi(token, 'sendMessage', {
          chat_id: chatId,
          text: messageHtml,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }
      return { success: true };
    } catch (err) {
      console.error('❌ Error sending Telegram message:', err.message);
      return { success: false, error: err.message };
    }
  }

  async sendPaymentConfirmedNotification(order, details = {}) {
    const client = await this.getClient();
    if (!client || !client.chatId) return { success: false };

    const { token, chatId } = client;
    const totalUSD = this.formatMoney(order.totalAmount);
    const totalKHR = this.formatKHR(order.totalAmount);
    const confirmedTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Phnom_Penh' });

    const messageHtml = `
[PAID] <b>ការទូទាត់ជោគជ័យ / PAYMENT CONFIRMED #${order.orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━
<b>អតិថិជន / Customer:</b> ${order.customerName}
<b>ទូរស័ព្ទ / Phone:</b> ${order.customerPhone}
<b>វិធីទូទាត់ / Method:</b> ABA KHQR Auto-Payment
<b>ចំនួនទឹកប្រាក់ / Amount:</b> <b>$${totalUSD}</b> (≈ ${totalKHR} ៛)
<b>ស្ថានភាពកុម្ម៉ង់ / Status:</b> CONFIRMED
<b>កាលបរិច្ឆេទ / Time:</b> ${confirmedTime}
━━━━━━━━━━━━━━━━━━━━
ប្រព័ន្ធបានផ្ទៀងផ្ទាត់ការផ្ទេរប្រាក់ដោយស្វ័យប្រវត្តិតាមរយៈ KHQRPay (ABA Bank)។
`;

    try {
      await callTelegramApi(token, 'sendMessage', {
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      return { success: true };
    } catch (err) {
      console.error('Error sending Telegram payment notification:', err.message);
      return { success: false, error: err.message };
    }
  }

  async testConnection(token, chatId) {
    if (!token || !chatId) {
      throw new Error('Token and Chat ID are required');
    }
    const text = `
🎉 <b>Shoply Telegram Notification Test</b>
━━━━━━━━━━━━━━━━━━━━
✅ <b>ជោគជ័យ!</b> ប្រព័ន្ធ Telegram Bot បានតភ្ជាប់ជាមួយ Shoply រួចរាល់ហើយ។
រាល់ពេលមានអតិថិជនកុម្ម៉ង់ទិញទំនិញ អ្នកនឹងទទួលបានសារជូនដំណឹងភ្លាមៗនៅទីនេះ។
`;
    await callTelegramApi(token, 'sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
    return { success: true, message: 'Test message sent successfully' };
  }
}

export default new TelegramService();
