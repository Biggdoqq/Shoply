import prisma from '../prisma.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, featured, sort, minPrice, maxPrice } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } }
      ];
    }

    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { nameKh: { contains: search } },
            { nameEn: { contains: search } },
            { descriptionKh: { contains: search } },
            { descriptionEn: { contains: search } },
          ]
        }
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name_asc') orderBy = { nameEn: 'asc' };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy
    });

    // Parse JSON fields
    const formatted = products.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
      variants: typeof p.variants === 'string' ? JSON.parse(p.variants || '[]') : p.variants,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images,
      variants: typeof product.variants === 'string' ? JSON.parse(product.variants || '[]') : product.variants,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      nameKh,
      nameEn,
      descriptionKh,
      descriptionEn,
      price,
      salePrice,
      stock,
      images,
      variants,
      categoryId,
      isFeatured
    } = req.body;

    const product = await prisma.product.create({
      data: {
        nameKh,
        nameEn,
        descriptionKh: descriptionKh || '',
        descriptionEn: descriptionEn || '',
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock, 10) || 0,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        variants: typeof variants === 'string' ? variants : JSON.stringify(variants || []),
        categoryId,
        isFeatured: Boolean(isFeatured)
      },
      include: { category: true }
    });

    res.status(201).json({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '[]'),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nameKh,
      nameEn,
      descriptionKh,
      descriptionEn,
      price,
      salePrice,
      stock,
      images,
      variants,
      categoryId,
      isFeatured
    } = req.body;

    const data = {};
    if (nameKh !== undefined) data.nameKh = nameKh;
    if (nameEn !== undefined) data.nameEn = nameEn;
    if (descriptionKh !== undefined) data.descriptionKh = descriptionKh;
    if (descriptionEn !== undefined) data.descriptionEn = descriptionEn;
    if (price !== undefined) data.price = parseFloat(price);
    if (salePrice !== undefined) data.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (stock !== undefined) data.stock = parseInt(stock, 10);
    if (images !== undefined) data.images = typeof images === 'string' ? images : JSON.stringify(images);
    if (variants !== undefined) data.variants = typeof variants === 'string' ? variants : JSON.stringify(variants);
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });

    res.json({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '[]'),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
