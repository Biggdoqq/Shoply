import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shoply_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null); // { item, quantity }

  useEffect(() => {
    try {
      localStorage.setItem('shoply_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Create a unique key for items with the same product ID but different variants
  const getCartItemKey = (productId, selectedVariant) => {
    const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : '';
    return `${productId}-${variantKey}`;
  };

  const addToCart = (product, quantity = 1, selectedVariant = null, shouldOpenDrawer = false) => {
    const cartItemId = getCartItemKey(product.id, selectedVariant);
    const unitPrice = product.salePrice !== null && product.salePrice !== undefined 
      ? product.salePrice 
      : product.price;

    const image = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

    const newItem = {
      cartItemId,
      productId: product.id,
      id: product.id,
      nameKh: product.nameKh,
      nameEn: product.nameEn,
      name: product.nameEn || product.nameKh,
      price: unitPrice,
      originalPrice: product.price,
      image,
      quantity,
      selectedVariant,
      stock: product.stock
    };

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, newItem];
      }
    });

    // Show floating toast notification
    setToast({
      item: newItem,
      quantity
    });

    if (shouldOpenDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toast,
        hideToast: () => setToast(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
