import prisma from '../prisma.js';
import telegramBot from '../services/telegramBot.js';

const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SH-${dateStr}-${randomSuffix}`;
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerTelegram,
      address,
      cityProvince,
      notes,
      paymentMethod,
      paymentProof,
      items,
      deliveryFee = 1.5,
    } = req.body;

    if (!customerName || !customerPhone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Please provide all required fields and items' });
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
    const totalAmount = subtotal + parsedDeliveryFee;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerTelegram: customerTelegram || null,
        address,
        cityProvince: cityProvince || 'Phnom Penh',
        notes: notes || null,
        paymentMethod: paymentMethod || 'cod',
        paymentProof: paymentProof || null,
        items: JSON.stringify(items),
        subtotal,
        deliveryFee: parsedDeliveryFee,
        totalAmount,
        status: 'PENDING',
      }
    });

    // Deduct stock for products
    for (const item of items) {
      if (item.id || item.productId) {
        try {
          await prisma.product.update({
            where: { id: item.id || item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } catch (e) {
          console.warn(`Could not update stock for product ${item.id}:`, e.message);
        }
      }
    }

    // Trigger Telegram notification in background
    telegramBot.sendOrderNotification({
      ...order,
      items
    }).catch(err => console.error('Telegram notification error:', err));

    res.status(201).json({
      ...order,
      items
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formatted = orders.map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items || '[]') : o.items
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderByIdOrNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id }
        ]
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items || '[]') : order.items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items || '[]') : order.items
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id }
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
