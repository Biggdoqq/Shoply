import prisma from '../prisma.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: true }
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { nameKh, nameEn, slug, icon, image } = req.body;
    const generatedSlug = slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await prisma.category.create({
      data: {
        nameKh,
        nameEn,
        slug: generatedSlug,
        icon: icon || 'Tag',
        image: image || null
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameKh, nameEn, slug, icon, image } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        nameKh,
        nameEn,
        slug,
        icon,
        image
      }
    });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
