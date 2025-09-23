import { useEffect, useState } from 'react';
import api from '../lib/api';

type User = { id: number; name: string; email: string; role: string; status?: string };
type Product = { id: number; name: string; sku: string; category?: string; quantity: number; supplier?: string; sale_price?: number; status?: string };
type Expense = { id: number; date: string; category: string; amount: number; description?: string };
type Settings = { id: number; company_name: string; currency: string; timezone: string; default_low_stock_threshold: number } | null;
type Assignment = { product_id: number; user_id: number };

export default function DataViewer() {
  const [loginData, setLoginData] = useState<{ user: User | null } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const loginResp = await api.post('/api/login', { email: 'admin@example.com' });
        setLoginData({ user: loginResp.data.user || null });

        const dataResp = await api.get('/api/data');
        setUsers(dataResp.data.users || []);
        setProducts(dataResp.data.products || []);
        setExpenses(dataResp.data.expenses || []);
        setSettings(dataResp.data.settings || null);
        setAssignments(dataResp.data.relationships?.productAssignments || []);
      } catch (e) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-2">Login</h2>
        <div>Logged in as: <span className="font-mono">{loginData?.user?.email || 'N/A'}</span></div>
      </div>

      <DataTable title="Users" headers={["ID","Name","Email","Role","Status"]} rows={users.map(u => [u.id, u.name, u.email, u.role, u.status || '-'])} />
      <DataTable title="Products" headers={["ID","Name","SKU","Category","Qty","Supplier","Price","Status"]} rows={products.map(p => [p.id, p.name, p.sku, p.category || '-', p.quantity, p.supplier || '-', formatCurrency(p.sale_price), p.status || '-'])} />
      <DataTable title="Expenses" headers={["ID","Date","Category","Amount","Description"]} rows={expenses.map(ex => [ex.id, ex.date, ex.category, formatCurrency(ex.amount), ex.description || '-'])} />

      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-2">Settings</h2>
        {settings ? (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Kv label="Company" value={settings.company_name} />
            <Kv label="Currency" value={settings.currency} />
            <Kv label="Timezone" value={settings.timezone} />
            <Kv label="Default Low Stock Threshold" value={String(settings.default_low_stock_threshold)} />
          </dl>
        ) : <div>No settings</div>}
      </div>

      <DataTable title="Product Assignments" headers={["Product ID","User ID"]} rows={assignments.map(a => [a.product_id, a.user_id])} />
    </div>
  );
}

function DataTable({ title, headers, rows }: { title: string; headers: (string)[]; rows: (string | number | null | undefined)[][] }) {
  return (
    <div className="p-4 rounded border bg-white dark:bg-gray-900 overflow-auto">
      <h2 className="font-semibold mb-2">{title}</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            {headers.map((h, i) => (<th key={i} className="py-2 pr-6">{h}</th>))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              {r.map((c, j) => (<td key={j} className="py-2 pr-6 whitespace-nowrap">{String(c ?? '')}</td>))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="py-2 text-gray-500" colSpan={headers.length}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-mono">{value}</div>
    </div>
  );
}

function formatCurrency(v: number | undefined) {
  if (v === undefined || v === null) return '-';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v));
  } catch {
    return `$${Number(v).toFixed(2)}`;
  }
}


