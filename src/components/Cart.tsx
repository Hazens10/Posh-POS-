import { CartItem } from '../types/types';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

// Helper function to format currency
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        <ShoppingCart className="mx-auto mb-2" size={18} />
        <p>Keranjang kosong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-100">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
              <p className="text-blue-600 text-sm price">{formatIDR(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 rounded-full hover:bg-gray-100 text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white/60 backdrop-blur-lg border-t border-gray-200">
        <div className="flex justify-between mb-4">
          <span className="font-medium text-sm">Total:</span>
          <span className="font-bold text-blue-600 price">{formatIDR(total)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
