import { Product } from '../types/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
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

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative p-4 rounded-xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex flex-col gap-2">
              <div 
                className="h-24 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => product.image && setSelectedImage(product.image)}
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-20 w-20 object-contain" />
                ) : (
                  <div className="text-blue-500 text-4xl">Rp</div>
                )}
              </div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-bold">{formatIDR(product.price)}</p>
                <p className={`text-sm ${
                  product.stock < 10 ? 'text-red-600' : 'text-green-600'
                }`}>
                  Stok: {product.stock}
                </p>
              </div>
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={product.stock === 0}
                className={`mt-2 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  product.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Plus size={16} />
                <span>{product.stock === 0 ? 'Stok Habis' : 'Tambah'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh] bg-white rounded-lg p-2">
            <img 
              src={selectedImage} 
              alt="Product preview" 
              className="max-w-full max-h-[75vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
