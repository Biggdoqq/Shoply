import prisma from '../prisma.js';
import telegramBot from '../services/telegramBot.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const map = {};
    settings.forEach(s => {
      map[s.key] = s.value;
    });

    // Provide default fallbacks
    if (!map.store_name) map.store_name = 'Shoply';
    if (!map.currency) map.currency = '$';
    if (!map.delivery_fee) map.delivery_fee = '1.50';
    if (!map.phone_number) map.phone_number = '012 345 678';
    if (!map.khqr_name) map.khqr_name = 'SHOPLY STORE';
    if (!map.khqr_account) map.khqr_account = '001 234 567';
    if (!map.telegram_bot_token) map.telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!map.telegram_chat_id) map.telegram_chat_id = process.env.TELEGRAM_CHAT_ID || '';
    if (!map.hero_banner_image) map.hero_banner_image = '';
    if (!map.hero_banners) map.hero_banners = '[]';
    if (!map.promo_banner_image) map.promo_banner_image = '';
    if (!map.store_logo) map.store_logo = '';
    if (!map.khqr_image) map.khqr_image = '';
    if (!map.telegram_handle) map.telegram_handle = '@ShoplySupport';
    if (!map.telegram_link) map.telegram_link = 'https://t.me/ShoplySupport';
    if (!map.admin_name) map.admin_name = 'David Greymaax';
    if (!map.admin_role) map.admin_role = 'Store Administrator';
    if (!map.admin_avatar) map.admin_avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    if (!map.khqrcc_enabled) map.khqrcc_enabled = process.env.KHQRPAY_ENABLED || 'false';
    if (!map.khqrcc_profile_id) map.khqrcc_profile_id = process.env.KHQRPAY_PROFILE_ID || '';
    if (!map.khqrcc_endpoint) map.khqrcc_endpoint = process.env.KHQRPAY_ENDPOINT || '';
    
    // Check if secret key is configured via process.env or DB
    const hasEnvSecret = !!process.env.KHQRPAY_SECRET_KEY?.trim();
    const hasDbSecret = !!map.khqrcc_secret_key?.trim();
    map.khqrcc_has_env_secret = hasEnvSecret ? 'true' : 'false';
    map.khqrcc_has_secret = (hasEnvSecret || hasDbSecret) ? 'true' : 'false';

    // Mask secret key so plain-text secret is never leaked to client
    if (hasEnvSecret) {
      map.khqrcc_secret_key = '•••••••••••••••• (Configured via .env)';
    } else if (hasDbSecret) {
      map.khqrcc_secret_key = '••••••••••••••••';
    } else {
      map.khqrcc_secret_key = '';
    }

    res.json(map);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // e.g. { telegram_bot_token: '...', store_name: '...' }

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

        // Security check: Ignore masked placeholder when saving secret key
        if (key === 'khqrcc_secret_key' && (valStr.includes('••••') || valStr.trim() === '')) {
          continue;
        }

        await prisma.setting.upsert({
          where: { key },
          update: { value: valStr },
          create: { key, value: valStr }
        });
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const testTelegram = async (req, res) => {
  try {
    const { token, chatId } = req.body;
    let targetToken = token;
    let targetChatId = chatId;

    if (!targetToken || !targetChatId) {
      const creds = await telegramBot.getCredentials();
      targetToken = targetToken || creds.token;
      targetChatId = targetChatId || creds.chatId;
    }

    if (!targetToken || !targetChatId) {
      return res.status(400).json({
        error: 'Telegram Bot Token and Chat ID are required to test connection.'
      });
    }

    await telegramBot.testConnection(targetToken, targetChatId);
    res.json({ success: true, message: 'Telegram test message sent successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
