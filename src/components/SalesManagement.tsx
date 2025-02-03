import { useEffect, useState } from 'react';
import { Order } from '../types/types';
import { FileText, TrendingUp, DollarSign, Download, Printer } from 'lucide-react';

// Helper function to format currency
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SalesManagement() {
  const [sales, setSales] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const salesJournal = JSON.parse(localStorage.getItem('salesJournal') || '[]');
    setSales(salesJournal);

    // Calculate statistics
    const revenue = salesJournal.reduce((sum: number, order: Order) => sum + order.total, 0);
    setTotalRevenue(revenue);

    const items = salesJournal.reduce((sum: number, order: Order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    setTotalItems(items);
  }, []);

  const downloadCSV = () => {
    // Create CSV header
    let csvContent = 'Tanggal,ID Pesanan,Items,Jumlah,Total\n';

    // Add data rows
    sales.forEach(order => {
      const date = new Date(order.date).toLocaleString('id-ID');
      const itemsList = order.items.map(item => `${item.name} (${item.quantity})`).join('; ');
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      csvContent += `"${date}","${order.id}","${itemsList}",${totalQuantity},${order.total}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Penjualan - ${new Date().toLocaleDateString('id-ID')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .header { margin-bottom: 30px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Penjualan</h1>
            <p>Dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
          </div>

          <div class="stats">
            <div class="stat-card">
              <h3>Total Pendapatan</h3>
              <p>${formatIDR(totalRevenue)}</p>
            </div>
            <div class="stat-card">
              <h3>Total Pesanan</h3>
              <p>${sales.length}</p>
            </div>
            <div class="stat-card">
              <h3>Item Terjual</h3>
              <p>${totalItems}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>ID Pesanan</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${sales.map(order => `
                <tr>
                  <td>${new Date(order.date).toLocaleString('id-ID')}</td>
                  <td>#${order.id}</td>
                  <td>${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</td>
                  <td>${formatIDR(order.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Penjualan</h2>
        <div className="flex gap-2">
          <button
            onClick={printReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Printer size={20} />
            Cetak Laporan
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Download size={20} />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold text-gray-800">{formatIDR(totalRevenue)}</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Item Terjual</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString('id-ID')} {new Date(order.date).toLocaleTimeString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-md overflow-hidden">
                    {order.items.map((item, index) => (
                      <span key={item.id}>
                        {item.quantity}x {item.name}
                        {index < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatIDR(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto mb-2" size={24} />
            <p>Belum ada data penjualan</p>
          </div>
        )}
      </div>
    </div>
  );
}
