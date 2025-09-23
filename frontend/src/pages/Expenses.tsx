import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import * as XLSX from 'xlsx';

type Expense = { id: number; date: string; category: string; amount: number; description?: string };

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => api.get('/api/expenses').then(r => setExpenses(r.data));
  useEffect(() => { load(); }, []);

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { const m = e.date.slice(0,7); map[m] = (map[m]||0) + Number(e.amount); });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [expenses]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(form.entries());
    data.amount = Number(data.amount || 0);
    await api.post('/api/expenses', data);
    setModalOpen(false); e.currentTarget.reset();
    load();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, 'expenses.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Expenses</div>
        <div className="flex gap-2">
          <button onClick={()=>setModalOpen(true)} className="px-3 py-2 border rounded">Add Expense</button>
          <button onClick={exportExcel} className="px-3 py-2 border rounded">Export Excel</button>
        </div>
      </div>
      <div className="overflow-auto rounded border bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800"><tr><Th>Date</Th><Th>Category</Th><Th>Amount</Th><Th>Description</Th></tr></thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <Td>{e.date}</Td>
                <Td>{e.category}</Td>
                <Td>${e.amount}</Td>
                <Td>{e.description}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded bg-white dark:bg-gray-900 p-4 border">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Add Expense</h3>
              <button onClick={()=>setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
              <Input name="date" type="date" label="Date" required />
              <Input name="category" label="Category" required />
              <Input name="amount" type="number" step="0.01" label="Amount" required />
              <Input name="description" label="Description" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setModalOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-2 border rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-2">Monthly Expense Totals</h3>
        <ul className="space-y-1">
          {byMonth.map(m => <li key={m.name} className="flex justify-between"><span>{m.name}</span><span>${m.total.toFixed(2)}</span></li>)}
        </ul>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left p-2">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="p-2 border-t">{children}</td>; }
function Input(props: any) { return (
  <label className="flex flex-col gap-1">
    <span className="text-sm text-gray-500">{props.label}</span>
    <input {...props} className="px-3 py-2 border rounded" />
  </label>
); }


