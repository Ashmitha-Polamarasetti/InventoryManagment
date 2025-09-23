import { useEffect, useState } from 'react';
import api from '../lib/api';

type User = { id: number; name: string; email: string; role: string; status: string; created_at: string };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const load = () => api.get('/api/users').then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(form.entries());
    if (editing) await api.put(`/api/users/${editing.id}`, data); else await api.post('/api/users', data);
    setModalOpen(false); setEditing(null); e.currentTarget.reset();
    load();
  };

  const remove = async (id: number) => { await api.delete(`/api/users/${id}`); load(); };
  const deactivate = async (u: User) => { await api.put(`/api/users/${u.id}`, { status: u.status === 'active' ? 'inactive' : 'active' }); load(); };
  const resetPassword = async (id: number) => { await api.post(`/api/users/${id}/reset-password`); alert('Temporary password set.'); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Users</div>
        <button onClick={()=>{ setEditing(null); setModalOpen(true); }} className="px-3 py-2 border rounded">Add User</button>
      </div>
      <div className="overflow-auto rounded border bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Joined</Th><Th></Th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.email}</Td>
                <Td>{u.role}</Td>
                <Td>{u.status}</Td>
                <Td>{new Date(u.created_at).toLocaleDateString()}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded" onClick={()=>{ setEditing(u); setModalOpen(true); }}>Edit</button>
                    <button className="px-2 py-1 border rounded" onClick={()=>deactivate(u)}>{u.status==='active'?'Deactivate':'Activate'}</button>
                    <button className="px-2 py-1 border rounded" onClick={()=>resetPassword(u.id)}>Reset PW</button>
                    <button className="px-2 py-1 border rounded" onClick={()=>remove(u.id)}>Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded bg-white dark:bg-gray-900 p-4 border">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">{editing ? 'Edit' : 'Add'} User</h3>
              <button onClick={()=>{ setModalOpen(false); setEditing(null); }}>✕</button>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
              <Input name="name" label="Name" defaultValue={editing?.name} required />
              <Input name="email" label="Email" type="email" defaultValue={editing?.email} required />
              <Select name="role" label="Role" defaultValue={editing?.role || 'staff'} options={[{label:'admin',value:'admin'},{label:'manager',value:'manager'},{label:'staff',value:'staff'}]} />
              <Select name="status" label="Status" defaultValue={editing?.status || 'active'} options={[{label:'active',value:'active'},{label:'inactive',value:'inactive'}]} />
              <div className="flex justify-end gap-2">
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


