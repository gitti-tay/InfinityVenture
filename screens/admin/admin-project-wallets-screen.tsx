import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './admin-layout';
import { adminClient } from '@/app/api/adminClient';

export function AdminProjectWalletsScreen() {
  const [mappings, setMappings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ projectId: '', adminWalletId: '', allocationPercent: 100 });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [mapRes, projRes, walRes] = await Promise.all([
        adminClient.get('/compliance/admin/project-wallets'),
        adminClient.get('/admin/projects'),
        adminClient.get('/admin/wallets'),
      ]);
      setMappings(mapRes.mappings || []);
      setProjects(projRes.projects || []);
      setWallets(walRes.wallets || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const createMapping = async () => {
    if (!form.projectId || !form.adminWalletId) {
      alert('Select both project and wallet');
      return;
    }
    try {
      await adminClient.post('/compliance/admin/project-wallets', form);
      setShowCreate(false);
      setForm({ projectId: '', adminWalletId: '', allocationPercent: 100 });
      loadData();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Error creating mapping');
    }
  };

  const deleteMapping = async (id: string) => {
    if (!confirm('Remove this project-wallet assignment?')) return;
    try {
      await adminClient.delete(`/compliance/admin/project-wallets/${id}`);
      loadData();
    } catch (e) { alert('Error deleting'); }
  };

  // Build mapping status per project
  const projectStatus = projects.map(p => {
    const assigned = mappings.filter(m => m.project_id === p.id);
    return { ...p, assigned };
  });

  return (
    <AdminLayout title="Project → Wallet Mapping">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-xl">⚡</span>
          <div>
            <div className="font-semibold text-amber-900 text-sm">Investment Fund Routing</div>
            <div className="text-xs text-amber-700 mt-0.5">
              Map each investment project to a receiving admin wallet. When users invest, funds are tracked to the assigned wallet.
              Projects without a mapping use the default treasury wallet.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          {mappings.length} Active Mapping{mappings.length !== 1 ? 's' : ''} · {projects.length} Projects
        </h3>
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          + New Mapping
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
          <h4 className="font-semibold text-sm mb-3">Assign Wallet to Project</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Project</label>
              <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="">Select project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.symbol})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Admin Wallet</label>
              <select value={form.adminWalletId} onChange={e => setForm({ ...form, adminWalletId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="">Select wallet...</option>
                {wallets.filter(w => w.is_active).map(w => (
                  <option key={w.id} value={w.id}>{w.label} ({w.network} - {w.currency})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Allocation %</label>
              <input type="number" min="1" max="100" value={form.allocationPercent}
                onChange={e => setForm({ ...form, allocationPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={createMapping} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
              Create Mapping
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects with Wallet Assignments */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {projectStatus.map(project => (
            <div key={project.id} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm">{project.name}</span>
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{project.symbol}</span>
                  {project.category && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{project.category}</span>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${project.assigned.length > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {project.assigned.length > 0 ? `${project.assigned.length} wallet(s)` : 'No wallet assigned'}
                </span>
              </div>

              {project.assigned.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {project.assigned.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
                      <div className="text-xs">
                        <span className="font-medium">{m.wallet_label}</span>
                        <span className="text-gray-400 ml-2">{m.network} · {m.currency}</span>
                        <div className="text-gray-400 font-mono mt-0.5 text-[10px]">{m.address}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                          {m.allocation_percent}%
                        </span>
                        <button onClick={() => deleteMapping(m.id)}
                          className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded text-xs">
                  ⚠ No wallet assigned — investments will use default treasury wallet
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
