import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  supplier: string;
  purchase_price: number;
  sale_price: number;
  status: string;
  low_stock_threshold: number;
};

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<{ category?: string; status?: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = () => api.get('/api/products', { params: { search, ...filter } }).then(r => setProducts(r.data));
  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => products, [products]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(form.entries());
    data.quantity = Number(data.quantity || 0);
    data.purchase_price = Number(data.purchase_price || 0);
    data.sale_price = Number(data.sale_price || 0);
    data.low_stock_threshold = Number(data.low_stock_threshold || 10);
    if (editing) await api.put(`/api/products/${editing.id}`, data); else await api.post('/api/products', data);
    setModalOpen(false); setEditing(null); e.currentTarget.reset();
    fetchProducts();
  };

  const remove = async (id: number) => { await api.delete(`/api/products/${id}`); fetchProducts(); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU" className="px-3 py-2 border rounded" />
        <select onChange={(e)=>setFilter(f=>({...f, status: e.target.value||undefined}))} className="px-3 py-2 border rounded">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={fetchProducts} className="px-3 py-2 border rounded bg-blue-600 text-white">Search</button>
        <button onClick={()=>{ setEditing(null); setModalOpen(true); }} className="px-3 py-2 border rounded">Add Product</button>
      </div>

      <div className="overflow-auto rounded border bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <Th>Name</Th><Th>SKU</Th><Th>Category</Th><Th>Qty</Th><Th>Supplier</Th><Th>Purchase</Th><Th>Sale</Th><Th>Status</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className={p.quantity <= p.low_stock_threshold ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                <Td>{p.name}</Td>
                <Td>{p.sku}</Td>
                <Td>{p.category}</Td>
                <Td>{p.quantity}</Td>
                <Td>{p.supplier}</Td>
                <Td>${p.purchase_price}</Td>
                <Td>${p.sale_price}</Td>
                <Td>{p.status}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded" onClick={()=>{ setEditing(p); setModalOpen(true); }}>Edit</button>
                    <button className="px-2 py-1 border rounded" onClick={()=>remove(p.id)}>Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded bg-white dark:bg-gray-900 p-4 border">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">{editing ? 'Edit' : 'Add'} Product</h3>
              <button onClick={()=>{ setModalOpen(false); setEditing(null); }}>✕</button>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input name="name" label="Name" defaultValue={editing?.name} required />
              <Input name="sku" label="SKU" defaultValue={editing?.sku} required />
              <Input name="category" label="Category" defaultValue={editing?.category} />
              <Input name="quantity" type="number" label="Quantity" defaultValue={editing?.quantity} />
              <Input name="supplier" label="Supplier" defaultValue={editing?.supplier} />
              <Input name="purchase_price" type="number" step="0.01" label="Purchase Price" defaultValue={editing?.purchase_price} />
              <Input name="sale_price" type="number" step="0.01" label="Sale Price" defaultValue={editing?.sale_price} />
              <Select name="status" label="Status" defaultValue={editing?.status || 'active'} options={[{label:'active', value:'active'},{label:'inactive', value:'inactive'}]} />
              <Input name="low_stock_threshold" type="number" label="Low Stock Threshold" defaultValue={editing?.low_stock_threshold} />
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={()=>{ setModalOpen(false); setEditing(null); }} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-2 border rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
function Select({ label, options, ...rest }: any) { return (
  <label className="flex flex-col gap-1">
    <span className="text-sm text-gray-500">{label}</span>
    <select {...rest} className="px-3 py-2 border rounded">
      {options.map((o: any)=> <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </label>
); }


