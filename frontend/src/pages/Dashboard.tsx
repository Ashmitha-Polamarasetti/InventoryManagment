import { useEffect, useState } from 'react';
import api from '../lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const [overview, setOverview] = useState<{ totalStock: number; lowStockItems: number; suppliers: number; monthlyExpenses: number } | null>(null);

  useEffect(() => {
    api.get('/api/dashboard/overview').then(r => setOverview(r.data));
  }, []);

  const COLORS = ['#10b981', '#ef4444'];
  const inventoryData = [
    { name: 'In Stock', value: Math.max((overview?.totalStock || 0) - (overview?.lowStockItems || 0), 0) },
    { name: 'Low Stock', value: overview?.lowStockItems || 0 },
  ];

  const topProducts = [
    { name: 'Mouse', sales: 120 },
    { name: 'Keyboard', sales: 80 },
    { name: 'Monitor', sales: 60 },
    { name: 'Cable', sales: 40 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Total Stock" value={overview?.totalStock ?? 0} />
        <Stat title="Low Stock Items" value={overview?.lowStockItems ?? 0} />
        <Stat title="Suppliers" value={overview?.suppliers ?? 0} />
        <Stat title="Monthly Expenses" value={`$${overview?.monthlyExpenses ?? 0}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded border bg-white dark:bg-gray-900">
          <h3 className="font-semibold mb-2">Inventory Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={inventoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 rounded border bg-white dark:bg-gray-900">
          <h3 className="font-semibold mb-2">Top Selling Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="p-4 rounded border bg-white dark:bg-gray-900">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}


