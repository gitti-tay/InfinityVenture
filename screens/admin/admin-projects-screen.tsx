import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import api from '@/app/api/client';

export function AdminProjectsScreen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', symbol: '', category: 'Real Estate', location: '', description: '', image: '', series: '', badge: '', riskLevel: 'Medium', targetAmount: '', minInvestment: '500', maxInvestment: '100000', plans: '[]' });
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await api.request('GET', '/admin/projects');
      setProjects(res.projects || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      let parsedPlans;
      try { parsedPlans = JSON.parse(form.plans); } catch { alert('Invalid plans JSON'); setSaving(false); return; }
      await api.request('POST', '/admin/projects', { ...form, targetAmount: parseFloat(form.targetAmount) || 0, minInvestment: parseFloat(form.minInvestment) || 500, maxInvestment: parseFloat(form.maxInvestment) || 100000, plans: parsedPlans });
      setShowCreate(false); setForm({ name: '', symbol: '', category: 'Real Estate', location: '', description: '', image: '', series: '', badge: '', riskLevel: 'Medium', targetAmount: '', minInvestment: '500', maxInvestment: '100000', plans: '[]' });
      loadProjects();
    } catch (e: any) { alert(e.message); }
    setSaving(false);
  };

  const handleUpdate = async (id: string, updates: any) => {
    try {
      await api.request('PUT', `/admin/projects/${id}`, updates);
      setEditing(null); loadProjects();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? Active investments prevent deletion.')) return;
    try { await api.request('DELETE', `/admin/projects/${id}`); loadProjects(); } catch (e: any) { alert(e.message); }
  };

  const handleToggle = async (id: string, isActive: number) => {
    await handleUpdate(id, { isActive: isActive ? 0 : 1 });
  };

  const categories = ['Real Estate', 'Agriculture', 'Healthcare', 'Fintech', 'Energy', 'Infrastructure', 'Technology'];
  const risks = ['Low', 'Medium', 'High'];

  return (
    <AdminLayout title="Project Management">
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>Investment Projects</h2>
            <p style={{ color: '#666', fontSize: 14 }}>{projects.length} projects total</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>+ New Project</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: 16 }}>
            {projects.map(p => {
              const plans = Array.isArray(p.plans) ? p.plans : [];
              return (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, opacity: p.is_active ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{p.name}</h3>
                        {p.is_featured ? <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>⭐ Featured</span> : null}
                        <span style={{ background: p.is_active ? '#dcfce7' : '#fee2e2', color: p.is_active ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{p.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <p style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>{p.category} · {p.location} · {p.risk_level} Risk</p>
                      <p style={{ color: '#888', fontSize: 13 }}>{p.description?.slice(0, 100)}...</p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13 }}>
                        <span>Target: <b>${(p.target_amount || 0).toLocaleString()}</b></span>
                        <span>Raised: <b>${(p.raised_amount || 0).toLocaleString()}</b></span>
                        <span>Investors: <b>{p.investor_count || 0}</b></span>
                        <span>Plans: <b>{plans.length}</b></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleToggle(p.id, p.is_active)} style={{ padding: '6px 12px', background: p.is_active ? '#fee2e2' : '#dcfce7', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>{p.is_active ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => handleUpdate(p.id, { isFeatured: p.is_featured ? 0 : 1 })} style={{ padding: '6px 12px', background: '#fef3c7', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>{p.is_featured ? 'Unfeature' : 'Feature'}</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                  {plans.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {plans.map((plan: any, i: number) => (
                        <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12 }}>
                          <b>{plan.name}</b>: ${plan.min?.toLocaleString()} - ${plan.max?.toLocaleString()} · {plan.apy}% APY · {plan.term} · {plan.payout}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Create New Project</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {[['name', 'Project Name'], ['symbol', 'Symbol (3-4 chars)'], ['location', 'Location'], ['description', 'Description'], ['image', 'Image URL'], ['series', 'Series (Seed, Series A...)'], ['badge', 'Badge (Asset Backed, ESG...)'], ['targetAmount', 'Target Amount ($)'], ['minInvestment', 'Min Investment ($)'], ['maxInvestment', 'Max Investment ($)']].map(([key, label]) => (
                  <div key={key}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, marginTop: 4 }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Risk Level</label>
                    <select value={form.riskLevel} onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}>
                      {risks.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Investment Plans (JSON)</label>
                  <textarea value={form.plans} onChange={e => setForm(f => ({ ...f, plans: e.target.value }))} rows={5} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', marginTop: 4 }} placeholder='[{"name":"Basic","min":500,"max":5000,"apy":10,"term":"6 Months","payout":"Monthly"}]' />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCreate} disabled={saving || !form.name || !form.symbol} style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, opacity: saving ? 0.5 : 1 }}>{saving ? 'Creating...' : 'Create Project'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
