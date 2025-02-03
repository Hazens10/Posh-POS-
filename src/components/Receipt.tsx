import { Order } from '../types/types';
import { Printer } from 'lucide-react';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
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

export default function Receipt({ order, onClose }: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:p-0 print:bg-white">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 print:shadow-none print:p-0">
        {/* Receipt Content */}
        <div className="print:text-black" id="receipt">
          <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-1">PoshPOS</h2>
            <p className="text-gray-500 text-sm">
              {new Date(order.date).toLocaleDateString('id-ID')} {new Date(order.date).toLocaleTimeString('id-ID')}
            </p>
            <p className="text-gray-500 text-sm">Order #{order.id}</p>
          </div>

          <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
            <table className="w-full">
              <thead className="text-left">
                <tr>
                  <th className="text-gray-600">Item</th>
                  <th className="text-gray-600 text-right">Jml</th>
                  <th className="text-gray-600 text-right">Harga</th>
                  <th className="text-gray-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{formatIDR(item.price)}</td>
                    <td className="text-right">{formatIDR(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right border-b border-dashed border-gray-300 pb-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatIDR(order.total)}</span>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>Terima kasih atas kunjungan Anda!</p>
          </div>
        </div>

        {/* Action Buttons - hidden during print */}
        <div className="mt-6 flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Cetak Struk
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
