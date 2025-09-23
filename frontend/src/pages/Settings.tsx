import { useEffect, useState } from 'react';
import api from '../lib/api';

type Settings = { id?: number; company_name: string; currency: string; timezone: string; default_low_stock_threshold: number; logo_filename?: string };

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    // For demo, fetch first row or default
    api.get('/api/expenses') // dummy call to ensure backend reachable
      .finally(() => setSettings({ company_name: 'Acme Retail', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 }));
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Settings saved (demo)');
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const form = new FormData();
    form.append('logo', e.target.files[0]);
    await api.post('/api/settings/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Logo uploaded');
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-3">General</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Company Name" name="company_name" defaultValue={settings.company_name} />
          <Input label="Default Currency" name="currency" defaultValue={settings.currency} />
          <Input label="Timezone" name="timezone" defaultValue={settings.timezone} />
          <Input label="Low-stock Threshold" name="default_low_stock_threshold" type="number" defaultValue={settings.default_low_stock_threshold} />
          <div className="md:col-span-2">
            <label className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Logo</span>
              <input type="file" onChange={uploadLogo} />
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="px-3 py-2 border rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-3">Profile</h3>
        <div className="text-sm text-gray-500">Update your profile details (demo)</div>
      </div>
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <h3 className="font-semibold mb-3">Inventory Settings</h3>
        <div className="text-sm text-gray-500">Configure low stock alerts (demo)</div>
      </div>
    </div>
  );
}

function Input(props: any) { return (
  <label className="flex flex-col gap-1">
    <span className="text-sm text-gray-500">{props.label}</span>
    <input {...props} className="px-3 py-2 border rounded" />
  </label>
); }


