import { useState, useEffect } from 'react';
import { Product } from '../types/types';

// Initial products if none exist in localStorage
const defaultProducts: Product[] = [
  { id: '1', name: 'Kopi', price: 15000, stock: 50 },
  { id: '2', name: 'Sandwich', price: 25000, stock: 20 },
  { id: '3', name: 'Salad', price: 22000, stock: 15 },
  { id: '4', name: 'Jus', price: 12000, stock: 30 },
  { id: '5', name: 'Kue', price: 18000, stock: 25 },
  { id: '6', name: 'Teh', price: 8000, stock: 40 },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(current => {
      const updated = [...current, newProduct];
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = async (product: Product) => {
    setProducts(current => {
      const updated = current.map(p => (p.id === product.id ? product : p));
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = async (id: string) => {
    setProducts(current => {
      const updated = current.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
