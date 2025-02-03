import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Receipt from './components/Receipt';
import ProductManagement from './components/ProductManagement';
import SalesManagement from './components/SalesManagement';
import Navigation from './components/Navigation';
import { useProducts } from './hooks/useProducts';
import { CartItem, Order } from './types/types';
import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const { products, updateProduct } = useProducts();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load Google Fonts
    const linkWork = document.createElement('link');
    linkWork.href = 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap';
    linkWork.rel = 'stylesheet';

    const linkRoboto = document.createElement('link');
    linkRoboto.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap';
    linkRoboto.rel = 'stylesheet';

    const linkInter = document.createElement('link');
    linkInter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    linkInter.rel = 'stylesheet';

    document.head.appendChild(linkWork);
    document.head.appendChild(linkRoboto);
    document.head.appendChild(linkInter);

    return () => {
      document.head.removeChild(linkWork);
      document.head.removeChild(linkRoboto);
      document.head.removeChild(linkInter);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === productId);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Not enough stock available');
          return currentCart;
        }
        return currentCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (product.stock < 1) {
        alert('Not enough stock available');
        return currentCart;
      }
      
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (quantity > product.stock) {
      alert('Not enough stock available');
      return;
    }

    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProduct({
          ...product,
          stock: product.stock - item.quantity
        });
      }
    });

    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
    };
    
    const salesJournal = JSON.parse(localStorage.getItem('salesJournal') || '[]');
    localStorage.setItem('salesJournal', JSON.stringify([...salesJournal, order]));
    
    setCurrentOrder(order);
    setCart([]);
  };

  const closeReceipt = () => {
    setCurrentOrder(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex">
        <Navigation />
        
        <main className="flex-1 ml-20">
          <Routes>
            <Route path="/manage" element={<ProductManagement />} />
            <Route path="/sales" element={<SalesManagement />} />
            <Route path="/" element={
              <div className="flex-1 flex flex-col md:flex-row h-screen">
                <div className="flex-1 overflow-auto">
                  <ProductGrid products={products} onAddToCart={addToCart} />
                </div>
                <div className="w-full md:w-96 glass-panel">
                  <Cart
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onCheckout={handleCheckout}
                  />
                </div>
                {currentOrder && (
                  <Receipt order={currentOrder} onClose={closeReceipt} />
                )}
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
